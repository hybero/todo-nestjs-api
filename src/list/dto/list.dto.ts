import { IsDateString, IsNotEmpty } from "class-validator"

export class ListDto {
    @IsNotEmpty()
    title: string

    description?: string
}