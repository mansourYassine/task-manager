import type { Request } from "express";
import type { User } from "../../types/user.js";
import { UnauthorizedError } from "../../exceptions/exceptions.js";

export function getUserFromRequest(req: Request): User {
    if (!req.user) {
        throw new UnauthorizedError("You are not logged in");
    }
    return req.user;
}