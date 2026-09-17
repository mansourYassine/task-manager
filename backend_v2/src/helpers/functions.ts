import type { RowDataPacket } from "mysql2/promise";
import { pool } from "../config/db.js";

export async function isTaskExists(taskId: string): Promise<boolean> {
    const [rows] = await pool.execute(`
        SELECT *
        FROM task
        WHERE id = ?
        LIMIT 1;
    `, [taskId]) as [any[], any];

    return rows.length > 0;
}