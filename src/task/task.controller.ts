import { Controller, Post, HttpCode, HttpStatus, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { GetCurrentUserId } from 'src/auth/decorator';
import { Task } from './type/task.type';
import { TaskDto } from './dto/task.dto';
import { TaskFlagDto } from './dto/task-flag.dto';

@Controller('tasks')
export class TaskController {
    constructor(
        private taskService: TaskService
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    createTask(
        @Body() dto: TaskDto,
        @GetCurrentUserId() userId: number
    ): Promise<Task> {
        console.log(dto.listId, typeof dto.listId)
        return this.taskService.createTask(dto, userId)
    }
    
    @Post(':taskId/changeflag')
    @HttpCode(HttpStatus.OK)
    changeFlag(
        @Param('taskId', ParseIntPipe) taskId: number,
        @Body() dto: TaskFlagDto,
        @GetCurrentUserId() userId: number
    ) {
        return this.taskService.changeFlag(dto, taskId, userId)
    }
}
