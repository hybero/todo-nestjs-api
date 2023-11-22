import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from './list.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ListPrisma } from './type/list-prisma.type';

describe('ListService', () => {
    let service: ListService
    let prisma: PrismaService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ListService, PrismaService, ConfigService],
        }).compile();

        service = module.get<ListService>(ListService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const mockCreatedList = {
        "id": 10,
        "createdAt": "2023-11-16T11:44:19.617Z",
        "updatedAt": "2023-11-16T11:44:19.617Z",
        "title": "list10",
        "description": null,
        "users": [
            {
                "user": {
                    "id": 2,
                    "createdAt": "2023-10-23T08:36:34.899Z",
                    "updatedAt": "2023-11-16T11:44:00.232Z",
                    "email": "adam77@email.com",
                    "firstName": null,
                    "lastName": null
                }
            }
        ]
    }

    const mockCreatedListAfterModify = {
        "id": 10,
        "createdAt": "2023-11-16T11:44:19.617Z",
        "updatedAt": "2023-11-16T11:44:19.617Z",
        "title": "list10",
        "description": null,
        "users": [
            {
                "id": 2,
                "createdAt": "2023-10-23T08:36:34.899Z",
                "updatedAt": "2023-11-16T11:44:00.232Z",
                "email": "adam77@email.com",
                "firstName": null,
                "lastName": null
            }
        ]
    }

    const mockUsersListsAfterModify = [
        {
            "id": 10,
            "createdAt": "2023-11-16T11:44:19.617Z",
            "updatedAt": "2023-11-16T11:44:19.617Z",
            "title": "list10",
            "description": null
        }
    ]

    const mockCreateListDto = {
        "title": "list10",
        "description": null,
    }

    const mockUser = {
        "id": 2,
        "createdAt": "2023-10-23T08:36:34.899Z",
        "updatedAt": "2023-11-16T11:44:00.232Z",
        "email": "adam77@email.com",
        "firstName": null,
        "lastName": null
    }

    const mockUserWithNoLists = {
        "id": 2,
        "createdAt": "2023-10-23T08:36:34.899Z",
        "updatedAt": "2023-11-16T11:44:00.232Z",
        "email": "adam77@email.com",
        "firstName": null,
        "lastName": null,
        "lists": []
    }

    const mockUserWithLists = {
        "id": 2,
        "createdAt": "2023-10-23T08:36:34.899Z",
        "updatedAt": "2023-11-16T11:44:00.232Z",
        "email": "adam77@email.com",
        "firstName": null,
        "lastName": null,
        "lists": [
            {
                "list": {
                    "id": 10,
                    "createdAt": "2023-11-16T11:44:19.617Z",
                    "updatedAt": "2023-11-16T11:44:19.617Z",
                    "title": "list10",
                    "description": null,
                }
            }
        ]
    }

    describe('createList', () => {
        it('should create a list', async () => {
            prisma.list.create = jest.fn().mockReturnValueOnce(mockCreatedList)
            prisma.listUser.create = jest.fn()
            prisma.list.findUnique = jest.fn().mockReturnValueOnce(mockCreatedList)

            const result = await service.createList(mockCreateListDto, 2)
            expect(result).toEqual(mockCreatedListAfterModify)

            expect(prisma.list.create).toHaveBeenCalled()
            expect(prisma.listUser.create).toHaveBeenCalled()
            expect(prisma.list.findUnique).toHaveBeenCalled()
        })
    })

    describe('getAllLists', () => {
        it('should return empty lists', async () => {
            prisma.list.findMany = jest.fn().mockReturnValueOnce([])

            const result = await service.getAllLists()
            expect(result).toEqual([])

            expect(prisma.list.findMany).toHaveBeenCalled()
        })

        it('should return all lists', async () => {
            prisma.list.findMany = jest.fn().mockReturnValueOnce([mockCreatedList])

            const result = await service.getAllLists()
            expect(result).toEqual([mockCreatedListAfterModify])

            expect(prisma.list.findMany).toHaveBeenCalled()
        })
    })

    describe('shareList', () => {
        it('should throw NotFoundException when no list is found', async () => {
            prisma.list.findUnique = jest.fn().mockReturnValueOnce(false)

            await expect(service.shareList(0, 2, 1)).rejects.toThrow(NotFoundException)

            expect(prisma.list.findUnique).toHaveBeenCalled()
        })

        it('should throw ForbiddenException when list does not belong to user', async () => {
            prisma.list.findUnique = jest.fn().mockReturnValueOnce(mockCreatedList)
            prisma.list.findFirst = jest.fn().mockResolvedValueOnce(false)

            await expect(service.shareList(0, 2, 1)).rejects.toThrow(ForbiddenException)

            expect(prisma.list.findUnique).toHaveBeenCalled()
            expect(prisma.list.findFirst).toHaveBeenCalled()
        })

        it('should throw NotFoundException when user does not exist', async () => {
            prisma.list.findUnique = jest.fn().mockReturnValueOnce(mockCreatedList)
            prisma.list.findFirst = jest.fn().mockResolvedValueOnce(mockCreatedList)
            prisma.user.findUnique = jest.fn().mockReturnValueOnce(false)

            await expect(service.shareList(0, 2, 1)).rejects.toThrow(NotFoundException)

            expect(prisma.list.findUnique).toHaveBeenCalled()
            expect(prisma.list.findFirst).toHaveBeenCalled()
            expect(prisma.user.findUnique).toHaveBeenCalled()
        })

        it('should throw ConflictException when user shares list with themselves', async () => {
            prisma.list.findUnique = jest.fn().mockReturnValueOnce(mockCreatedList)
            prisma.list.findFirst = jest.fn().mockResolvedValueOnce(mockCreatedList)
            prisma.user.findUnique = jest.fn().mockReturnValueOnce(mockUser)

            await expect(service.shareList(0, 2, 2)).rejects.toThrow(ConflictException)

            expect(prisma.list.findUnique).toHaveBeenCalled()
            expect(prisma.list.findFirst).toHaveBeenCalled()
            expect(prisma.user.findUnique).toHaveBeenCalled()
        })

        it('should return error with message when duplicate sharing', async () => {
            prisma.list.findUnique = jest.fn().mockReturnValueOnce(mockCreatedList)
            prisma.list.findFirst = jest.fn().mockResolvedValueOnce(mockCreatedList)
            prisma.user.findUnique = jest.fn().mockReturnValueOnce(mockUser)
            prisma.listUser.create = jest.fn().mockImplementation(() => {
                const error = new PrismaClientKnownRequestError('Test error message', { code: 'P2002', clientVersion: 'test'});
                throw error
            });
            
            const result = await service.shareList(0, 2, 1);
            expect(result).toEqual({ message: 'The list has already been shared with the user. No duplicate entry created.' })

            expect(prisma.list.findUnique).toHaveBeenCalled()
            expect(prisma.list.findFirst).toHaveBeenCalled()
            expect(prisma.user.findUnique).toHaveBeenCalled()
            expect(prisma.listUser.create).toHaveBeenCalled()
        })

        it('should share a list with user', async () => {
            prisma.list.findUnique = jest.fn().mockReturnValue(mockCreatedList)
            prisma.list.findFirst = jest.fn().mockResolvedValueOnce(mockCreatedList)
            prisma.user.findUnique = jest.fn().mockReturnValueOnce(mockUser)
            prisma.listUser.create = jest.fn()
            
            const result = await service.shareList(0, 2, 1)
            expect(result).toEqual(mockCreatedListAfterModify)

            expect(prisma.list.findUnique).toHaveBeenCalled()
            expect(prisma.list.findFirst).toHaveBeenCalled()
            expect(prisma.user.findUnique).toHaveBeenCalled()
            expect(prisma.listUser.create).toHaveBeenCalled()
        })
    })

    describe('getMyLists', () => {
        it('should return empty lists', async () => {
            prisma.user.findUnique = jest.fn().mockReturnValueOnce(mockUserWithNoLists)

            const result = await service.getMyLists(2)
            expect(result).toEqual([])

            expect(prisma.user.findUnique).toHaveBeenCalled()
        })

        it('should return array of users lists', async () => {
            prisma.user.findUnique = jest.fn().mockReturnValueOnce(mockUserWithLists)

            const result = await service.getMyLists(2)
            expect(result).toEqual(mockUsersListsAfterModify)

            expect(prisma.user.findUnique).toHaveBeenCalled()
        })
    })

    describe('modifyListData', () => {
        it('should return modified list data', () => {
            const result = service.modifyListData(mockCreatedList as unknown as ListPrisma)
            expect(result).toEqual(mockCreatedListAfterModify)
        })
    })
});
