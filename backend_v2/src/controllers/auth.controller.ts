import type { Request, Response } from "express";
import type { RegisterUserSchema } from "../validations/user.validation.js";
import * as authService from "../services/auth.service.js";

export async function register(req: Request<{}, {}, RegisterUserSchema>, res: Response) {
    const userToRegister: RegisterUserSchema = req.body;
    const newUser = await authService.register(userToRegister);
    res.status(201).json({success: true, data: newUser});
}