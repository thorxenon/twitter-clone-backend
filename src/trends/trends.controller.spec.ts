import { Test, TestingModule } from '@nestjs/testing';
import { TrendsController } from './trends.controller';
import { TrendsService } from './trends.service';

describe('TrendsController', () => {
  let controller: TrendsController;

  const trendsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
