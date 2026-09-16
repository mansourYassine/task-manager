import { pool } from "../config/db.js";
import { type Request, type Response } from 'express';
import type { Task, TaskRow } from "../types/user.js";

export async function getAllTasks(req: Request, res: Response) {
    try {
        const [tasks] = await pool.query<TaskRow[]>(`
            SELECT * 
            FROM task;
        `);

        const responeTasks: Task[] = tasks.map((t): Task => {
            return {
                id: t.id,
                title: t.title,
                description: t.description,
                priority: t.priority,
                status: t.status,
                dueDate: t.due_date,
                createdBy: t.created_by,
                assignedTo: t.assigned_to
            }
        })

        res.json(responeTasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database Error' })
    }
}

export async function getTaskById(req: Request<{ taskId: string }>, res: Response) {
    try {
        const [task] = await pool.execute<TaskRow[]>(`
            SELECT *
            FROM task
            WHERE id = ?
        `, [req.params.taskId]);

        res.json(task);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database Error!' })
    }
}

export function createTask(req: Request, res: Response) {

}