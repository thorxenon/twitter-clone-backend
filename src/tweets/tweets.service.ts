import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import { DeepPartial, Repository } from 'typeorm';
import { Trend } from 'src/trends/entities/trend.entity';
import { TrendsService } from 'src/trends/trends.service';
import { LikesService } from 'src/likes/likes.service';
import { getUrl } from 'src/utils/url';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    private readonly trendService: TrendsService,
    private readonly likeService: LikesService
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


  async getAnswersFromTweet(id: number){
    try {
      const answers = await this.tweetRepository.find({
        where: { 
          replyToId: id
         },
         relations: [ 'user', 'likes' ],
         select:{
          id: true,
          body: true,
          image: true,
          createdAt: true,
          user:{
            slug: true,
            name: true,
            avatar: true
          },
          likes:{
            userSlug: true
          }
         }
      });

      for(let i = 0; i < answers.length; i++){
        answers[i].user.avatar = getUrl(answers[i].user.avatar);
      }

      return answers;
    } catch (error) {
      throw new HttpException(`Error fetching answers: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  

  findAll() {
    return `This action returns all tweets`;
  }

  async findOne(id: number, userSlug: string) {
    const tweet = await this.tweetRepository.findOne({ where: { id } });
    if(!tweet) throw new HttpException('Tweet not found', HttpStatus.NOT_FOUND);

    const isLikedByUser = await this.likeService.isLikedByUser(tweet.id, userSlug);
    const likeCount = await this.likeService.countTweetLike(tweet.id);
    return { ...tweet, isLikedByUser , likeCount };
  }

  update(id: number, updateTweetDto: UpdateTweetDto) {
    return `This action updates a #${id} tweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} tweet`;
  }
}
