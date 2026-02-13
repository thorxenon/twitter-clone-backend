import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(

    ){}

    use(req: Request, res: Response, next: NextFunction){
        const authHeader = req.headers['authorization'];

        if(!authHeader) throw new HttpException('Unauthorized', 401);
    }
}