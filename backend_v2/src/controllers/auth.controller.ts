import type { Request, Response } from "express";
import type { LoginUserSchema, RegisterUserSchema } from "../validations/user.validation.js";
import * as authService from "../services/auth.service.js";
import { getUserFromRequest } from "../utils/helpers/user.helpers.js";

export async function register(req: Request<{}, {}, RegisterUserSchema>, res: Response) {
    const userToRegister: RegisterUserSchema = req.body;
    const newUser = await authService.register(userToRegister);
    res.status(201).json({success: true, data: newUser});
}

export async function login(req: Request<{}, {}, LoginUserSchema>, res: Response) {
    const userToLogin: LoginUserSchema = req.body;
    const tokens = await authService.login(userToLogin);

    res.cookie('jwt', tokens.refreshToken, {httpOnly: true, maxAge: 60 * 60 * 1000});
    res.status(200).json({success: true, data: {accessToken: tokens.accessToken}});
}

export async function refresh(req: Request, res: Response) {
    const cookies = req.cookies;
    const newAccessToken = await authService.refresh(cookies?.jwt);
    res.status(200).json({success: true, data: {accessToken: newAccessToken}});
}

export async function logout(req: Request, res: Response) {
    const cookies = req.cookies;
    await authService.logout(cookies?.jwt);
    res.clearCookie('jwt', {httpOnly: true});
    res.sendStatus(204);
}

export async function me(req: Request, res: Response) {
    const user = getUserFromRequest(req);
    res.status(200).json({success: true, data: user});
}

export async function getUsers(req: Request, res: Response) {
    const users = await authService.getUsersInfo();
    res.status(200).json({success: true, data: users});
}