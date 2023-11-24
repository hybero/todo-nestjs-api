import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
    let controller: UserController;

    const mockUser = {
        "id": 2,
        "createdAt": "2023-10-23T08:36:34.899Z",
        "updatedAt": "2023-11-22T17:51:21.335Z",
        "email": "adam77@email.com",
        "firstName": null,
        "lastName": null,
        "refreshToken": "$argon2id$v=19$m=65536,t=3,p=4$+fPpWuJdagmQDTLC/e7uSg$ksqoX8lWc7c7GqXHV9C8UWx0SzKqhVmX3HT/E2MAND8"
    }

    const mockEditUser = {
        email: 'adam77@email.com',
        firstName: 'null',
        lastName: 'null'
    }

    const mockUserService = {
        getMe: jest.fn().mockImplementation((userId) => {
            return mockUser
        }),
        editUser: jest.fn().mockImplementation((dto, userId) => {
            return mockUser
        })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService]
        })
          .overrideProvider(UserService)
          .useValue(mockUserService)
          .compile();

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getMe', () => {
        it('should return users details', () => {
            expect(controller.getMe(2)).toEqual(mockUser)
            
            expect(mockUserService.getMe).toHaveBeenCalled()
        })

        it('should edit users details', () => {
            expect(controller.editUser(mockEditUser, 2)).toEqual(mockUser)
            
            expect(mockUserService.editUser).toHaveBeenCalled()
        })
    })
});
