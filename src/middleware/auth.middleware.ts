import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { NextFunction, Request } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){}

    use(req: Request, res: Response, next: NextFunction){
        const authHeader = req.headers['authorization'];

        if(!authHeader) throw new HttpException('Unauthorized', 401);

        try{
            const token = authHeader.split(' ')[1];
            const secret = this.configService.get<string>('JWT_SECRET');
            const decoded = this.jwtService.verify(token, { secret });
            req['user'] = decoded;
            next();
        }catch(err){
            throw new HttpException('Invalid token', 401);
        }
    }
}