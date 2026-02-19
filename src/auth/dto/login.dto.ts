import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsExclusiveWith } from "src/utils/isExclusiveWith.validator";



export class LoginDto {
    @IsOptional()
    @IsExclusiveWith('email')
    @IsString({ message: 'Slug must be a string' })
    slug?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Email must be valid' })
    @IsExclusiveWith('slug')
    email?: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}