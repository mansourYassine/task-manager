import { pool } from "../config/db.js";
import { type Request, type Response } from 'express';
import type { CreateTask, Task, TaskRow, UpdatedTask } from "../types/task.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { isTaskExists } from "../repositories/task.repository.js";
import { mapTaskRowToTask } from "../utils/mapper/task.mapper.js";
import * as taskService from "../services/task.service.js";

export async function getAllTasks(req: Request, res: Response): Promise<void> {
    const allTasks = await taskService.getAll();
    res.status(200).json({success: true, data: allTasks});
}

export async function getTaskById(req: Request<{ taskId: string }>, res: Response): Promise<void> {
    try {
        const task = await taskService.getById(req.params.taskId);
        res.status(200).json({success: true, data: task});
    } catch (error: unknown) {
        const message: string = error instanceof Error ? error.message : "An unexpected error occurred"
        res.status(404).json({success: false, error: message});
    }
}

export async function createTask(req: Request<{}, {}, CreateTask>, res: Response) {
    try {
        const taskToCreate: CreateTask = req.body;
        const newTask = await taskService.store(taskToCreate);
        res.status(201).json({success: true, data: newTask});
    } catch (error) {
        const message: string = error instanceof Error ? error.message : "An unexpected error occurred"
        res.status(404).json({success: false, error: message});
    }
}

export async function updateTask(req: Request<{ taskId: number }, {}, UpdatedTask>, res: Response): Promise<void> {
    try {
        const taskToUpdate: UpdatedTask = req.body;
        const updatedTask: Task = await taskService.update(req.params.taskId, taskToUpdate);
        res.status(200).json({success: true, data: updatedTask});
    } catch (error) {
        const message: string = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(404).json({success: false, error: message});
    }
}

export async function updateTaskStatus(req: Request<{ taskId: number }, {}, {status: 'TODO' | 'IN_PROGRESS' | 'DONE'} >, res: Response): Promise<void> {
    try {
        const {status} = req.body;
        const updatedTask: Task = await taskService.updateStatus(req.params.taskId, status);
        res.status(200).json({success: true, data: updatedTask});
    } catch (error) {
        const message: string = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(404).json({success: false, error: message});
    }
}

export async function deleteTask(req: Request<{taskId: number}>, res: Response): Promise<void> {
    try {
        await taskService.deleteTask(req.params.taskId);
        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        const message: string = error instanceof Error ? error.message : "An unexpected error occurred";
        res.status(404).json({success: false, error: message});
    }
}