import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';

@Controller('users')
export class UserController {
    
    @Get('me')
    getMe(@GetUser() user: User){
        return user
    }
}
