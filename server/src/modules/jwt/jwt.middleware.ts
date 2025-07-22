import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import configuration from 'src/config';

const config = configuration();

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        if (!config.jwt.accessTokenSecret) {
          throw new Error('JWT_SECRET is not defined');
        }
        const decoded = jwt.verify(token, config.jwt.accessTokenSecret);
        req['user'] = decoded;
      } catch {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      return res.status(401).json({ message: 'No token provided' });
    }

    next();
  }
}
