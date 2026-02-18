import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';

@Module({
  controllers: [LikesController],
  imports:[
    TypeOrmModule.forFeature([ Like ])
  ],
  providers: [LikesService],
  exports: [ LikesService ]
})
export class LikesModule {}
