import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../shared/catchAsync';
import { prisma } from '../lib/prisma';
import AppError from '../errors/AppError';
import { jwtUtils } from '../utils/jwtUtils';
import { envVeriables } from '../config/envConfig';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const checkAuth = () => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // Extract token from Authorization header (Bearer) or cookie
        const token =
            req.headers.authorization?.split(' ')[1] ||
            req.cookies['accessToken'];

        if (!token) {
            throw new AppError(401, 'You are not authorized');
        }

        // 1. Verify and decode the access token
        const result = jwtUtils.verifyToken(token, envVeriables.JWT_SECRET_KEY);

        if (!result.seccess || !result.data) {
            throw new AppError(401, 'Invalid or expired token');
        }

        const decoded = result.data as { userId: string;[key: string]: any };

        // 2. Extract userId from decoded payload
        const userId = decoded.userId;

        if (!userId) {
            throw new AppError(401, 'Invalid token payload');
        }

        // 3. Find user in database using userId
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new AppError(401, 'User not found');
        }

        // Attach user to request object
        req.user = {
            userId: user.id,
            email: user.email,
        };
        next();
    });
};