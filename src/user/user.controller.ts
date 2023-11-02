import { Body, Controller, Get, HttpCode, HttpStatus, Put, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetCurrentUserId, GetUser } from '../auth/decorator';
import { EditUserDto } from './dto/index'
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ) {}
    
    @Get('me')
    @HttpCode(HttpStatus.OK)
    getMe(@GetUser() user: User){
        return user
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    editUser(
        @Body() dto: EditUserDto, 
        @GetCurrentUserId() userId: number
    ) {
        return this.userService.editUser(dto, userId)
    }
}
