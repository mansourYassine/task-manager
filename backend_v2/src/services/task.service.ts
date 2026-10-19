import * as taskRepository from "../repositories/task.repository.js";
import type { CreateTaskSchema, UpdateTaskSchema } from "../validations/task.validation.js";
import type { Task, TaskRow } from "../types/task.js";
import { mapTaskRowToTask } from "../utils/mapper/task.mapper.js";
import { NotFoundError } from "../exceptions/exceptions.js";
import type { User } from "../types/user.js";

export async function getAll(user: User): Promise<Task[]> {
    let tasks: TaskRow[];
    if (user.role === "admin") {
        tasks = await taskRepository.findAll();
    } else {
        tasks = await taskRepository.findAllForEmployee(user.id);
    }
    const responseTasks: Task[] = tasks.map(mapTaskRowToTask);

    return responseTasks;
}

export async function getById(taskId: number, user: User): Promise<Task> {
    let task: TaskRow | undefined;
    if (user.role === "admin") {
        task = await taskRepository.findById(taskId);
    } else {
        task = await taskRepository.findByIdForEmployee(taskId, user.id);
    }

    if (!task) {
        throw new NotFoundError(`Task with id ${taskId} not found!`);
    }

    const responseTask: Task = mapTaskRowToTask(task);

    return responseTask;
}

export async function store(taskToCreate: CreateTaskSchema): Promise<Task> {
    const newTaskId = await taskRepository.insert(taskToCreate);

    const newTask = await taskRepository.findById(newTaskId);

    if (!newTask) {
        throw new Error(`Task ${newTaskId} was inserted but could not be retrieved!`);
    }

    const responseTask: Task = mapTaskRowToTask(newTask);

    return responseTask;
}

export async function update(id: number, task: UpdateTaskSchema): Promise<Task> {
    await taskRepository.update(id, task);
    const updatedTask = await taskRepository.findById(id);
    if (!updatedTask) {
        throw new NotFoundError(`Task with id ${id} not found after update!`);
    }
    const responseTask: Task = mapTaskRowToTask(updatedTask);
    return responseTask;
}

export async function updateStatus(taskId: number, user: User, status: 'TODO' | 'IN_PROGRESS' | 'DONE'): Promise<Task> {
    let updatedTask: TaskRow | undefined;
    if (user.role === "admin") {
        await taskRepository.updateStatus(taskId, status);
        updatedTask = await taskRepository.findById(taskId);
    } else {
        await taskRepository.updateStatusForEmployee(taskId, user.id, status);
        updatedTask = await taskRepository.findByIdForEmployee(taskId, user.id);
    }
    
    if (!updatedTask) {
        throw new NotFoundError(`Task with id ${taskId} not found!`);
    }
    const responseTask: Task = mapTaskRowToTask(updatedTask);
    return responseTask;
}

export async function deleteTask(id: number): Promise<void> {
    const isTaskDeleted = await taskRepository.deleteTask(id);

    if (!isTaskDeleted) {
        throw new NotFoundError(`Task with id ${id} not found!`);
    }
}