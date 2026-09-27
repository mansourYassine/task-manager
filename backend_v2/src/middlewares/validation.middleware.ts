import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import type { CreateTask } from '../types/task.js';
import type { CreateTaskSchema } from '../validations/task.validation.js';
import z from 'zod';
import type { ZodSchema } from 'zod/v3';
import { error } from 'console';
import type { ParamsDictionary } from 'express-serve-static-core';

export function validateParams(schema: z.ZodType<ParamsDictionary>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            return res.status(400).json({
                success: result.success, 
                errors: result.error.issues.map(issue => ({
                    field: issue.path.join('.'), 
                    message: issue.message
                }))
            });
        }
        req.params = result.data;
        next();
    }
}

export function validateBody<T extends z.ZodType>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: result.success, 
                errors: result.error.issues.map(issue => ({
                    field: issue.path.join('.'), 
                    message: issue.message
                }))
            });
        }
        req.body = result.data;
        next();
    }
}