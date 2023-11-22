import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService
    ) {}

    async getMe(userId: number): Promise<User> {
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId
            }
        })
        delete user.hash
        return user
    }

    async editUser(dto: EditUserDto, userId: number) {
        const user = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                ...dto
            }
        })
        delete user.hash
        return user
    }
}
