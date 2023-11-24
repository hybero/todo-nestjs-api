import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { EditUserDto } from './dto';

describe('TaskService', () => {
    let service: UserService
    let prisma: PrismaService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [UserService, PrismaService, ConfigService],
        }).compile();

        service = module.get<UserService>(UserService);
        prisma = module.get<PrismaService>(PrismaService)
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const mockMeUser = {
        "id": 2,
        "createdAt": "2023-10-23T08:36:34.899Z",
        "updatedAt": "2023-11-22T17:51:21.335Z",
        "email": "adam77@email.com",
        "firstName": null,
        "lastName": null,
        "refreshToken": "$argon2id$v=19$m=65536,t=3,p=4$+fPpWuJdagmQDTLC/e7uSg$ksqoX8lWc7c7GqXHV9C8UWx0SzKqhVmX3HT/E2MAND8"
    }

    const editUserDto: EditUserDto = {
        email: 'adam77@email.com',
        firstName: null,
        lastName: null
    }

    describe('getMe', () => {
        it('should return user (me)', async () => {
            prisma.user.findFirst = jest.fn().mockReturnValueOnce(mockMeUser)

            const result = await service.getMe(2)
            expect(result).toEqual(mockMeUser)

            expect(prisma.user.findFirst).toHaveBeenCalled()
        })
    })

    describe('editUser', () => {
        it('should return edited user', async () => {
            prisma.user.update = jest.fn().mockReturnValueOnce(mockMeUser)

            const result = await service.editUser(editUserDto, 2)
            expect(result).toEqual(mockMeUser)

            expect(prisma.user.update).toHaveBeenCalled()
        })
    })
});
