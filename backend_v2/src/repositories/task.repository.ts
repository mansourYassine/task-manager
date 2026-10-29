import type { ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/db.js";
import type { TaskRow } from "../types/task.js";
import type { CreateTaskSchema, UpdateTaskSchema } from "../validations/task.validation.js";

export async function findAll(): Promise<TaskRow[]> {
    const [rows] = await pool.query<TaskRow[]>(`
        SELECT t.id, t.created_by, t.assigned_to, cu.name as created_by_name, au.name as assigned_to_name, t.title, t.priority, t.status, t.description, t.due_date
        FROM task t
        JOIN user cu
        ON cu.id = t.created_by
        LEFT JOIN user au
        ON au.id = t.assigned_to;
    `);

    return rows;
}

export async function findAllForEmployee(employeeId: number): Promise<TaskRow[]> {
    const [rows] = await pool.execute<TaskRow[]>(`
        SELECT t.id, t.created_by, t.assigned_to, cu.name as created_by_name, au.name as assigned_to_name, t.title, t.priority, t.status, t.description, t.due_date
        FROM task t
        JOIN user cu
        ON cu.id = t.created_by
        LEFT JOIN user au
        ON au.id = t.assigned_to
        WHERE t.assigned_to = ?
    `, [employeeId]);

    return rows;
}

export async function findById(taskId: number): Promise<TaskRow | undefined> {
    const [rows] = await pool.execute<TaskRow[]>(`
        SELECT t.id, t.created_by, t.assigned_to, cu.name as created_by_name, au.name as assigned_to_name, t.title, t.priority, t.status, t.description, t.due_date
        FROM task t
        JOIN user cu
        ON cu.id = t.created_by
        LEFT JOIN user au
        ON au.id = t.assigned_to
        WHERE t.id = ?;
    `, [taskId]);

    return rows[0];
}

export async function findByIdForEmployee(taskId: number, employeeId: number): Promise<TaskRow | undefined> {
    const [rows] = await pool.execute<TaskRow[]>(`
        SELECT t.id, t.created_by, t.assigned_to, cu.name as created_by_name, au.name as assigned_to_name, t.title, t.priority, t.status, t.description, t.due_date
        FROM task t
        JOIN user cu
        ON cu.id = t.created_by
        LEFT JOIN user au
        ON au.id = t.assigned_to
        WHERE t.id = ? AND t.assigned_to = ?;
    `, [taskId, employeeId]);

    return rows[0];
}

export async function insert(userId: number, taskToCreate: CreateTaskSchema): Promise<number> {
    const { title, description, priority, dueDate, assignedTo } = taskToCreate;
    const [insertResult] = await pool.execute<ResultSetHeader>(`
            INSERT INTO task (title, created_by, description, priority, status, due_date, assigned_to)
            VALUES (?, ?, ?, ?, "TODO", ?, ?)
        `, [title, userId, description || null, priority, dueDate || null, assignedTo || null]);
    const newTaskId = insertResult.insertId;
    return newTaskId;
}

export async function update(id: number, task: UpdateTaskSchema): Promise<void> {
    const { title, description, priority, status, dueDate, assignedTo } = task;
    await pool.execute<ResultSetHeader>(`
        UPDATE task
        SET title = ?, description = ?, priority = ?, status = ?, due_date = ?, assigned_to = ? 
        WHERE id = ?
    `, [title, description || null, priority, status, dueDate || null, assignedTo || null, id]);
}

export async function updateStatus(taskId: number, status: 'TODO' | 'IN_PROGRESS' | 'DONE'): Promise<void> {
    await pool.execute<ResultSetHeader>(`
        UPDATE task
        SET status = ?
        WHERE id = ?
    `, [status, taskId]);
}

export async function updateStatusForEmployee(taskId: number, employeeId: number, status: 'TODO' | 'IN_PROGRESS' | 'DONE'): Promise<void> {
    await pool.execute<ResultSetHeader>(`
        UPDATE task
        SET status = ?
        WHERE id = ? AND assigned_to = ?
    `, [status, taskId, employeeId]);
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