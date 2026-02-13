import { Module } from '@nestjs/common';
import { RetweetService } from './retweet.service';
import { RetweetController } from './retweet.controller';

@Module({
  controllers: [RetweetController],
  providers: [RetweetService],
})
export class RetweetModule {}
