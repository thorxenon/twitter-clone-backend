import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { TweetsService } from './tweets/tweets.service';

describe('AppController', () => {
  let appController: AppController;
  let usersService: { getUserFollowing: jest.Mock; getSuggestions: jest.Mock };
  let tweetsService: { findTweetFeedByUserSlug: jest.Mock; findTweetByBody: jest.Mock };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: UsersService,
          useValue: {
            getUserFollowing: jest.fn(),
            getSuggestions: jest.fn(),
          },
        },
        {
          provide: TweetsService,
          useValue: {
            findTweetFeedByUserSlug: jest.fn(),
            findTweetByBody: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    usersService = app.get(UsersService);
    tweetsService = app.get(TweetsService);
  });

  it('GET /feed it should return the user feed', async () => {
    const req = { user: { slug: 'pedro' } } as any;
    const feedDto = { page: '1' };
    const following = ['joao'];
    const tweets = [{ id: 1, body: 'tweet' }];

    usersService.getUserFollowing.mockResolvedValue(following);
    tweetsService.findTweetFeedByUserSlug.mockResolvedValue(tweets);

    const result = await appController.getFeed(feedDto as any, req);

    expect(usersService.getUserFollowing).toHaveBeenCalledWith('pedro');
    expect(tweetsService.findTweetFeedByUserSlug).toHaveBeenCalledWith('pedro', following, 1, 2);
    expect(result).toEqual({
      tweets,
      page: 1,
    });
  });

  it('GET /search it should return search results', async () => {
    const req = { user: { slug: 'pedro' } } as any;
    const queryDto = { q: '  tweet teste  ', page: '2' };
    const searchResult = [{ id: 10, body: 'tweet teste' }];

    tweetsService.findTweetByBody.mockResolvedValue(searchResult);

    const result = await appController.search(queryDto as any, req);

    expect(tweetsService.findTweetByBody).toHaveBeenCalledWith('tweet teste', 2, 5);
    expect(result).toEqual(searchResult);
  });

  it('GET /suggestions it should return user suggestions', async () => {
    const req = { user: { slug: 'pedro' } } as any;
    const suggestions = [{ name: 'João', slug: 'joao', avatar: 'avatar.png' }];
    usersService.getSuggestions.mockResolvedValue(suggestions);

    const result = await appController.getSuggestions(req);

    expect(usersService.getSuggestions).toHaveBeenCalledWith('pedro');
    expect(result).toEqual(suggestions);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
