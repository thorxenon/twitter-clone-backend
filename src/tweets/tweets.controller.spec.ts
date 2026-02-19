import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { TweetsController } from './tweets.controller';
import { TweetsService } from './tweets.service';
import { LikesService } from 'src/likes/likes.service';
import { PermissionGuard } from 'src/guards/permission.guard';

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
