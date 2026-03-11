import { Test, TestingModule } from '@nestjs/testing';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

describe('LikesController', () => {
  let controller: LikesController;

  const likesServiceMock = {
    isLikedByUser: jest.fn(),
    countTweetLike: jest.fn(),
    verifyWhetherTweetIsLikedByUser: jest.fn(),
    unlikeTweet: jest.fn(),
    likeTweet: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [{ provide: LikesService, useValue: likesServiceMock }],
    }).compile();

    controller = module.get<LikesController>(LikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
