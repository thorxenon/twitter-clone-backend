import { IsNumberString, IsOptional } from "class-validator";

export class FeedDto{
    @IsOptional()
    @IsNumberString()
    page?: string;
}