import { Injectable } from '@nestjs/common';
import { CreateRetweetDto } from './dto/create-retweet.dto';
import { UpdateRetweetDto } from './dto/update-retweet.dto';

@Injectable()
export class RetweetService {
  create(createRetweetDto: CreateRetweetDto) {
    return 'This action adds a new retweet';
  }

  findAll() {
    return `This action returns all retweet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} retweet`;
  }

  update(id: number, updateRetweetDto: UpdateRetweetDto) {
    return `This action updates a #${id} retweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} retweet`;
  }
}
