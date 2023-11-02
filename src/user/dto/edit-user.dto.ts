import { IsEmail, IsOptional, IsString } from "class-validator"

export class EditUserDto {
    @IsOptional()
    @IsEmail()
    @IsString()
    email?: string

    @IsOptional()
    @IsString()
    firstName?: string

    @IsOptional()
    @IsString()
    lastName?: string
}