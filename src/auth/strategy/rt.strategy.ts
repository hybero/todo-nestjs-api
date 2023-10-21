import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtType } from "../types/jwt.type";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
    constructor(
        private config: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('RT_SECRET'),
            passReqToCallback: true
        })
    }

    validate(req: Request, payload: JwtType) {
        const refreshToken = req.get('authorization').replace('Bearer', '').trim()
        return {
            ...payload,
            refreshToken
        }
    }
}