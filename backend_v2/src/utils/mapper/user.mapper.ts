import type { User, UserRow } from "../../types/user.js";

export function mapUserRowToUser (u: UserRow): User {
    return {
        name: u.name,
        email: u.email,
        role: u.role
    }
}