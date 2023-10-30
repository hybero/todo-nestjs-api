import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskDto } from './dto/task.dto';
import { Task } from './type/task.type';
import { TaskFlagDto } from './dto/task-flag.dto';

@Injectable()
export class TaskService {
    constructor(
        private prisma: PrismaService
    ) {}

    async createTask(dto: TaskDto, listId: number, userId: number): Promise<Task> {
        // check if list belongs to user
        const listUser = this.prisma.listUser.findUnique({
            where: {
                userId_listId: {
                    userId: userId,
                    listId: listId
                }
            }
        })
        if(!listUser) throw new ForbiddenException('List does not belong to user')
        // create task
        const task = await this.prisma.task.create({
            data: {
                listId: listId,
                title: dto.title,
                description: dto.description,
                userId: userId,
                deadline: dto.deadline
            },
            include: {
                list: {
                    select: {
                        id: true,
                        createdAt: true,
                        updatedAt: true,
                        title: true,
                        description: true
                    },
                },
                user: {
                    select: {
                        id: true,
                        createdAt: true,
                        updatedAt: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })
        return task
    }

    async changeFlag(dto: TaskFlagDto, taskId: number, userId: number): Promise<Task> {
        // get task with list
        const task = await this.prisma.task.findUnique({
            where: {
                id: taskId,
            },
            include: {
                list: true, // Include the associated list.
            },
        });
        if(!task) throw new NotFoundException('Task does not exist')
        // check if list belongs to user
        const listUser = this.prisma.listUser.findUnique({
            where: {
                userId_listId: {
                    userId: userId,
                    listId: task.list.id
                }
            }
        })
        if(!listUser) throw new ForbiddenException('List does not belong to user')
        // change the flag
        const updatedTask = this.prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                flag: dto.flag
            }
        })
        return updatedTask
    }
}
