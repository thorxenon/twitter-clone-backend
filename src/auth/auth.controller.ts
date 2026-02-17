import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseInterceptors, HttpException, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  @UseInterceptors(FileInterceptor('avatar',{
    storage: diskStorage({
      destination: (req, folder, callback) =>{
        const uploadDir = join(process.cwd(), 'public/uploads/user-avatar');
        mkdirSync(uploadDir, { recursive: true });
        callback(null, uploadDir);
      },
      filename: (req, file, callback)=>{
        try{
          const uniqueSuffixNumber = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const unixSuffixString = Math.floor(Math.random() * 9999999).toString();
          const fileExtension = file.originalname.split('.').pop();
          const uniqueFilename = `${uniqueSuffixNumber}-${unixSuffixString}.${fileExtension}`;

          // Verifica se o arquivo já existe
          if(existsSync(join(process.cwd(), 'public/uploads/user-avatar', uniqueFilename))){
            return callback(new Error('File with the same name already exists!'), '');
          }

          callback(null, uniqueFilename);
        }catch(error){
          throw new HttpException('Error processing file upload', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    }),
    fileFilter: (req, file, callback) =>{
      if(!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)){
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    }
  }))
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: SignUpDto, @UploadedFile() avatar: Express.Multer.File) {
    if(avatar){
      createUserDto.avatar = `/uploads/user-avatar/${avatar.filename}`;
    }
    
    return await this.authService.signup(createUserDto);
  }

}
