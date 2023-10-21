import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListDto } from './dto/list.dto';

@Injectable()
export class ListService {
    constructor(
        private prisma: PrismaService
    ) {}

    async createList(dto: ListDto) {
        const list = await this.prisma.list.create({
            data: {
                title: dto.title,
                description: dto.description
            }
        })
        return { list }
    }
}
