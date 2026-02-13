import { Test, TestingModule } from '@nestjs/testing';
import { RetweetController } from './retweet.controller';
import { RetweetService } from './retweet.service';

describe('RetweetController', () => {
  let controller: RetweetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetweetController],
      providers: [RetweetService],
    }).compile();

    controller = module.get<RetweetController>(RetweetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
