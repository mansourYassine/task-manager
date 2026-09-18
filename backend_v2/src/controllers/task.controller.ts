import { pool } from "../config/db.js";
import { type Request, type Response } from 'express';
import type { CreateTask, Task, TaskRow, UpdatedTask } from "../types/user.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
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

        res.status(200).json(responseTasks);
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

        res.status(200).json(task);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database Error!' })
    }
}

export async function createTask(req: Request<{}, {}, CreateTask>, res: Response) {
    try {
        const { title, description, priority, dueDate, assignedTo } = req.body;
        const [insertResult] = await pool.execute<ResultSetHeader>(`
            INSERT INTO task (title, created_by, description, priority, status, due_date, assigned_to)
            VALUES (?, "Yassine Admin", ?, ?, "TODO", ?, ?)
        `, [title, description, priority, dueDate, assignedTo]);

        const newTaskId = insertResult.insertId;

        const [rows] = await pool.execute<TaskRow[]>(`
            SELECT *
            FROM task
            WHERE id = ?;
        `, [newTaskId]);

        const newTask = rows[0];

        if (!newTask) {
            throw new Error(`Error finding the task with id ${newTaskId} `);
        }

        res.status(201).json({
            id: newTask.id,
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority,
            status: newTask.status,
            dueDate: newTask.due_date,
            createdBy: newTask.created_by,
            assignedTo: newTask.assigned_to
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database Error!' });
    }
}

export async function updateTaskStatus(req: Request<{ taskId: string }>, res: Response): Promise<void> {
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
                res.status(404).json({ message: `Task doesn't exist in the database!` });
                return;
            }

            res.status(200).json({
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
            res.status(404).json({ message: `Task doesn't exist in the database!` });
            return;
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database Error!' });
    }
}

export async function updataTask(req: Request<{ taskId: string }, {}, UpdatedTask>, res: Response): Promise<void> {
    try {
        const taskExist: boolean = await isTaskExists(req.params.taskId);
        if (taskExist) {
            const { title, description, priority, status, dueDate, assignedTo } = req.body;

            const [result] = await pool.execute(`
                UPDATE task
                SET title = ?, description = ?, priority = ?, status = ?, due_date = ?, assigned_to = ? 
                WHERE id = ?
            `, [title, description, priority, status, dueDate, assignedTo, req.params.taskId]);

            const [[task]] = await pool.execute<TaskRow[]>(`
                SELECT *
                FROM task
                WHERE id = ?
            `, [req.params.taskId]);

            if (!task) {
                res.status(404).json({ message: `Task doesn't exist in the database!` });
                return;
            }

            res.status(200).json({
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
            res.status(404).json({ message: `Task doesn't exist in the database!` });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database Error!' });
    }
}

export async function deleteTask(req: Request<{taskId: string}>, res: Response): Promise<void> {
    try {
        const taskExist: boolean = await isTaskExists(req.params.taskId);
        if (taskExist) {
            await pool.execute(`
                DELETE FROM task
                WHERE id = ?
            `, [req.params.taskId]);
            res.status(200).json({ message: 'Task deleted successfully' });
        } else {
            res.status(404).json({ message: `Task doesn't exist in the database!` });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database Error!' });
    }
}