import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { TaskDto } from './dto/task.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TaskFlagDto } from './dto/task-flag.dto';

describe('TaskService', () => {
    let service: TaskService
    let prisma: PrismaService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [TaskService, PrismaService, ConfigService],
        }).compile();

        service = module.get<TaskService>(TaskService);
        prisma = module.get<PrismaService>(PrismaService)
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const newTaskDto: TaskDto = {
        listId: "1",
        title: "Title 1",
        description: "Desc 1",
        deadline: new Date("2023-11-16T11:44:19.617Z")
    }

    const mockListUser = { 
        id: 3, 
        userId: 2, 
        listId: 1 
    }

    const mockCreatedTask = {
        "id": 10,
        "createdAt": "2023-11-22T08:40:44.896Z",
        "updatedAt": "2023-11-22T08:40:44.896Z",
        "listId": 13,
        "userId": 2,
        "title": "task13",
        "description": "desc13",
        "flag": "active",
        "deadline": "2023-11-28T13:34:55.897Z",
        "list": {
            "id": 13,
            "createdAt": "2023-11-16T12:09:54.276Z",
            "updatedAt": "2023-11-16T12:09:54.276Z",
            "title": "list13",
            "description": null
        },
        "user": {
            "id": 2,
            "createdAt": "2023-10-23T08:36:34.899Z",
            "updatedAt": "2023-11-22T08:40:15.611Z",
            "email": "adam77@email.com",
            "firstName": null,
            "lastName": null
        }
    }

    const mockChangeFlagDto: TaskFlagDto = {
        flag: "cancelled"
    }

    const mockTask = {
        id: 1,
        createdAt: '2023-10-23T08:56:26.352Z',
        updatedAt: '2023-11-21T10:08:16.169Z',
        listId: 1,
        userId: 1,
        title: 'task4',
        description: 'desc4',
        flag: 'cancelled',
        deadline: '2023-11-28T13:34:55.897Z',
        list: {
            id: 1,
            createdAt: '2023-10-23T08:34:40.260Z',
            updatedAt: '2023-10-23T08:34:40.260Z',
            title: 'list1',
            description: 'desc1'
        }
    }

    const mockUpdatedTask = {
        "id": 1,
        "createdAt": "2023-10-23T08:56:26.352Z",
        "updatedAt": "2023-11-22T09:09:15.014Z",
        "listId": 1,
        "userId": 1,
        "title": "task4",
        "description": "desc4",
        "flag": "cancelled",
        "deadline": "2023-11-28T13:34:55.897Z"
    }

    describe('createTask', () => {
        it('should throw ForbiddenException if list does not belong to the user', async () => {
            prisma.listUser.findUnique = jest.fn().mockReturnValueOnce(false)

            await expect(service.createTask(newTaskDto, 1, 2)).rejects.toThrow(ForbiddenException)

            expect(prisma.listUser.findUnique).toHaveBeenCalled()
        })

        it('should create a task', async () => {
            prisma.listUser.findUnique = jest.fn().mockReturnValueOnce(mockListUser)
            prisma.task.create = jest.fn().mockReturnValueOnce(mockCreatedTask)

            const result = await service.createTask(newTaskDto, 1, 2)
            expect(result).toEqual(mockCreatedTask)

            expect(prisma.listUser.findUnique).toHaveBeenCalled()
            expect(prisma.task.create).toHaveBeenCalled()
        })
    })

    describe('changeFlag', () => {
        it('should throw NotFoundException if task does not exist', async () => {
            prisma.task.findUnique = jest.fn().mockReturnValueOnce(false)

            await expect(service.changeFlag(mockChangeFlagDto, 1, 2)).rejects.toThrow(NotFoundException)

            expect(prisma.task.findUnique).toHaveBeenCalled()
        })

        it('should throw ForbiddenException if list does not belong to the user', async () => {
            prisma.task.findUnique = jest.fn().mockReturnValueOnce(mockTask)
            prisma.listUser.findUnique = jest.fn().mockReturnValueOnce(false)

            await expect(service.changeFlag(mockChangeFlagDto, 1, 2)).rejects.toThrow(ForbiddenException)

            expect(prisma.task.findUnique).toHaveBeenCalled()
            expect(prisma.listUser.findUnique).toHaveBeenCalled()
        })

        it('should change a flag', async () => {
            prisma.task.findUnique = jest.fn().mockReturnValueOnce(mockTask)
            prisma.listUser.findUnique = jest.fn().mockReturnValueOnce(mockListUser)
            prisma.task.update = jest.fn().mockReturnValueOnce(mockUpdatedTask)

            const result = await service.changeFlag(mockChangeFlagDto, 1, 2)
            expect(result).toEqual(mockUpdatedTask)

            expect(prisma.task.findUnique).toHaveBeenCalled()
            expect(prisma.listUser.findUnique).toHaveBeenCalled()
            expect(prisma.task.update).toHaveBeenCalled()
        })
    })
});
