import * as taskRepository from "../repositories/task.repository.js";
import type { CreateTaskSchema, UpdateTaskSchema } from "../validations/task.validation.js";
import type { Task, TaskRow, UpdatedTask } from "../types/task.js";
import { mapTaskRowToTask } from "../utils/mapper/task.mapper.js";
import { NotFoundError } from "../exceptions/exceptions.js";

export async function getAll(): Promise<Task[]> {
    const tasks: TaskRow[] = await taskRepository.findAll();
    const responseTasks: Task[] = tasks.map(mapTaskRowToTask);

    return responseTasks;
}

export async function getById(id: number): Promise<Task> {
    const task = await taskRepository.findById(id);

    if (!task) {
        throw new NotFoundError(`Task with id ${id} not found!`);
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

export async function updateStatus(id: number, status: 'TODO' | 'IN_PROGRESS' | 'DONE'): Promise<Task> {
    await taskRepository.updateStatus(id, status);
    const updatedTask = await taskRepository.findById(id);
    if (!updatedTask) {
        throw new NotFoundError(`Task with id ${id} not found!`);
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