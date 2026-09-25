import * as taskRepository from "../repositories/task.repository.js";
import type { CreateTask, Task, TaskRow, UpdatedTask } from "../types/task.js";
import { mapTaskRowToTask } from "../utils/mapper/task.mapper.js";

export async function getAll(): Promise<Task[]> {
    const tasks: TaskRow[] = await taskRepository.findAll();
    const responseTasks: Task[] = tasks.map(mapTaskRowToTask);

    return responseTasks;
}

export async function getById(id: string): Promise<Task> {
    const task = await taskRepository.findById(id);

    if (!task) {
        throw new Error(`Task with id ${id} not found!`);
    }

    const responseTask: Task = mapTaskRowToTask(task);

    return responseTask;
}

export async function store(taskToCreate: CreateTask): Promise<Task> {
    const newTaskId = await taskRepository.insert(taskToCreate);

    const newTask = await taskRepository.findById(newTaskId);

    if (!newTask) {
        throw new Error(`Task was not created, due to error!`);
    }

    const responseTask: Task = mapTaskRowToTask(newTask);

    return responseTask;
}

export async function update(id: number, task: UpdatedTask): Promise<Task> {
    const taskExist: boolean = await taskRepository.isTaskExists(id);

    if (!taskExist) {
        throw new Error("Task doesn't exist in the database!")
    }

    const isTaskUpdated = await taskRepository.update(id, task);

    if (!isTaskUpdated) {
        throw new Error("Task was not updated!");
    }

    const updatedTask = await taskRepository.findById(id) as TaskRow;
    const responseTask: Task = mapTaskRowToTask(updatedTask);
    return responseTask;
}

export async function updateStatus(id: number, status: 'TODO' | 'IN_PROGRESS' | 'DONE'): Promise<Task> {
    const taskExist: boolean = await taskRepository.isTaskExists(id);

    if (!taskExist) {
        throw new Error("Task doesn't exist in the database!")
    }

    const isTaskUpdated = await taskRepository.updateStatus(id, status);

    if (!isTaskUpdated) {
        throw new Error("Task's status was not updated!");
    }

    const updatedTask = await taskRepository.findById(id) as TaskRow;
    const responseTask: Task = mapTaskRowToTask(updatedTask);
    return responseTask;
}

export async function deleteTask(id: number): Promise<boolean> {
    const taskExist: boolean = await taskRepository.isTaskExists(id);

    if (!taskExist) {
        throw new Error("Task doesn't exist in the database!")
    }

    const isTaskDeleted = await taskRepository.deleteTask(id);

    if (!isTaskDeleted) {
        throw new Error("Deleting task failed!");
    }

    return isTaskDeleted;
}