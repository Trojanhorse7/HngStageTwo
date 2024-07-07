import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JwtSecret =  process.env.JWT_SECRET as Secret;

export interface CustomRequest extends Request {
    user: string | JwtPayload;
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                status: 'Bad request',
                message: 'No Auth Token',
                statusCode: 401,
            });
        }

        const decoded = jwt.verify(token, JwtSecret);
        (req as CustomRequest).user = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            status: 'Bad request',
            message: 'Error occured, try again',
            statusCode: 401,
        });
    }
};

export default auth;