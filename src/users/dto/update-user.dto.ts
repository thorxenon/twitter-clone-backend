import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    @IsUrl({}, { message: 'Link must be a valid URL' })
    link?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsString()
    @IsOptional()
    cover?: string;
}
