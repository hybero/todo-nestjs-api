import { Type } from "class-transformer"
import { IsNotEmpty } from "class-validator"

export class ListUserDto {
    @IsNotEmpty()
    @Type(() => Number) // Transformation string to number is not working, don't know why
    listId: string

    @IsNotEmpty()
    @Type(() => Number) // Transformation string to number is not working, don't know why
    userId: string
}