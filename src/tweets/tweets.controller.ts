import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, HttpException, HttpStatus, UploadedFile } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { CreateReplyTweetDto } from './dto/create-reply.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/guards/permission.guard';
import { RequiredPermission } from 'src/decorators/permission.decorator';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { CreateLikeDto } from 'src/likes/dto/create-like.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('tweets')
@UseGuards(AuthGuard(), PermissionGuard)
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image',{
      storage: diskStorage({
        destination: (req, folder, callback) =>{
          const uploadDir = join(process.cwd(), 'public/uploads/tweet-images');
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
            if(existsSync(join(process.cwd(), 'public/uploads/tweet-images', uniqueFilename))){
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
  create(@Body() createTweetDto: CreateTweetDto, @UploadedFile() image: Express.Multer.File, @Req() req: Request) {
    if(image){
      createTweetDto.image = `uploads/tweet-images/${image.filename}`;
    }

    return this.tweetsService.create(createTweetDto, req.user?.slug as string);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request){
    
  }

  @Post(':id/like')
  likeTweet(@Param('id') id: string, @Body() createLikeDto: CreateLikeDto){
    
  }

  @Get(':id/answers')
  getAnswersFromTweet(@Param('id') id: string){

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTweetDto: UpdateTweetDto){

  }

  @Delete(':id')
  remove(@Param('id') id: string){

  }

}
