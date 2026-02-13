import { PartialType } from '@nestjs/mapped-types';
import { CreateRetweetDto } from './create-retweet.dto';

export class UpdateRetweetDto extends PartialType(CreateRetweetDto) {}
