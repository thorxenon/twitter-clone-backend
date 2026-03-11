import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrendsService } from './trends.service';
import { Trend } from './entities/trend.entity';

describe('TrendsService', () => {
  let service: TrendsService;

  const trendRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrendsService,
        {
          provide: getRepositoryToken(Trend),
          useValue: trendRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<TrendsService>(TrendsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createTrendFromNewTweet should create a new trend if it does not exist', async () => {
    trendRepositoryMock.find.mockResolvedValue([]);
    trendRepositoryMock.create.mockReturnValue([{ hashtag: '#newtrend', count: 1 }]);
    trendRepositoryMock.save.mockResolvedValue([{ id: 1, hashtag: '#newtrend', count: 1 }]);
    const result = await service.createTrendFromNewTweet([ { hashtag: '#newtrend', count: 1 } ]);
    expect(result).toEqual( { created: 1, updated: 0 } );
  });

  it('should return the top 4 trends, ordered by count descending', async () => {
    trendRepositoryMock.find.mockResolvedValue([
      { id: 1, hashtag: '#trend1', count: 10 },
      { id: 2, hashtag: '#trend2', count: 8 },
      { id: 3, hashtag: '#trend3', count: 6 },
      { id: 4, hashtag: '#trend4', count: 4 },
    ]);
    const result = await service.getTrandins();
    expect(result).toEqual([
      { id: 1, hashtag: '#trend1', count: 10 },
      { id: 2, hashtag: '#trend2', count: 8 },
      { id: 3, hashtag: '#trend3', count: 6 },
      { id: 4, hashtag: '#trend4', count: 4 },
    ]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});