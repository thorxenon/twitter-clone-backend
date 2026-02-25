import { IsNumberString, IsOptional, IsString } from "class-validator";

export class GetAllTweetsDto {
    @IsString()
    @IsOptional()
    hashtag?: string;

    @IsOptional()
    @IsString()
    author?: string;
    
    @IsOptional()
    @IsNumberString()
    page?: number;
}