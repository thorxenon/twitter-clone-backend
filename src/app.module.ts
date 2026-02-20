import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthMiddleware } from './middleware/auth.middleware';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TweetsModule } from './tweets/tweets.module';
import { LikesModule } from './likes/likes.module';
import { TrendsModule } from './trends/trends.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ServeStaticModule.forRoot(
      {
        rootPath: join('public/uploads/tweet-images'),
        serveRoot: '/uploads/tweet/images',
      },
      {
        rootPath: join('public/uploads/user-avatar'),
        serveRoot: '/uploads/user-avatar',
      },
      {
        rootPath: join('public/uploads/user-cover'),
        serveRoot: '/uploads/user-cover',
      }
    ),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '14d' },
      }),
      global: true, // Torna o JwtModule global
    }),
    
    AuthModule,
    UsersModule,
    TweetsModule,
    LikesModule,
    TrendsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
      AppService,
    ],
  exports: [ JwtModule, TypeOrmModule  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes(
      '/tweets',
      '/likes',
      '/users',
      '/feed',
      '/suggestions'
    );  
  }
}