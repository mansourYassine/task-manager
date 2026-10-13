import bcrypt from "bcryptjs";
import type { RegisterUserSchema } from "../validations/user.validation.js";
import * as userRepository from "../repositories/user.repository.js";
import { mapUserRowToUser } from "../utils/mapper/user.mapper.js";
import type { User } from "../types/user.js";
import { EmailTakenError } from "../exceptions/exceptions.js";

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