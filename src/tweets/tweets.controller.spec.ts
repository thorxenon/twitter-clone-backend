import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { TweetsController } from './tweets.controller';
import { TweetsService } from './tweets.service';
import { LikesService } from 'src/likes/likes.service';
import { PermissionGuard } from 'src/guards/permission.guard';
import { CreateTweetDto } from './dto/create-tweet.dto';

describe('TweetsController', () => {
  let controller: TweetsController;

  const tweetsServiceMock = {
    create: jest.fn(),
    findOne: jest.fn(),
    getAnswersFromTweet: jest.fn(),
  };

  const likesServiceMock = {
    verifyWhetherTweetIsLikedByUser: jest.fn(),
    unlikeTweet: jest.fn(),
    likeTweet: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleBuilder = Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [TweetsController],
      providers: [
        { provide: TweetsService, useValue: tweetsServiceMock },
        { provide: LikesService, useValue: likesServiceMock },
      ],
    });

    moduleBuilder.overrideGuard(PermissionGuard).useValue({
      canActivate: jest.fn(() => true),
    });

    const module: TestingModule = await moduleBuilder.compile();

    controller = module.get<TweetsController>(TweetsController);
  });

  it('POST /tweets should create a new tweet', async () => {
    const createTweetDto: CreateTweetDto = {
      body: 'This is a test tweet',
    };

    const image = undefined as unknown as Express.Multer.File;
    const req = { user: { slug: 'test-user' } } as any;
    const expected = { id: 1, ...createTweetDto };

    (tweetsServiceMock.create as jest.Mock).mockResolvedValue(expected);
    const result = await controller.create(createTweetDto, image, req);

    expect(tweetsServiceMock.create).toHaveBeenCalledWith(createTweetDto, 'test-user');
    expect(result).toEqual(expected);
  });

  it('GET /tweets/:id should return a tweet by id', async () => {
    tweetsServiceMock.findOne.mockResolvedValue([]);
    const req = { user: { slug: 'test-user' } } as any;
    tweetsServiceMock.findOne.mockResolvedValue({ id: 1, body: 'This is a test tweet' });
    const result = await controller.findOne('1', req);

    expect(tweetsServiceMock.findOne).toHaveBeenCalledWith(1, 'test-user');
    expect(result).toEqual({ id: 1, body: 'This is a test tweet' });
  });

  it('GET /tweets/:id/like should like tweet if not liked yet', async () => {
    likesServiceMock.verifyWhetherTweetIsLikedByUser.mockResolvedValue(false);
    likesServiceMock.likeTweet.mockResolvedValue({  id: 1, tweetId: 1, userSlug: 'test-user' });
    const result = await controller.likeTweet('1', { user: { slug: 'test-user' } } as any);

    expect(likesServiceMock.verifyWhetherTweetIsLikedByUser).toHaveBeenCalledWith(1, 'test-user');
    expect(likesServiceMock.likeTweet).toHaveBeenCalledWith(1, 'test-user');
    expect(likesServiceMock.unlikeTweet).not.toHaveBeenCalled();
    expect(result).toEqual({  id: 1, tweetId: 1, userSlug: 'test-user' });
  });

  it('GET /tweets/:id/like should unlike tweet when already liked', async () => {
    likesServiceMock.verifyWhetherTweetIsLikedByUser.mockResolvedValue(true);
    likesServiceMock.unlikeTweet.mockResolvedValue(undefined);
    const req = { user: { slug: 'test-user' } } as any;
    const result = await controller.likeTweet('1', req);

    expect(likesServiceMock.verifyWhetherTweetIsLikedByUser).toHaveBeenCalledWith(1, 'test-user');
    expect(likesServiceMock.unlikeTweet).toHaveBeenCalledWith(1, 'test-user');
    expect(likesServiceMock.likeTweet).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('GET /tweets/:id/answers should return answers from a tweet', async() =>{
    tweetsServiceMock.getAnswersFromTweet.mockResolvedValue([
      { id: 2, body: 'This is an answer to the tweet', replyToId: 1 },
      { id: 3, body: 'This is an answer to the tweet 1', replyToId: 1 },
    ]);
    const result = await controller.getAnswersFromTweet('1');

    expect(tweetsServiceMock.getAnswersFromTweet).toHaveBeenCalledWith(1);
    expect(result).toEqual([
      { id: 2, body: 'This is an answer to the tweet', replyToId: 1 },
      { id: 3, body: 'This is an answer to the tweet 1', replyToId: 1 },
    ]);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
