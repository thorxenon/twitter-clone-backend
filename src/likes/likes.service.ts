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


  async verifyWhetherTweetIsLikedByUser(id: number, userSlug: string): Promise<boolean>{
    try{
      const isliked = await this.likeRepository.findOne({ 
        where:{
          userSlug: userSlug,
          tweetId: id
        }});

      return isliked ? !!isliked : false;
    }catch(error){
      throw new HttpException('Error verifying like status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async unlikeTweet(tweetId: number, userSlug: string): Promise<void>{
    try{
      await this.likeRepository.delete({
        tweetId,
        userSlug
      });
    }catch(error){
      throw new HttpException('Error unliking tweet', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async likeTweet(id: number, userSlug: string): Promise<void> {
    try{
      const newLike = this.likeRepository.create({
        userSlug,
        tweetId: id
      });
      
      await this.likeRepository.save(newLike);
    }catch(error){
      throw new HttpException('Error liking tweet: ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
