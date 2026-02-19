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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
