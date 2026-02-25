import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import { DeepPartial, In, IsNull, Raw, Repository } from 'typeorm';
import { Trend } from 'src/trends/entities/trend.entity';
import { TrendsService } from 'src/trends/trends.service';
import { LikesService } from 'src/likes/likes.service';
import { getUrl } from 'src/utils/url';
import { Follow } from 'src/users/entities/follow.entity';
import { GetAllTweetsDto } from './dto/get-all.dto';

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
      return await this.tweetRepository.count({where: { userSlug: slug } });
    }catch(error){
      throw new HttpException(`Error fetching tweet count: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  

  async findAll(query: GetAllTweetsDto, userSlug: string) {
    try{
      const existTrend = await this.trendService.findTrend(query.hashtag as string);
      console.log('Exist trend:', existTrend);
      if(!existTrend) return;

      const tweets = await this.tweetRepository.find({
        where:{
          body: Raw(
            (alias) =>
              `translate(lower(${alias}), 'áàãâäéèêëíìîïóòõôöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn') LIKE translate(lower(:query), 'áàãâäéèêëíìîïóòõôöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn')`,
            { query: `%${existTrend.hashtag}%` }
          )
        },
        order: {
          createdAt: 'DESC'
        },
        relations: ['user', 'likes'],
        select:{
          id: true,
          body: true,
          user:{
            slug: true,
            name: true,
            avatar: true
          },
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
          }
        }
      });
      if(!tweets) return [];

      for(const tweet in tweets){
        tweets[tweet].user.avatar = getUrl(tweets[tweet].user.avatar);
      }

      return tweets;
    }catch(error){
      throw new HttpException(`Error fetching tweets: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
          replyToId: IsNull(),
          quotedTweetId: IsNull()
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
          user:{
            slug: true,
            name: true,
            avatar: true
          },
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
      if(!tweets) return [];

      for(let tweet in tweets){
        tweets[tweet].user.avatar = getUrl(tweets[tweet].user.avatar);
      }

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
          userSlug: In(following),
          replyToId: IsNull(),
          quotedTweetId: IsNull()
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

  async findTweetByBody(query: string, currentPage: number, perPage: number): Promise<Partial<Tweet[]>>{
    try {
      if(!query) return [];

      const search = await this.tweetRepository.find({
        where:{
          body: Raw(
            (alias) =>
              `translate(lower(${alias}), 'áàãâäéèêëíìîïóòõôöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn') LIKE translate(lower(:query), 'áàãâäéèêëíìîïóòõôöúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn')`,
            { query: `%${query}%` }
          ),
          replyToId: IsNull(),
          quotedTweetId: IsNull()
        },
        order:{
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
      if(!search) return [];

      search.map(tweet=>{
        if(tweet.user.avatar){
          tweet.user.avatar = getUrl(tweet.user.avatar);
        }
      });

      return search;
    } catch (error) {
      throw new HttpException(`Error searching tweets: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
