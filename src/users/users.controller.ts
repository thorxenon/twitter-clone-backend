import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, Req, HttpCode, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TweetsService } from './../tweets/tweets.service';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tweetsService: TweetsService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async loggedUserInfo(@Req() req: Request) {
    const slug = req.user?.slug as string;
    if (!slug) {
      throw new HttpException('User slug not found in token', HttpStatus.UNAUTHORIZED);
    }
    return await this.usersService.LoggedUserInfo(slug);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return await this.usersService.findUserBySlug(slug);
  }

  

  @Get(':slug/tweets')
  @HttpCode(HttpStatus.OK)
  async findUserTweets(@Param('slug') slug: string, @Query('page') page?: number) {
    if(page && isNaN(Number(page))) throw new HttpException('Invalid page number', HttpStatus.BAD_REQUEST);
    let currentPage = page ? Number(page) : 0;

    return await this.tweetsService.findUserTweets(slug, currentPage);
  }

  @Post(':slug/follow')
  @HttpCode(HttpStatus.OK)
  async followUser(@Param('slug') slug: string, @Req() req: Request) {
    const me = req.user?.slug as string;

    const isFollowing = await this.usersService.findUserBySlug(slug);
    if(!isFollowing) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const follows = await this.usersService.checkWhetherUserIsFollowing(me, slug);
    if(!follows){
      await this.usersService.follow(me, slug);

      return{
        following: true
      }
    }

    await this.usersService.unfollow(me, slug);
    return{
      following: false
    }
  };

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update (@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    const slug = req.user?.slug as string;
    return await this.usersService.update(slug, updateUserDto);
  }

}
