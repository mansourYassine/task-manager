import type { ResultSetHeader } from "mysql2";
import { pool } from "../config/db.js";
import type { RegisterUserSchema } from "../validations/user.validation.js";
import type { User, UserRow } from "../types/user.js";

export async function register(newUser: RegisterUserSchema): Promise<number> {
    const {name, email, password, role} = newUser;
    const [registerResult] = await pool.execute<ResultSetHeader>(
        `INSERT INTO user (name, email, password, role)
        VALUES (?, ?, ?, ?)`,
        [name, email, password, role]
    );
    const newUserId = registerResult.insertId;
    return newUserId;
}

export async function findById(id: number): Promise<UserRow | undefined> {
    const [rows] = await pool.execute<UserRow[]>(`
        SELECT *
        FROM user
        WHERE id = ?
    `, [id]);

    return rows[0];
}

export async function findByEmail(email: string): Promise<UserRow | undefined> {
    const [rows] = await pool.execute<UserRow[]>(`
        SELECT *
        FROM user
        WHERE email = ?
    `, [email]);

    return rows[0];
}