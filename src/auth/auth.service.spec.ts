import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ForbiddenException } from '@nestjs/common';

describe('TaskService', () => {
    let service: AuthService
    let prisma: PrismaService
    let jwt: JwtService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [AuthService, PrismaService, ConfigService, JwtService],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prisma = module.get<PrismaService>(PrismaService)
        jwt = module.get<JwtService>(JwtService)

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const registerDto = { 
        email: 'test77@example.com', 
        password: 'password123' 
    };

    const mockUser = {
        id: 3,
        createdAt: '2023-11-26T08:40:52.751Z',
        updatedAt: '2023-11-26T08:40:52.751Z',
        email: 'eric77@email.com',
        hash: '$argon2id$v=19$m=65536,t=3,p=4$ABMkjvP2RzuqQdWYE54U5A$jyy0EkWEMiTzhQDuOXrfnXQk+GgmSz9ow/WtUB5kg20',
        firstName: null,
        lastName: null,
        refreshToken: 'user-refresh-token'
    }

    const mockTokens = {
        access_token: 'access-token',
        refresh_token: 'refresh-token'
    }

    describe('register', () => {
        it('should throw ForbiddenException if email and password are used', async () => {
            jest.spyOn(argon, 'hash').mockResolvedValue('mockedHash');
            prisma.user.create = jest.fn().mockImplementation(() => {
                throw new PrismaClientKnownRequestError('Some Prisma error', { code: 'P2002', clientVersion: 'test' });
            })

            await expect(service.register(registerDto)).rejects.toThrowError(ForbiddenException);

            expect(argon.hash).toHaveBeenCalledWith('password123');
        })

        it('should register user', async () => {
            jest.spyOn(argon, 'hash').mockResolvedValue('mockedHash');
            prisma.user.create = jest.fn().mockReturnValueOnce(mockUser)
            
            const originalGetTokens = service.getTokens;
            service.getTokens = jest.fn().mockResolvedValue(mockTokens);
            const originalUpdateRtHash = service.updateRtHash
            service.updateRtHash = jest.fn()
    
            const result = await service.register(registerDto)
            expect(result).toEqual(mockTokens)

            expect(argon.hash).toHaveBeenCalledWith('password123');
            expect(service.getTokens).toHaveBeenCalled()
            expect(service.updateRtHash).toHaveBeenCalled()

            service.getTokens = originalGetTokens
            service.updateRtHash = originalUpdateRtHash
        })
    })

    describe('login', () => {
        it('should throw ForbiddenException if user does not exist', async () => {
            prisma.user.findUnique = jest.fn().mockReturnValueOnce(false)

            await expect(service.login(registerDto)).rejects.toThrowError(ForbiddenException)

            expect(prisma.user.findUnique).toHaveBeenCalled()
        })

        it('should throw ForbiddenException if passwords don\'t match', async () => {
            prisma.user.findUnique = jest.fn().mockReturnValueOnce(mockUser)
            jest.spyOn(argon, 'verify').mockResolvedValue(false);

            await expect(service.login(registerDto)).rejects.toThrowError(ForbiddenException)
            
            expect(prisma.user.findUnique).toHaveBeenCalled()
            expect(argon.verify).toHaveBeenCalled()
        })

        it('should return tokens', async () => {
            prisma.user.findUnique = jest.fn().mockReturnValueOnce(mockUser)
            jest.spyOn(argon, 'verify').mockResolvedValue(true);
            
            const originalGetTokens = service.getTokens;
            service.getTokens = jest.fn().mockResolvedValue(mockTokens);
            const originalUpdateRtHash = service.updateRtHash
            service.updateRtHash = jest.fn()

            const result = await service.login(registerDto)
            expect(result).toEqual(mockTokens)

            expect(argon.verify).toHaveBeenCalled();
            expect(service.getTokens).toHaveBeenCalled()
            expect(service.updateRtHash).toHaveBeenCalled()

            service.getTokens = originalGetTokens
            service.updateRtHash = originalUpdateRtHash
        })
    })

    describe('logout', () => {
        it('should return undefined', async () => {
            prisma.user.update = jest.fn()

            const result = await service.logout(2)
            expect(result).toEqual(undefined)

            expect(prisma.user.update).toHaveBeenCalled()
        })
    })

    describe('refreshTokens', () => {
        it('should throw ForbiddenException if user was not found', async () => {
            prisma.user.findUnique = jest.fn().mockReturnValueOnce(false)

            await expect(service.refreshTokens(2, mockTokens.refresh_token)).rejects.toThrow(ForbiddenException)

            expect(prisma.user.findUnique).toHaveBeenCalled()
        })

        it('should throw ForbiddenException if tokens don\'t match', async () => {
            prisma.user.findUnique = jest.fn().mockReturnValueOnce(mockUser)
            jest.spyOn(argon, 'verify').mockResolvedValue(false);

            await expect(service.refreshTokens(2, mockTokens.refresh_token)).rejects.toThrow(ForbiddenException)

            expect(prisma.user.findUnique).toHaveBeenCalled()
            expect(argon.verify).toHaveBeenCalled()
        })

        it('should return tokens', async () => {
            prisma.user.findUnique = jest.fn().mockReturnValueOnce(mockUser)
            jest.spyOn(argon, 'verify').mockResolvedValue(true);

            const originalGetTokens = service.getTokens;
            service.getTokens = jest.fn().mockResolvedValue(mockTokens);
            const originalUpdateRtHash = service.updateRtHash
            service.updateRtHash = jest.fn()

            const result = await service.refreshTokens(2, mockTokens.refresh_token)
            expect(result).toEqual(mockTokens)

            expect(prisma.user.findUnique).toHaveBeenCalled()
            expect(argon.verify).toHaveBeenCalled()
            expect(service.getTokens).toHaveBeenCalled()
            expect(service.updateRtHash).toHaveBeenCalled()
        })
    })

    describe('updateRtHash', () => {
        it('should update refresh token in database', async () => {
            jest.spyOn(argon, 'hash').mockResolvedValue('test')
            prisma.user.update = jest.fn().mockReturnValueOnce(mockUser)

            await service.updateRtHash(2, mockTokens.refresh_token)

            expect(argon.hash).toHaveBeenCalledWith(mockTokens.refresh_token);
            expect(prisma.user.update).toHaveBeenCalled()
        })
    })

    describe('getTokens', () => {
        it('should return tokens', async () => {
            jest.spyOn(jwt, 'signAsync').mockResolvedValueOnce(mockTokens.access_token).mockResolvedValueOnce(mockTokens.refresh_token)

            await expect(service.getTokens(2, 'test77@email.com')).resolves.toEqual(mockTokens)

            expect(jwt.signAsync).toBeCalledTimes(2)
        })
    })
});
