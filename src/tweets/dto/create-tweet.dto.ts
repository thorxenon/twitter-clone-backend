import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTweetDto {
    @IsString()
    @IsOptional()
    image?: string;
    
    @IsNotEmpty()
    @IsString()
    body: string;
    
    @IsOptional()
    @IsNumber()
    replyToId: number;
    
    @IsOptional()
    @IsNumber()
    quotedTweetId: number;
}
