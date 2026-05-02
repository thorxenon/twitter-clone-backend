import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import { PassportModule } from '@nestjs/passport';
import { RoleHasPermission } from './../auth/entities/roleHasPermission.entity';
import { User } from './../users/entities/user.entity';
import { Like } from './../likes/entities/like.entity';
import { Trend } from './../trends/entities/trend.entity';
import { TrendsService } from './../trends/trends.service';
import { LikesService } from './../likes/likes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Tweet, RoleHasPermission, User, Like, Trend ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TweetsController],
  exports: [ TweetsService ],
  providers: [ TweetsService, TrendsService, LikesService ],
})
export class TweetsModule {}
