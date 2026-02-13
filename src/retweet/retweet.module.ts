import { Module } from '@nestjs/common';
import { RetweetService } from './retweet.service';
import { RetweetController } from './retweet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Retweet } from './entities/retweet.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Retweet]) ],
  controllers: [RetweetController],
  providers: [RetweetService],
})
export class RetweetModule {}
