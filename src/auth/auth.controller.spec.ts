import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
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
          login: jest.fn(),
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

  it('POST /login', async () => {
    const loginDto: LoginDto = {
      slug: chance.string({ length: 10, pool: 'abcdefghijklmno_pqrstuvwxyz0123456789' }),
      email: chance.email(),
      password: chance.string({ length: 10 }),
    };

    const expected = { token: chance.guid() };
    (authService.login as jest.Mock).mockResolvedValue(expected);

    const result = await controller.login(loginDto);

    expect(authService.login).toHaveBeenCalledWith(loginDto);
    expect(result).toEqual(expected);
  });

  it('POST /signup Neither avatar and cover', async () => {
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

  it('POST /signup with avatar', async () => {
    const signupDto: Partial<SignUpDto> = {
      name: chance.name(),
      email: chance.email(),
      password: chance.string({ length: 10 }),
      slug: chance.string({ length: 10, pool: 'abcdefghijklmno_pqrstuvwxyz0123456789' }),
    };

    const avatar = [ { filename: 'avatar-test.png' } ] as Express.Multer.File[];

    const expected = { id: chance.guid(), avatar: '/uploads/user-avatar/avatar-test.png' };
    (authService.signup as jest.Mock).mockResolvedValue(expected);

    const result = await controller.signup(signupDto as SignUpDto, avatar[0].filename ? { avatar } : undefined);

    expect(authService.signup).toHaveBeenCalledWith({
      ...signupDto,
      avatar: '/uploads/user-avatar/avatar-test.png',
    });
    expect(result).toEqual(expected);
  });

  it('POST /signup with cover', async () => {
    const signupDto: Partial<SignUpDto> = {
      name: chance.name(),
      email: chance.email(),
      password: chance.string({ length: 10 }),
      slug: chance.string({ length: 10, pool: 'abcdefghijklmno_pqrstuvwxyz0123456789' }),
    };

    const cover = [ { filename: 'cover-test.png' } ] as Express.Multer.File[];

    const expected = { id: chance.guid(), cover: '/uploads/user-cover/cover-test.png' };
    (authService.signup as jest.Mock).mockResolvedValue(expected);

    const result = await controller.signup(signupDto as SignUpDto, cover[0].filename ? { cover } : undefined);

    expect(authService.signup).toHaveBeenCalledWith({
      ...signupDto,
      cover: '/uploads/user-cover/cover-test.png',
    });
    expect(result).toEqual(expected);
  });
});
