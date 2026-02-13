import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ){}


  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async login(loginDto: LoginDto): Promise<{ token: string }>{
    try{
      const user = await this.userRepository.findOne({ where: { nickname: loginDto.nickname } });
      if(!user) throw new HttpException('User not found', 404);

      const isPasswordValid = await user.verifyPassword(loginDto.password);
      if(!isPasswordValid) throw new HttpException('Invalid password', 401);
      
      const payload = { nickname: user.nickname, role: user.roleId };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '10d'
      });

      return {
        token
      };
    }catch(error){
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
