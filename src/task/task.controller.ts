import { Controller, Post, HttpCode, HttpStatus, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { GetCurrentUserId } from 'src/auth/decorator';
import { Task } from './type/task.type';
import { TaskDto } from './dto/task.dto';
import { TaskFlagDto } from './dto/task-flag.dto';
import { TaskPipe } from './pipes/task/task.pipe';

@Controller('tasks')
export class TaskController {
    constructor(
        private taskService: TaskService
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    createTask(
        @Body(TaskPipe) dto: TaskDto,
        @GetCurrentUserId() userId: number
    ): Promise<Task> {
        // telling typescript about transformed value types from pipe
        const listId = dto.listId as unknown as number;
        return this.taskService.createTask(dto, listId, userId)
    }
    
    @Post(':taskId/changeflag')
    @HttpCode(HttpStatus.OK)
    changeFlag(
        @Param('taskId', ParseIntPipe) taskId: number,
        @Body() dto: TaskFlagDto,
        @GetCurrentUserId() userId: number
    ): Promise<Task> {
        return this.taskService.changeFlag(dto, taskId, userId)
    }
}
