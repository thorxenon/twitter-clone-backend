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
    jest.clearAllMocks();

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

  it('verifyWhetherTweetIsLikedByUser should return true when like exists', async () => {
    likeRepositoryMock.findOne.mockResolvedValue({ id: 1, tweetId: 1, userSlug: 'test-user' });

    const result = await service.verifyWhetherTweetIsLikedByUser(1, 'test-user');

    expect(likeRepositoryMock.findOne).toHaveBeenCalledWith({
      where: {
        userSlug: 'test-user',
        tweetId: 1,
      },
    });
    expect(result).toBe(true);
  });

  it('verifyWhetherTweetIsLikedByUser should return false when like does not exist', async () => {
    likeRepositoryMock.findOne.mockResolvedValue(null);

    const result = await service.verifyWhetherTweetIsLikedByUser(1, 'test-user');

    expect(result).toBe(false);
  });

  it('verifyWhetherTweetIsLikedByUser should throw when repository fails', async () => {
    likeRepositoryMock.findOne.mockRejectedValue(new Error('db error'));

    await expect(service.verifyWhetherTweetIsLikedByUser(1, 'test-user')).rejects.toThrow(
      'Error verifying like status',
    );
  });

  it('unlikeTweet should delete like with tweetId and userSlug', async () => {
    likeRepositoryMock.delete.mockResolvedValue({ affected: 1 });

    await service.unlikeTweet(10, 'test-user');

    expect(likeRepositoryMock.delete).toHaveBeenCalledWith({
      tweetId: 10,
      userSlug: 'test-user',
    });
  });

  it('unlikeTweet should throw when repository delete fails', async () => {
    likeRepositoryMock.delete.mockRejectedValue(new Error('db error'));

    await expect(service.unlikeTweet(10, 'test-user')).rejects.toThrow('Error unliking tweet');
  });

  it('likeTweet should create and save a new like', async () => {
    const createdLike = { tweetId: 10, userSlug: 'test-user' };
    likeRepositoryMock.create.mockReturnValue(createdLike);
    likeRepositoryMock.save.mockResolvedValue(createdLike);

    await service.likeTweet(10, 'test-user');

    expect(likeRepositoryMock.create).toHaveBeenCalledWith({
      userSlug: 'test-user',
      tweetId: 10,
    });
    expect(likeRepositoryMock.save).toHaveBeenCalledWith(createdLike);
  });

  it('likeTweet should throw when repository save fails', async () => {
    likeRepositoryMock.create.mockReturnValue({ tweetId: 10, userSlug: 'test-user' });
    likeRepositoryMock.save.mockRejectedValue(new Error('db error'));

    await expect(service.likeTweet(10, 'test-user')).rejects.toThrow('Error liking tweet');
  });

  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
