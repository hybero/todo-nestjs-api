import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber } from "class-validator"

export class ListUserDto {
    @IsNotEmpty()
    // @Type(() => Number) // Transformation string to number is not working, don't know why
    // @IsNumber() // using transformation pipe to transfor number sent as string to integer
    listId: string

    @IsNotEmpty()
    // @Type(() => Number) // Transformation string to number is not working, don't know why
    // @IsNumber() // using transformation pipe to transfor number sent as string to integer
    userId: string
}