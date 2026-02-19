import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { getUrl } from 'src/utils/url';
import { Follow } from './entities/follow.entity';
import { TweetsService } from 'src/tweets/tweets.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    private readonly tweetService: TweetsService
  ){}


  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findUserBySlug(slug: string): Promise<User | null>{
    try{
      const user = await this.userRepository.findOne({ where: { slug },
        relations: ['tweets', 'likes', 'role'],
        select:{
          slug: true,
          avatar: true,
          role:{
            name: true
          },
          cover: true,
          bio: true,
          link: true,
          name: true,
          birth_date: true,
          createdAt: true,
        }
      });
      if(user){
        user.avatar = getUrl(user.avatar);
        user.cover = getUrl(user.cover);

        const followers = await this.followRepository.count({ where: { following: { slug: user.slug } } });
        const following = await this.followRepository.count({ where: { follower: { slug: user.slug } } });

        (user as any).followers = followers;
        (user as any).following = following;

        const tweetCount = await this.tweetService.getTweetCountByUserSlug(user.slug);
        (user as any).post_count = tweetCount;

        return user;
      }

      return null;
    }catch(error){
      throw new HttpException("Error fetching user", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
