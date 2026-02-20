import { Controller, Get, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { FeedDto } from './dto/feed.dto';
import { Request } from 'express';
import { UsersService } from './users/users.service';
import { TweetsService } from './tweets/tweets.service';
import { SearchDto } from './dto/search.dto';

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
    let perPage = 2;
    let currentPage: number;
    if(!req.user?.slug) return;

    if(feedDto.page && parseInt(feedDto.page) > 0){
      currentPage = parseInt(feedDto.page);
    }else{
      currentPage = 0;
    }

    const following = await this.usersService.getUserFollowing(req.user?.slug);
    if(!following || following.length === 0) return [];

    const data = await this.tweetsService.findTweetFeedByUserSlug(req.user?.slug, following, currentPage, perPage);
    return {
      tweets: data,
      page: currentPage
    };
  }

  @Get('search')
  async search(@Query() q: SearchDto, @Req() req: Request){
    const query = q.q.trim();
    let perPage = 5;
    let currentPage: number;
    
    if(q.page && parseInt(q.page as string) > 0){
      currentPage = parseInt(q.page as string);
    }else{
      currentPage = 0;
    }

    return await this.tweetsService.findTweetByBody(q.q, currentPage, perPage);
  }

  @Get('suggestions')
  async getSuggestions(@Req() req: Request){
    if(!req.user?.slug) return;
    return await this.usersService.getSuggestions(req.user?.slug);
  }
}
