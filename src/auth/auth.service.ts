import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import slug from 'slug';
import { UsersService } from 'src/users/users.service';
import { Role } from './entities/role.entity';
import { getUrl } from 'src/utils/url';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UsersService,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ){}

    async signup(createUserDto: SignUpDto){
        try{
            let genSlug = true;
            let userSlug = slug(createUserDto.name, { lower: true });
            while(genSlug){
                const hasSlug = await this.userService.findUserBySlug(userSlug);
                if(hasSlug){
                    const slugSuffix = Math.floor(Math.random() * 99999).toString();
                    userSlug = slug(createUserDto.name, { lower: true }) + slugSuffix;
                }

                genSlug = !!hasSlug;
            }

            if(await this.userRepository.findOne({ where:{ email: createUserDto.email } })) {
                throw new HttpException("Email already exists", HttpStatus.BAD_REQUEST);
            }

            const defaultRole = await this.roleRepository.findOne({ where: { name: 'default' } });
            if(!defaultRole) throw new HttpException("Default role not found", HttpStatus.INTERNAL_SERVER_ERROR);

            const newUser = this.userRepository.create({
                ...createUserDto,
                slug: userSlug,
                role_id: defaultRole.id
            });

            const payload = { slug: newUser.slug, role: newUser.role_id };
            const token = this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '14d'
            });

            if(createUserDto.avatar){
                newUser.avatar = getUrl(createUserDto.avatar);
            }

            if(createUserDto.cover){
                newUser.cover = getUrl(createUserDto.cover);
            }

            await this.userRepository.save(newUser);
            return {
                ...newUser,
                token
            };
        }catch(error){
            throw new HttpException("Error creating user", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async login(loginDto: LoginDto): Promise<{ token: string }>{
        try{
            const user = loginDto.slug
                    ? await this.userRepository.findOne({
                            where: { slug: loginDto.slug },
                            select: { slug: true, role_id: true, password: true }
                        })
                    : await this.userRepository.findOne({
                            where: { email: loginDto.email },
                            select: { slug: true, role_id: true, password: true }
                        });
            if(!user) throw new HttpException('User not found', 404);

            const isPasswordValid = await user.verifyPassword(loginDto.password);
            if(!isPasswordValid) throw new HttpException('Invalid Credentials password', 401);
            
            const payload = { slug: user.slug, role: user.role_id };
            const token = this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '14d'
            });

            return {
                token
            };
        }catch(error){
            throw new HttpException(error.message, error.status || 500);
        }
    }
}
