import type { NextFunction, Request, Response } from "express";
import { BaseError, ValidationError } from "../exceptions/exceptions.js";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof BaseError) {
        if (err instanceof ValidationError) {
            res.status(err.status).json({success: false, message: err.message, errors: err.errors});
        } else {
            res.status(err.status).json({success: false, message: err.message});
        }
    } else {
        console.error(err);
        const message: string = "An unexpected error occurred";
        res.status(500).json({success: false, message: message});
    }
}