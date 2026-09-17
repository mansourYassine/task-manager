import { pool } from "../config/db.js";
import { type Request, type Response } from 'express';
import type { Task, TaskRow } from "../types/user.js";
import type { RowDataPacket } from "mysql2";
import { isTaskExists } from "../helpers/functions.js";

export async function getAllTasks(req: Request, res: Response) {
    try {
        const [tasks] = await pool.query<TaskRow[]>(`
            SELECT * 
            FROM task;
        `);

        const responseTasks: Task[] = tasks.map((t): Task => {
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
        });

        res.json(responseTasks);
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

export async function updateTaskStatus(req: Request<{taskId: string}>, res: Response) {
    try {
        const taskExist: boolean = await isTaskExists(req.params.taskId);
        if (taskExist) {
            const { body } = req;
            const [result] = await pool.execute(`
                UPDATE task
                SET status = ?
                WHERE id = ?
            `, [body.status, req.params.taskId]);

            const [[task]] = await pool.execute<TaskRow[]>(`
                SELECT *
                FROM task
                WHERE id = ?
            `, [req.params.taskId]);

            if (!task) {
                throw new Error(`Error finding the task with id ${req.params.taskId} `);
            }

            res.json({
                id: task.id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.due_date,
                createdBy: task.created_by,
                assignedTo: task.assigned_to
            });
        } else {
            throw new Error(`Task doesn't exist in the database!`);
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database Error!' })
    }
}