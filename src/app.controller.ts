import { Controller, Get, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { FeedDto } from './dto/feed.dto';
import { Request } from 'express';
import { UsersService } from './users/users.service';
import { TweetsService } from './tweets/tweets.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
    private readonly tweetsService: TweetsService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('feed')
  async getFeed(@Query() feedDto: FeedDto, @Req() req: Request){
    let perPage = 10;
    let currentPage: number;
    if(!req.user?.slug) return;

    if(feedDto.page && parseInt(feedDto.page) > 0){
      currentPage = parseInt(feedDto.page);
    }else{
      currentPage = 0;
    }

    const following = await this.usersService.getUserFollowing(req.user?.slug);
    if(!following || following.length === 0) return [];

    return await this.tweetsService.findTweetFeedByUserSlug(req.user?.slug, following, currentPage, perPage);
  }

  @Get('search')
  search(){

  }

  @Get('suggestions')
  getSuggestions(){
    
  }
}
