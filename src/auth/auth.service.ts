import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Tokens } from "./type/tokens.type";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) {}

    async register(dto: AuthDto): Promise<Tokens> {
        // generate new password
        const hash = await argon.hash(dto.password)
        try {
            // save the new user
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                }
            })
            // get tokens
            const tokens = await this.getTokens(user.id, user.email)
            // store refresh token in database
            await this.updateRtHash(user.id, tokens.refresh_token)
            // return tokens
            return tokens
        } catch(error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw error
        }
    }

    async login(dto: AuthDto): Promise<Tokens> {
        // find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        // if user does not exist throw exception
        if(!user) throw new ForbiddenException('Access denied')
        // compare password
        const pwMatches = await argon.verify(user.hash, dto.password)
        // if password is incorrect throw exception
        if(!pwMatches) throw new ForbiddenException('Access denied')
        // get tokens
        const tokens = await this.getTokens(user.id, user.email)
        // store refresh token in database
        await this.updateRtHash(user.id, tokens.refresh_token)
        // return tokens
        return tokens
    }

    async logout(userId: number): Promise<void> {
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: null
            }
        })
        return 
    }

    async refreshTokens(userId: number, rt: string): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        })
        // if user was not found throw forbidden exception
        if(!user || !user.refreshToken) throw new ForbiddenException('Access denied')
        // compare sent refresh token with token from database
        const rtMatches = argon.verify(user.refreshToken, rt)
        // if tokens dont match throw forbidden exception
        if(!rtMatches) throw new ForbiddenException('Access denied')
        // get tokens
        const tokens = await this.getTokens(user.id, user.email)
        // store refresh token in database
        await this.updateRtHash(user.id, tokens.refresh_token)
        // return tokens
        return tokens
    }

    async updateRtHash(userId: number, rt: string) {
        const hash = await argon.hash(rt)
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: hash
            }
        })
    }

    async getTokens(userId: number, email: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwt.signAsync({
                sub: userId,
                email
            }, {
                secret: this.config.get('AT_SECRET'),
                expiresIn: 60 * 15
            }),
            this.jwt.signAsync({
                sub: userId,
                email
            }, {
                secret: this.config.get('RT_SECRET'),
                expiresIn: 60 * 60 * 24 * 7
            })
        ])

        return {
            access_token: at,
            refresh_token: rt
        }
    }
}