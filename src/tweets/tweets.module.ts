import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import { PassportModule } from '@nestjs/passport';
import { RoleHasPermission } from 'src/auth/entities/roleHasPermission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Tweet, RoleHasPermission ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TweetsController],
  providers: [TweetsService],
})
export class TweetsModule {}
