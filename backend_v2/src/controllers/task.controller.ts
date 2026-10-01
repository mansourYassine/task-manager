import { pool } from "../config/db.js";
import { type Request, type Response } from 'express';
import type { CreateTask, Task, TaskRow, UpdatedTask } from "../types/task.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { isTaskExists } from "../repositories/task.repository.js";
import { mapTaskRowToTask } from "../utils/mapper/task.mapper.js";
import * as taskService from "../services/task.service.js";
import type { CreateTaskSchema, TaskParamsSchema, UpdateStatusSchema, UpdateTaskSchema } from "../validations/task.validation.js";
import { NotFoundError } from "../exceptions/exceptions.js";

export async function getAllTasks(req: Request, res: Response): Promise<void> {
    const allTasks = await taskService.getAll();
    res.status(200).json({success: true, data: allTasks});
}

export async function getTaskById(req: Request<TaskParamsSchema>, res: Response): Promise<void> {
    const taskId = Number(req.params.taskId);
    const task = await taskService.getById(taskId);
    res.status(200).json({success: true, data: task});
}

export async function createTask(req: Request<{}, {}, CreateTaskSchema>, res: Response): Promise<void> {
    const taskToCreate: CreateTaskSchema = req.body;
    const newTask = await taskService.store(taskToCreate);
    res.status(201).json({success: true, data: newTask});
}

export async function updateTask(req: Request<TaskParamsSchema, {}, UpdateTaskSchema>, res: Response): Promise<void> {
    const taskToUpdate: UpdatedTask = req.body;
    const taskId = Number(req.params.taskId);
    const updatedTask: Task = await taskService.update(taskId, taskToUpdate);
    res.status(200).json({success: true, data: updatedTask});
}

export async function updateTaskStatus(req: Request<TaskParamsSchema, {}, UpdateStatusSchema >, res: Response): Promise<void> {
    const {status} = req.body;
    const taskId = Number(req.params.taskId);
    const updatedTask: Task = await taskService.updateStatus(taskId, status);
    res.status(200).json({success: true, data: updatedTask});
}

export async function deleteTask(req: Request<TaskParamsSchema>, res: Response): Promise<void> {
    const taskId = Number(req.params.taskId);
    await taskService.deleteTask(taskId);
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
}