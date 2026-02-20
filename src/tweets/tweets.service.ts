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
import { Follow } from 'src/users/entities/follow.entity';
import { In } from 'typeorm';

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

      const newTweet = this.tweetRepository.create();
      newTweet.userSlug = slug;
      newTweet.body = createTweetDto.body;
      if(createTweetDto.image){
        newTweet.image = createTweetDto.image;
      }
      if(createTweetDto.replyToId !== undefined){
        newTweet.replyToId = createTweetDto.replyToId;
      }
      if(createTweetDto.quotedTweetId !== undefined){
        newTweet.quotedTweetId = createTweetDto.quotedTweetId;
      }
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

  async getTweetCountByUserSlug(slug: string): Promise<number>{
    try{
      return await this.tweetRepository.count({ where: { userSlug: slug } });
    }catch(error){
      throw new HttpException(`Error fetching tweet count: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
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

  async findUserTweets(slug: string, currentPage: number, perPage: number = 20){
    try{
      const tweets = await this.tweetRepository.find({
        where:{
          userSlug: slug,
          replyToId: undefined,
          quotedTweetId: undefined
        },
        order: {
          createdAt: 'DESC'
        },
        skip: currentPage * perPage,
        take: perPage,
        relations: ['user', 'likes'],
        select:{
          id: true,
          body: true,
          image: true,
          createdAt: true,
          likes:{
            userSlug: true
          },
          replies:{
            id: true,
            body: true,
            image: true,
            createdAt: true,
          },
        }
      });

      return tweets;
    }catch(error){
      throw new HttpException(`Error fetching user tweets: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findTweetFeedByUserSlug(slug: string, following: string[], currentPage: number, perPage: number): Promise<Partial<Tweet[]>>{
    if(following.length === 0 || !following) return [];

    try {
      const tweets = await this.tweetRepository.find({
        where:{
          userSlug: In(following)
        },
        order: {
          createdAt: 'DESC'
        },
        skip: currentPage * perPage,
        take: perPage,
        relations: ['user', 'likes'],
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
         },
         cache: 60000
      });

      for(let i = 0; i < tweets.length; i++){
        tweets[i].user.avatar = getUrl(tweets[i].user.avatar);
      }

      return tweets;
    } catch (error) {
      throw new HttpException(`Error fetching tweet feed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  update(id: number, updateTweetDto: UpdateTweetDto) {
    return `This action updates a #${id} tweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} tweet`;
  }
}
