import { Test, TestingModule } from '@nestjs/testing';
import { TrendsController } from './trends.controller';
import { TrendsService } from './trends.service';

describe('TrendsController', () => {
  let controller: TrendsController;

  const trendsServiceMock = {
    create: jest.fn(),
    getTrandins: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrendsController],
      providers: [{ provide: TrendsService, useValue: trendsServiceMock }],
    }).compile();

    controller = module.get<TrendsController>(TrendsController);
  });

  it('GET /trends should return the top trends', async () => {
    const trends = [
      { id: 1, hashtag: '#trend1', count: 10 },
      { id: 2, hashtag: '#trend2', count: 8 },
      { id: 3, hashtag: '#trend3', count: 6 },
      { id: 4, hashtag: '#trend4', count: 4 },
    ];
    trendsServiceMock.getTrandins.mockResolvedValue(trends);

    const response = await controller.findAll();
    expect(response).toEqual(trends);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
