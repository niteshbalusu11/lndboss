import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { AuthenticationService } from './modules/authentication/authentication.service';
import { JwtService } from '@nestjs/jwt';

interface UserRequest extends Request {
  user: any;
}

@Injectable()
export class isAuthenticated implements NestMiddleware {
  constructor(private readonly jwt: JwtService, private readonly authenticationService: AuthenticationService) {}
  async use(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = await this.jwt.verify(token);
        const user = await this.authenticationService.getOne(decoded.accountName);
        if (!!user) {
          req.user = user;
          next();
        } else {
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
      } else {
        throw new HttpException('No token found', HttpStatus.NOT_FOUND);
      }
    } catch {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
