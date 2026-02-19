import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import { PassportModule } from '@nestjs/passport';
import { RoleHasPermission } from 'src/auth/entities/roleHasPermission.entity';
import { User } from 'src/users/entities/user.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Trend } from 'src/trends/entities/trend.entity';
import { TrendsService } from 'src/trends/trends.service';
import { LikesService } from 'src/likes/likes.service';

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
