import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseInterceptors, HttpException, UploadedFile, UploadedFiles } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  @UseInterceptors(FileFieldsInterceptor([
      {
        name: 'avatar', maxCount: 1
      },
      {
        name: 'cover', maxCount: 1
      }
    ],{
    storage: diskStorage({
      destination: (req, file, callback) =>{
        if(file.fieldname === 'avatar'){
          const uploadAvatarDir = join(process.cwd(), 'public/uploads/user-avatar');
          mkdirSync(uploadAvatarDir, { recursive: true });
          return callback(null, uploadAvatarDir);
        }
        
        const uploadCoverDir = join(process.cwd(), 'public/uploads/user-cover');
        mkdirSync(uploadCoverDir, { recursive: true });
        callback(null, uploadCoverDir);
      },
      filename: (req, file, callback)=>{
        try{
          const fileExtension = file.originalname.split('.').pop() || 'bin';

          for(let attempt = 0; attempt < 5; attempt++){
            const uniqueFilename = `${randomUUID()}.${fileExtension}`;
            if(
              existsSync(join(process.cwd(), 'public/uploads/user-avatar', uniqueFilename)) ||
              existsSync(join(process.cwd(), 'public/uploads/user-cover', uniqueFilename
            ))){
              continue;
            }

            return callback(null, uniqueFilename);
          }

          return callback(new Error('Could not generate a unique filename after multiple attempts'), '');
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
  async signup(@Body() createUserDto: SignUpDto, @UploadedFiles() files?: { avatar?: Express.Multer.File[], cover?: Express.Multer.File[] }) {
    if(files?.avatar){
      createUserDto.avatar = `/uploads/user-avatar/${files?.avatar[0].filename}`;
    }

    if(files?.cover){
      createUserDto.cover = `/uploads/user-cover/${files.cover[0].filename}`;
    }
    
    return await this.authService.signup(createUserDto);
  }

}
