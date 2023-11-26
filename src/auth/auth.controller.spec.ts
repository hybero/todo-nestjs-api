import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';

describe('UserController', () => {
    let controller: AuthController;

    const mockTokens = {
        access_token: 'access-token',
        refresh_token: 'refresh-token'
    }

    const mockAuthService = {
        register: jest.fn().mockImplementation((dto) => {
            return mockTokens
        }),
        login: jest.fn().mockImplementation((dto) => {
            return mockTokens
        }),
        logout: jest.fn().mockImplementation((userId) => {
            return null
        }),
        refreshTokens: jest.fn().mockImplementation((userId, refreshToken) => {
            return mockTokens
        })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService]
        })
          .overrideProvider(AuthService)
          .useValue(mockAuthService)
          .compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    const registerDto = {
        email: 'test77@email.com',
        password: 'test123'
    }

    describe('register', () => {
        it('should return tokens', async () => {
            expect(controller.register(registerDto)).toEqual(mockTokens)

            expect(mockAuthService.register).toHaveBeenCalled()
        })
    })

    describe('login', () => {
        it('should return tokens', async () => {
            expect(controller.login(registerDto)).toEqual(mockTokens)

            expect(mockAuthService.login).toHaveBeenCalled()
        })
    })

    describe('logout', () => {
        it('should return no content', async () => {
            expect(controller.logout(2)).toEqual(null)

            expect(mockAuthService.logout).toHaveBeenCalled()
        })
    })

    describe('refreshTokens', () => {
        it('should return tokens', async () => {
            expect(controller.refreshTokens(2, mockTokens.refresh_token)).toEqual(mockTokens)

            expect(mockAuthService.refreshTokens).toHaveBeenCalled()
        })
    })
});
