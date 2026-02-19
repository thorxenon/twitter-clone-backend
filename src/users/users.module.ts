import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Follow } from './entities/follow.entity';
import { TweetsService } from 'src/tweets/tweets.service';
import { TweetsModule } from 'src/tweets/tweets.module';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ User, Follow ]),
    forwardRef(() => AuthModule),
    TweetsModule
  ],
  controllers: [UsersController],
  providers: [ UsersService ],
  exports: [ UsersService, TypeOrmModule ]
})
export class UsersModule {}