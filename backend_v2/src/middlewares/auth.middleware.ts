import type { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../exceptions/exceptions.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import type { CustomJwtPayload } from "../types/user.js";
dotenv.config();

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers['authorization']?.split(' ')[1];
    if (!accessToken) throw new UnauthorizedError("You are not logged in!");
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined in the env file!");
    }

    try {
        const decoded = jwt.verify(accessToken, accessTokenSecret) as CustomJwtPayload;
        req.user = {
            id: Number(decoded.sub), 
            name: decoded.username, 
            role: decoded.role
        };
        next();
    } catch (error) {
        throw new UnauthorizedError(`Invalid Token!`);
    }
}

export function authorize(...roles: ('admin' | 'employee')[]) {
    if (roles.length === 0) {
        throw new Error("authorize needs at least one role");
    }
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new UnauthorizedError("You are not logged in!");
        }
    
        if (!roles.includes(req.user.role)) {
            throw new ForbiddenError('You are not authorized!');
        }
    
        next();
    }
}