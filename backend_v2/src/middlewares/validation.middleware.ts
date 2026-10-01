import { type Request, type Response, type NextFunction } from 'express';
import z from 'zod';
import type { ParamsDictionary } from 'express-serve-static-core';
import { ValidationError } from '../exceptions/exceptions.js';

export function validateParams(schema: z.ZodType<ParamsDictionary>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            const errors = result.error.issues.map(issue => ({
                field: issue.path.join('.'), 
                message: issue.message
            }));
            throw new ValidationError('Validation Error', errors);
        }
        req.params = result.data;
        next();
    }
}

export function validateBody<T extends z.ZodType>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.issues.map(issue => ({
                field: issue.path.join('.'), 
                message: issue.message
            }));
            throw new ValidationError('Validation Error', errors);
        }
        req.body = result.data;
        next();
    }
}