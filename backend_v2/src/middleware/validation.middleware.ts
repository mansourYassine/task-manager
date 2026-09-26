import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import type { CreateTask } from '../types/task.js';
import type { CreateTaskSchema } from '../schemas/createTaskSchema.js';
import type z from 'zod';
import type { ZodSchema } from 'zod/v3';

export function validateTaskId(req: Request, res: Response, next: NextFunction) {
    if (Number.isInteger(Number(req.params.taskId))) {
        next();
    } else {
        res.status(400).json({success: false, message: "Invalid task id!"});
    }
}

export function validateBody<T extends z.ZodType>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({success: false, errors: result.error.issues});
        }
        req.body = result.data;
        next();
    }
}