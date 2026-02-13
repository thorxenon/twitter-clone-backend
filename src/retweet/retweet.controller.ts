import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RetweetService } from './retweet.service';
import { CreateRetweetDto } from './dto/create-retweet.dto';
import { UpdateRetweetDto } from './dto/update-retweet.dto';

@Controller('retweet')
export class RetweetController {
  constructor(private readonly retweetService: RetweetService) {}

  @Post()
  create(@Body() createRetweetDto: CreateRetweetDto) {
    return this.retweetService.create(createRetweetDto);
  }

  @Get()
  findAll() {
    return this.retweetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.retweetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRetweetDto: UpdateRetweetDto) {
    return this.retweetService.update(+id, updateRetweetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.retweetService.remove(+id);
  }
}
