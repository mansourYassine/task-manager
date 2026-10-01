import type { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../exceptions/exceptions.js";

export function handleWrongPaths(req: Request, res: Response, next: NextFunction) {
    // res.status(404).json({success: false, message: `Cannot find "${req.originalUrl}" path on the server!`});
    throw new NotFoundError(`Cannot find "${req.originalUrl}" path on the server!`);
}