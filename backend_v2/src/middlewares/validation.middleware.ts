import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import type { CreateTask } from '../types/task.js';
import type { CreateTaskSchema } from '../validations/task.validation.js';
import z from 'zod';
import type { ZodSchema } from 'zod/v3';
import { error } from 'console';
import type { ParamsDictionary } from 'express-serve-static-core';
import { ValidationError } from '../exceptions/exceptions.js';

export function validateParams(schema: z.ZodType<ParamsDictionary>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            const error = result.error.issues.map(issue => ({
                field: issue.path.join('.'), 
                message: issue.message
            }));
            throw new ValidationError(error);
        }
        req.params = result.data;
        next();
    }
}

export function validateBody<T extends z.ZodType>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const error = result.error.issues.map(issue => ({
                field: issue.path.join('.'), 
                message: issue.message
            })).reduce((acc, curr, i) => {
                return acc + `${i+1}: field: ${curr.field}, message: ${curr.message}.`;
            }, "");
            throw new ValidationError(error);
        }
        req.body = result.data;
        next();
    }
}