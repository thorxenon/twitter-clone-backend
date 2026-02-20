import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, Min, MinLength } from "class-validator";

export class SearchDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    q: string;

    @IsEnum(['users', 'tweets', 'hashtags'])
    @IsNotEmpty()
    option?: 'users' | 'tweets' | 'hashtags';

    @IsOptional()
    @IsNumberString()
    @Min(0)
    page?: string;
}