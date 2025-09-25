// src/shared/auth.middleware.ts
import { NextFunction, Request, Response } from 'express';
import { userService } from '../module/user/user.service';
import { CustomError } from './exception';
import { HttpErrorStatus } from './util.types';
import { verifyJWT } from '../module/auth/util/jwt.util';

export const isAuthenticated = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new CustomError('User is not authenticated', 'AUTH', HttpErrorStatus.Unauthorized));
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = verifyJWT(token) as any;

    (req.session as any).userId = payload.userId || payload.sub;
    (req.session as any).role = payload.role;

    return next();
  } catch (error) {
    return next(new CustomError('JWT is invalid or expired', 'AUTH', HttpErrorStatus.Unauthorized));
  }
};

export const authorizeRoles = (...roles: ('ADMIN' | 'COACH' | 'STUDENT')[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userId = (req.session as any).userId;
    const userRole = (req.session as any).role;

    if (!userId) {
      return next(new CustomError('User is not authenticated', 'AUTH', HttpErrorStatus.Unauthorized));
    }

    const user = userService.getById(userId);

    if (!user) {
      return next(new CustomError('User not found', 'AUTH', HttpErrorStatus.Unauthorized));
    }

    if (!roles.includes(userRole)) {
      return next(new CustomError('Forbidden: insufficient role', 'AUTH', HttpErrorStatus.Forbidden));
    }

    next();
  };
};
