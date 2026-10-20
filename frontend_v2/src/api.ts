import { ApiError } from "./exceptions/exceptions";
import type { Task } from "./types/task";
import type { CreateTaskSchema, UpdateTaskSchema } from "./validations/task.validation";

const BASE_URL = import.meta.env.VITE_API_URL;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
        headers: `{"Content-Type" : "application/json"}`
        // auth
    };
    const response = await fetch(BASE_URL + path, {...options, headers});

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new ApiError(response.status, errorResponse.message, errorResponse?.errors);
    }

    const data = await response.json();
    return data.data;
}

export async function getTasks(): Promise<Task[]>  {
    return await request<Task[]>('/api/tasks');
}

export async function getTask(taskId: string): Promise<Task> {
    return await request<Task>(`/api/tasks/${taskId}`);
}

export async function updateTaskStatus(taskId: number, status: string): Promise<Task> {
    return await request<Task>(`/api/tasks/${taskId}/status`, {
        method: "PATCH",
        body: JSON.stringify({status: status})
    });
}

export async function deleteTask(taskId: number) {
    await request<void>(`/api/tasks/${taskId}`, {
        method: "DELETE"
    });
}

export async function updateTask(taskId: number, updateTask: UpdateTaskSchema) {
    return await request<Task>(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({status: updateTask})
    });
}

export async function createNewTask(newTask: CreateTaskSchema) {    
    return await request<Task>(`/api/tasks`, {
        method: "POST",
        body: JSON.stringify(newTask)
    });
}