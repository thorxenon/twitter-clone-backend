import { Module } from '@nestjs/common';
import { TrendsService } from './trends.service';
import { TrendsController } from './trends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trend } from './entities/trend.entity';

@Module({
  controllers: [TrendsController],
  providers: [TrendsService],
  imports:[ TypeOrmModule.forFeature([ Trend ]) ],
  exports: [ TrendsService ]
})
export class TrendsModule {}
