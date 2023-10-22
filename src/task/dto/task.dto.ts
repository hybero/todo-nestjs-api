import { Type } from "class-transformer"
import { IsDateString, IsNotEmpty } from "class-validator"

export class TaskDto {
    @IsNotEmpty()
    @Type(() => Number) // Transformation string to number is not working, don't know why
    listId: number

    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    @IsDateString()
    deadline: Date
}