import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ListDto } from './dto/list.dto';
import { ListService } from './list.service';

@Controller('lists')
export class ListController {
    constructor(private listService: ListService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    createList(@Body() dto: ListDto) {
        return this.listService.createList(dto)
    }
}
