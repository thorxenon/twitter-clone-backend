import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TweetsService } from 'src/tweets/tweets.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tweetsService: TweetsService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':nickname')
  async findOne(@Param('nickname') nickname: string) {
    return await this.usersService.findUserBySlug(nickname);
  }

  @Get(':slug/tweets')
  async findUserTweets(@Param('slug') slug: string, @Query('page') page?: number) {
    if(page && isNaN(Number(page))) throw new HttpException('Invalid page number', HttpStatus.BAD_REQUEST);
    let currentPage = page ? Number(page) : 0;

    return await this.tweetsService.findUserTweets(slug, currentPage);
  }

  @Post(':slug/follow')
  followUser(@Param('slug') slug: string) {

  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updateUserDto: UpdateUserDto) {

  }

  @Patch(':slug/avatar')
  updateAvatar(@Param('slug') slug: string) {

  }

  @Patch(':slug/cover')
  updateCover(@Param('slug') slug: string) {
    
  }

}
