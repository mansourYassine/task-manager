import type { RowDataPacket } from "mysql2";

export interface User {
    name: string;
    email: string;
    role: 'admin' | 'employee';
}

export interface UserRow extends RowDataPacket {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'employee';
}