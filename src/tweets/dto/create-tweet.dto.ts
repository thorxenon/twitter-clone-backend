import { IsOptional, IsString } from "class-validator";

export class CreateTweetDto {
    @IsString()
    body: string;

    @IsString()
    @IsOptional()
    image?: string;
}
