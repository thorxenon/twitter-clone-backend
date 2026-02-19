import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';

describe('LikesService', () => {
  let service: LikesService;

  const likeRepositoryMock = {
    findOne: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        { provide: getRepositoryToken(Like), useValue: likeRepositoryMock },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
  });

  it('isLikedByUser should return true if the user has liked the tweet', async () => {
    likeRepositoryMock.findOne.mockResolvedValue({ id: 1, tweetId: 1, userSlug: 'test-user' });
    const result = await service.isLikedByUser(1, 'test-user');
    expect(result).toBe(true);
  });

  it('isLikedByUser should return false if the user has not liked the tweet', async () => {
    likeRepositoryMock.findOne.mockResolvedValue(null);
    const result = await service.isLikedByUser(1, 'test-user');
    expect(result).toBe(false);
  });

  it('countTweetLike should return the number of likes for a tweet', async () => {
    likeRepositoryMock.count.mockResolvedValue(5);
    const result = await service.countTweetLike(1);
    expect(result).toBe(5);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
