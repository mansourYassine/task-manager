import type { NextFunction, Request, Response } from "express";

export function handleWrongPaths(req: Request, res: Response, next: NextFunction) {
    res.status(404).json({success: false, message: `Cannot find "${req.originalUrl}" path on the server!`});
}