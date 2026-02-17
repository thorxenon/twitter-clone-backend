import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import { DeepPartial, Repository } from 'typeorm';
import { Trend } from 'src/trends/entities/trend.entity';
import { TrendsService } from 'src/trends/trends.service';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    private readonly trendService: TrendsService
  ){}


  async create(createTweetDto: CreateTweetDto, slug: string) {
    let hasAnsweredReplyTweet: Tweet | null = null;
    let hasQuotedTweet: Tweet | null = null;

    try{
      if(createTweetDto.replyToId){
        hasAnsweredReplyTweet = await this.tweetRepository.findOne({ where:{
            id: createTweetDto.replyToId,
          }
        });
        if(!hasAnsweredReplyTweet) throw new HttpException('The tweet you are replying to does not exist.', HttpStatus.BAD_REQUEST);

        createTweetDto.replyToId = hasAnsweredReplyTweet.id;
      }

      if(createTweetDto.quotedTweetId){
        hasQuotedTweet = await this.tweetRepository.findOne({ where:{
            id: createTweetDto.quotedTweetId,
          }
        });
        if(!hasQuotedTweet) throw new HttpException('The tweet you are quoting does not exist.', HttpStatus.BAD_REQUEST);

        createTweetDto.quotedTweetId = hasQuotedTweet.id;
      }

      const newTweet: DeepPartial<Tweet> = this.tweetRepository.create({
        userSlug: slug,
        body: createTweetDto.body,
        image: createTweetDto.image ?? undefined,
        replyToId: createTweetDto.replyToId ?? null,
        quotedTweetId: createTweetDto.quotedTweetId ?? null
      });
      await this.tweetRepository.save(newTweet);

      const hashtags = createTweetDto.body.match(/#[\p{L}\p{N}_]+/gu);
      let hashtagTobeSaved: DeepPartial<Trend>[] = [];
      if(hashtags){
        for(const hashtag of hashtags){
          if(hashtag.length >= 2){
            hashtagTobeSaved.push({
              hashtag: hashtag.toLowerCase()
            });
          }
        }

        await this.trendService.createTrendFromNewTweet(hashtagTobeSaved);
      }

      return newTweet;
    }catch(error){
      throw new HttpException(`Error creating tweet: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all tweets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tweet`;
  }

  update(id: number, updateTweetDto: UpdateTweetDto) {
    return `This action updates a #${id} tweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} tweet`;
  }
}
