import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':nickname')
  findOne(@Param('nickname') nickname: string) {

  }

  @Get(':nickname/tweets')
  findUserTweets(@Param('nickname') nickname: string) {

  }

  @Post(':nickname/follow')
  followUser(@Param('nickname') nickname: string) {

  }

  @Patch(':nickname')
  update(@Param('nickname') nickname: string, @Body() updateUserDto: UpdateUserDto) {

  }

  @Patch(':nickname/avatar')
  updateAvatar(@Param('nickname') nickname: string) {

  }

  @Patch(':nickname/cover')
  updateCover(@Param('nickname') nickname: string) {
    
  }

}
