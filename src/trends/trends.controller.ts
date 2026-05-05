import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrendsService } from './trends.service';
import { CreateTrendDto } from './dto/create-trend.dto';

@Controller('trends')
export class TrendsController {
  constructor(private readonly trendsService: TrendsService) {}

  @Get()
  async findAll() {
    return this.trendsService.getTrandins();
  }
}
