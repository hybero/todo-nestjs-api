import { IsDateString, IsNotEmpty } from "class-validator"

export class ListUserDto {
    @IsNotEmpty()
    listId: string

    @IsNotEmpty()
    userId: string
}