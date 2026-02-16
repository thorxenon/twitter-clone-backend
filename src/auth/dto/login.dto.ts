import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsExclusiveWith } from "src/utils/isExclusiveWith.validator";



export class LoginDto {
    @IsExclusiveWith('email')
    @IsString({ message: 'Slug must be a string' })
    slug: string;

    @IsEmail({}, { message: 'Email must be valid' })
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}