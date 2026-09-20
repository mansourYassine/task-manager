import type { ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db.js";
import type { CreateTask, TaskRow, UpdatedTask } from "../types/task.js";

export async function findAll(): Promise<TaskRow[]> {
    const [rows] = await pool.query<TaskRow[]>(`
        SELECT * 
        FROM task;
    `);

    return rows;
}

export async function findById(id: string | number): Promise<TaskRow | undefined> {
    const [rows] = await pool.execute<TaskRow[]>(`
        SELECT *
        FROM task
        WHERE id = ?
    `, [id]);

    return rows[0];
}

export async function insert(taskToCreate: CreateTask): Promise<number> {
    const { title, description, priority, dueDate, assignedTo } = taskToCreate;
    const [insertResult] = await pool.execute<ResultSetHeader>(`
            INSERT INTO task (title, created_by, description, priority, status, due_date, assigned_to)
            VALUES (?, "Yassine Admin", ?, ?, "TODO", ?, ?)
        `, [title, description, priority, dueDate, assignedTo]);
    const newTaskId = insertResult.insertId;
    return newTaskId;
}

export async function update(id: number, task: UpdatedTask): Promise<boolean> {
    const { title, description, priority, status, dueDate, assignedTo } = task;
    const [result] = await pool.execute<ResultSetHeader>(`
        UPDATE task
        SET title = ?, description = ?, priority = ?, status = ?, due_date = ?, assigned_to = ? 
        WHERE id = ?
    `, [title, description, priority, status, dueDate, assignedTo, id]);
    return result.affectedRows === 1;
}

export async function updateStatus(id: number, status: 'TODO' | 'IN_PROGRESS' | 'DONE'): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(`
        UPDATE task
        SET status = ?
        WHERE id = ?
    `, [status, id]);
    return result.affectedRows === 1;
}

export async function deleteTask(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(`
        DELETE FROM task
        WHERE id = ?
    `, [id]);
    return result.affectedRows === 1;
}

export async function isTaskExists(taskId: number): Promise<boolean> {
    const [rows] = await pool.execute(`
        SELECT *
        FROM task
        WHERE id = ?
        LIMIT 1;
    `, [taskId]) as [any[], any];

    return rows.length > 0;
}