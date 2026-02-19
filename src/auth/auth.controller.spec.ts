import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { UsersService } from 'src/users/users.service';
const Chance = require('chance');

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  const chance = new Chance();
  const usersServiceMock = {
    findUserBySlug: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{
        provide: AuthService,
        useValue: {
          signup: jest.fn()
        }
      }, {
        provide: UsersService,
        useValue: usersServiceMock,
      }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('POST /siginup', async () => {
    const signupDto: Partial<SignUpDto> = {
      name: chance.name(),
      email: chance.email(),
      password: chance.string({ length: 10 }),
      slug: chance.string({ length: 10, pool: 'abcdefghijklmno_pqrstuvwxyz0123456789' }),
    };

    const expected = { id: chance.guid()};
    (authService.signup as jest.Mock).mockResolvedValue(expected);
    const result = await controller.signup(signupDto as SignUpDto);

    expect(authService.signup).toHaveBeenCalledWith(signupDto);
    expect(result).toEqual(expected);
  });
});
