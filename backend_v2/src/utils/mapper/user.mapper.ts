import type { User, UserRow } from "../../types/user.js";

export function mapUserRowToUser (u: UserRow): User {
    return {
        id: u.id,
        name: u.name,
        role: u.role
    }
}