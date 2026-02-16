import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { CreateReplyTweetDto } from './dto/create-reply.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/guards/permission.guard';
import { RequiredPermission } from 'src/decorators/permission.decorator';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { CreateLikeDto } from 'src/likes/dto/create-like.dto';

@Controller('tweets')
@UseGuards(AuthGuard(), PermissionGuard)
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  @RequiredPermission('create_tweet')
  create(@Body() createTweetDto: CreateTweetDto) {
    return this.tweetsService.create(createTweetDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string){

  }

  @Post(':id/like')
  likeTweet(@Param('id') id: string, @Body() createLikeDto: CreateLikeDto){
    
  }

  @Get(':id/answers')
  getAnswersFromTweet(@Param('id') id: string){

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTweetDto: UpdateTweetDto){

  }

  @Delete(':id')
  remove(@Param('id') id: string){

  }

}
