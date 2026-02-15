import { Injectable } from '@nestjs/common';
import { CreateTrendDto } from './dto/create-trend.dto';
import { UpdateTrendDto } from './dto/update-trend.dto';

@Injectable()
export class TrendsService {
  create(createTrendDto: CreateTrendDto) {
    return 'This action adds a new trend';
  }

  findAll() {
    return `This action returns all trends`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trend`;
  }

  update(id: number, updateTrendDto: UpdateTrendDto) {
    return `This action updates a #${id} trend`;
  }

  remove(id: number) {
    return `This action removes a #${id} trend`;
  }
}
