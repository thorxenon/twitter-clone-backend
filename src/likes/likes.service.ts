import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>
  ){}

  async isLikedByUser(tweetId: number, userSlug: string): Promise<boolean> {
    try{
      const like = await this.likeRepository.findOne({ where: { tweetId, userSlug } });
      return !!like;
    }catch(error){
      throw new HttpException('Error checking like status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countTweetLike( tweetId: number ): Promise<number> {
    try{
      const count = await this.likeRepository.count({
        where:{ tweetId }
      });

      return count;
    }catch(error){
      throw new HttpException('Error counting likes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  create(createLikeDto: CreateLikeDto) {
    return 'This action adds a new like';
  }

  findAll() {
    return `This action returns all likes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeDto: UpdateLikeDto) {
    return `This action updates a #${id} like`;
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }
}
