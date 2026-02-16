import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import slug from 'slug';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){}

    async signup(createUserDto: SignUpDto){
        try{
            if(await this.userRepository.findOne({ where:{ slug: createUserDto.slug } })) {
                throw new HttpException("Nickname already exists", HttpStatus.BAD_REQUEST);
            }

            if(await this.userRepository.findOne({ where:{ email: createUserDto.email } })) {
                throw new HttpException("Email already exists", HttpStatus.BAD_REQUEST);
            }

            const newUser = this.userRepository.create(createUserDto);
            await this.userRepository.save(newUser);
            return newUser;
        }catch(error){
            throw new HttpException("Error creating user", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async login(loginDto: LoginDto): Promise<{ token: string }>{
        try{
            const user = loginDto.slug ? await this.userRepository.findOne({ where: { slug: loginDto.slug } }) : await this.userRepository.findOne({ where: { email: loginDto.email } });
            if(!user) throw new HttpException('User not found', 404);

            const isPasswordValid = await user.verifyPassword(loginDto.password);
            if(!isPasswordValid) throw new HttpException('Invalid Credentials password', 401);
            
            const payload = { slug: user.slug, role: user.role_id };
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
