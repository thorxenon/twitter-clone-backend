import { Test, TestingModule } from '@nestjs/testing';
import { TweetsService } from './tweets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import { TrendsService } from 'src/trends/trends.service';
import { LikesService } from 'src/likes/likes.service';

describe('TweetsService', () => {
  let service: TweetsService;

  const tweetRepositoryMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
  };

  const trendsServiceMock = {
    createTrendFromNewTweet: jest.fn(),
  };

  const likesServiceMock = {
    isLikedByUser: jest.fn(),
    countTweetLike: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TweetsService,
        { provide: getRepositoryToken(Tweet), useValue: tweetRepositoryMock },
        { provide: TrendsService, useValue: trendsServiceMock },
        { provide: LikesService, useValue: likesServiceMock },
      ],
    }).compile();

    service = module.get<TweetsService>(TweetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
