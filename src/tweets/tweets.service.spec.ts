import { Test, TestingModule } from '@nestjs/testing';
import { TweetsService } from './tweets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import { TrendsService } from 'src/trends/trends.service';
import { LikesService } from 'src/likes/likes.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { getUrl } from 'src/utils/url';

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

  it('should create a new tweet and update trends', async () => {
    const createTweetDto: CreateTweetDto = { body: 'This is a test tweet #test' };
    const createdTweet = { id: 1, body: '', userSlug: '' } as any;
    tweetRepositoryMock.create.mockReturnValue(createdTweet);
    tweetRepositoryMock.save.mockResolvedValue(createdTweet);
    trendsServiceMock.createTrendFromNewTweet.mockResolvedValue({ created: 1, updated: 0 });
    const result = await service.create(createTweetDto, 'test-user');

    expect(tweetRepositoryMock.create).toHaveBeenCalledWith();
    expect(tweetRepositoryMock.save).toHaveBeenCalledWith(createdTweet);
    expect(trendsServiceMock.createTrendFromNewTweet).toHaveBeenCalledWith([{ hashtag: '#test' }]);
    expect(createdTweet.userSlug).toBe('test-user');
    expect(createdTweet.body).toBe('This is a test tweet #test');
    expect(result).toEqual(createdTweet);
  });

  it('should get answers from a tweet', async () => {
    tweetRepositoryMock.find.mockResolvedValue([
      {
        id: 2,
        body: 'This is another answer',
        replyToId: 1,
        image: null,
        createdAt: new Date(),
        user: {
          slug: 'test-user',
          name: 'Test User',
          avatar: '/uploads/user-avatar/avatar.png',
        },
        likes: [],
      }
    ] as any);

    const result = await service.getAnswersFromTweet(1);
    expect(tweetRepositoryMock.find).toHaveBeenCalledWith({
      where: { replyToId: 1 },
      relations: ['user', 'likes'],
      select: {
        id: true,
        body: true,
        image: true,
        createdAt: true,
        user: {
          slug: true,
          name: true,
          avatar: true,
        },
        likes: {
          userSlug: true,
        },
      },
    });
    expect(result).toEqual([
      {
        id: 2,
        body: 'This is another answer',
        replyToId: 1,
        image: null,
        createdAt: expect.any(Date),
        user: {
          slug: 'test-user',
          name: 'Test User',
          avatar: `${getUrl('/uploads/user-avatar/avatar.png')}`,
        },
        likes: [],
      },
    ]);

  });

  it('should get tweet count by user slug', async () => {
    tweetRepositoryMock.count.mockResolvedValue(5);
    const result = await service.getTweetCountByUserSlug('test-user');
    expect(tweetRepositoryMock.count).toHaveBeenCalledWith({ where: { userSlug: 'test-user' } });
    expect(result).toBe(5);
  });

  it('should get a tweet by id', async () => {
    const expectedTweet = { id: 1, body: 'This is a test tweet', userSlug: 'test-user' } as any;
    likesServiceMock.isLikedByUser.mockResolvedValue(true);
    likesServiceMock.countTweetLike.mockResolvedValue(3);
    tweetRepositoryMock.findOne.mockResolvedValue(expectedTweet);
    const result = await service.findOne(1, 'test-user');
    expect(tweetRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(likesServiceMock.isLikedByUser).toHaveBeenCalledWith(1, 'test-user');
    expect(likesServiceMock.countTweetLike).toHaveBeenCalledWith(1);
    expect(result).toEqual({ ...expectedTweet, isLikedByUser: true, likeCount: 3 });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
