import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class SignUpDto{
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    slug: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsString()
    @IsOptional()
    avatar: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    link?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsDateString()
    @IsNotEmpty()
    birth_date: string;
}