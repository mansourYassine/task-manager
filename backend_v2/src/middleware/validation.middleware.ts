import express, { type Express, type Request, type Response, type NextFunction } from 'express';

export function validateTaskId(req: Request, res: Response, next: NextFunction) {
    if (Number.isInteger(Number(req.params.taskId))) {
        next();
    } else {
        res.status(400).json({success: false, message: "Invalid task id!"});
    }
}