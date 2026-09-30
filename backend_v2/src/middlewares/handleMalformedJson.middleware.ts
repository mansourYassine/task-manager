import type { NextFunction, Request, Response } from "express";

export function handleMalformedJson(err: Error, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
        res.status(400).json({
            success: false,
            error: 'Bad JSON format. Please check your syntax.'
        });
        return;
    }

    next(err);
};