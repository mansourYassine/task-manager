import type { JwtPayload } from "jsonwebtoken";
import type { RowDataPacket } from "mysql2";

export interface User {
    id: number;
    name: string;
    role: 'admin' | 'employee';
}

export interface UserRow extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'employee';
}

export interface CustomJwtPayload extends JwtPayload {
    sub: string;
    username: string;
    role: 'admin' | 'employee';
}