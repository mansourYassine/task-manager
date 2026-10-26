import bcrypt from "bcryptjs";
import type { LoginUserSchema, RegisterUserSchema } from "../validations/user.validation.js";
import * as userRepository from "../repositories/user.repository.js";
import { mapUserRowToUser } from "../utils/mapper/user.mapper.js";
import type { CustomJwtPayload, User } from "../types/user.js";
import { EmailTakenError, ForbiddenError, IncorrectCredentialsError, UnauthorizedError } from "../exceptions/exceptions.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { hashToken } from "../utils/helpers/hashFunctions.js";
dotenv.config();

export async function register(newUser: RegisterUserSchema): Promise<User> {
    // Check if email already taken
    const existedUser = await userRepository.findByEmail(newUser.email);
    if (existedUser) {
        throw new EmailTakenError('Email already taken!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    const userToRegister = {...newUser, password: hashedPassword};
    const userId = await userRepository.register(userToRegister);
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new Error(`User ${userId} was inserted but could not be retrieved!`);
    }
    return mapUserRowToUser(user);
}

export async function login(loginUser: LoginUserSchema) {
    const user = await userRepository.findByEmail(loginUser.email);
    if (!user) {
        throw new IncorrectCredentialsError('Email or password is incorrect!');
    }
    
    const isCorrectPassword = await bcrypt.compare(loginUser.password, user.password);
    if (!isCorrectPassword) {
        throw new IncorrectCredentialsError('Email or password is incorrect!');
    }

    const payload = {
        sub: user.id,
        username: user.name,
        role: user.role
    };
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined in the env file!");
    }
    const accessToken = jwt.sign(payload, accessTokenSecret, {expiresIn: '5m'});

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined in the env file!");
    }
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {expiresIn: '1d'});

    const decoded = jwt.decode(refreshToken) as JwtPayload;
    if (!decoded.exp) {throw new Error("Failure during decoding the refresh token!")};
    const expirationDate = new Date(decoded.exp * 1000);
    const hashedToken = hashToken(refreshToken);
    await userRepository.storeRefreshToken(user.id, hashedToken, expirationDate);

    return {accessToken, refreshToken};
}

export async function refresh(refreshToken: string | undefined): Promise<string> {
    if (!refreshToken) {throw new UnauthorizedError("You are not logged in!")};
    const refreshTokenSecret = process.env?.REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined in the env file!");
    }

    try {
        // Check if the refreshToken is valid
        const decoded = jwt.verify(refreshToken, refreshTokenSecret) as CustomJwtPayload;
        // Check if it exists in the database
        const hashedRefreshToken = hashToken(refreshToken);
        const isTokenExists = await userRepository.isTokenExists(hashedRefreshToken);
        if (!isTokenExists) {
            throw new UnauthorizedError("You are not logged in!");
        }
    
        // if both checks are valid, create a new access token
        const payload = {
            sub: decoded.sub,
            username: decoded.username,
            role: decoded.role
        };
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        if (!accessTokenSecret) {
            throw new Error("ACCESS_TOKEN_SECRET is not defined in the env file!");
        }
        const accessToken = jwt.sign(payload, accessTokenSecret, {expiresIn: '5m'});
        return accessToken;
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            throw new UnauthorizedError("You are not logged in!");
        }
        throw new ForbiddenError(`Invalid Token!`);
    }
}

export async function logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;
    
    const hashedRefreshToken = hashToken(refreshToken);
    await userRepository.deleteRefreshToken(hashedRefreshToken);
}

export async function getUsersInfo(): Promise<User[] > {
    const usersRow = await userRepository.findAll();
    const users = usersRow?.map(mapUserRowToUser);
    if (!users) {
        throw new Error("Error fetching users");
    }
    return users;
}