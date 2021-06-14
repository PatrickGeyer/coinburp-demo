import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.headers['x-access-token'])
        req['user'] = AuthService.verify(req.headers['x-access-token'] as string)
    next();
};