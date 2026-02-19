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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});