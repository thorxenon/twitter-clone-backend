import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from './entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
const Chance = require('chance');
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  const chance = new Chance();

  const userRepositoryMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const roleRepositoryMock = {
    findOne: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const usersServiceMock = {
    findUserBySlug: jest.fn(),
    create: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepositoryMock },
        { provide: getRepositoryToken(Role), useValue: roleRepositoryMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should create a new user and return the user data', async () => {
    const createUserDto: Partial<SignUpDto> = {
      name: chance.name(),
      email: chance.email(),
      password: chance.string({ length: 10 }),
      slug: chance.string({ length: 10, pool: 'abcdefghijklmno_pqrstuvwxyz0123456789' }),
      birth_date: chance.birthday({ string: true }).toString(),
    };
    const createdUser = { ...createUserDto, id: 1 } as any;
    userRepositoryMock.create.mockReturnValue(createdUser);
    userRepositoryMock.save.mockResolvedValue(createdUser);
    roleRepositoryMock.findOne.mockResolvedValue({ id: 1, name: 'default' });
    jwtServiceMock.sign.mockReturnValue('test-token');
    configServiceMock.get.mockReturnValue('test-secret');
    usersServiceMock.findUserBySlug.mockResolvedValue(null);
    const result = await service.signup(createUserDto as SignUpDto);
    expect(userRepositoryMock.create).toHaveBeenCalled();
    expect(userRepositoryMock.save).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should return a JWT token on successful login', async () => {
    const loginDto: LoginDto = {
      slug: chance.string({ length: 10, pool: 'abcdefghijklmno_pqrstuvwxyz0123456789' }),
      password: chance.string({ length: 10 }),
    };
    const user = {
      id: 1,
      slug: loginDto.slug,
      role_id: 1,
      verifyPassword: jest.fn().mockResolvedValue(true),
    } as any;

    userRepositoryMock.findOne.mockResolvedValue(user);
    jwtServiceMock.sign.mockReturnValue('test-token');
    configServiceMock.get.mockReturnValue('test-secret');

    const result = await service.login(loginDto);

    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { slug: loginDto.slug },
      select: { slug: true, role_id: true, password: true }
    });
    expect(user.verifyPassword).toHaveBeenCalledWith(loginDto.password);
    expect(jwtServiceMock.sign).toHaveBeenCalledWith({ slug: user.slug, role: user.role_id }, { secret: 'test-secret', expiresIn: '14d' });
    expect(result).toEqual({ token: 'test-token' });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
