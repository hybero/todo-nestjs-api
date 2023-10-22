import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ListDto } from './dto/list.dto';
import { ListService } from './list.service';
import { GetCurrentUserId, Public } from 'src/auth/decorator';
import { ListUserDto } from './dto/list-user.dto';
import { List } from './type/list.type';

@Controller('lists')
export class ListController {
    constructor(private listService: ListService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    createList(
        @Body() dto: ListDto,
        @GetCurrentUserId() userId: number
    ): Promise<List> {
        return this.listService.createList(dto, userId)
    }

    @Public()
    @Get()
    @HttpCode(HttpStatus.OK)
    getAllLists(): Promise<List[] | []> {
        return this.listService.getAllLists()
    }

    @Post('share')
    @HttpCode(HttpStatus.OK)
    shareList(
        @Body() dto: ListUserDto,
        @GetCurrentUserId() requestingUserId: number
    ): Promise<List | { message: string }> {
        return this.listService.shareList(dto, requestingUserId)
    }

    @Get('my')
    @HttpCode(HttpStatus.OK)
    getMyLists(
        @GetCurrentUserId() userId: number
    ): Promise<List[] | []> {
        return this.listService.getMyLists(userId)
    }
}
