import { ApiError } from "./exceptions/exceptions";
import type { Task } from "./types/task";
import type { User } from "./types/user";
import type { CreateTaskSchema, UpdateTaskSchema } from "./validations/task.validation";
import type { LoginUserSchema } from "./validations/user.validation";

const BASE_URL = import.meta.env.VITE_API_URL;

let accessToken: string | undefined;

export function getAccessToken() {
    return accessToken;
}

export function setAccessToken(token: string) {
    accessToken = token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit  = {
        'Content-Type' : 'application/json',
        // auth
        'Authorization': `Bearer ${accessToken}`
    };
    const response = await fetch(BASE_URL + path, {headers, ...options, credentials: 'include'});

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new ApiError(response.status, errorResponse.message, errorResponse?.errors);
    }

    const data = await response.json();
    return data.data;
}

export async function login(user: LoginUserSchema) {
    return await request<{accessToken: string}>(`/auth/login`, {
        method: "POST",
        body: JSON.stringify(user)
    });
}

export async function refresh() {
    return await request<{accessToken: string}>(`/auth/refresh`, {
        method: "POST"
    });
}

export async function getUser(): Promise<User>  {
    return await request<User>('/auth/me');
}

export async function getUsers(): Promise<User[]>  {
    return await request<User[]>('/auth/users-info');
}

export async function getTasks(): Promise<Task[]>  {
    return await request<Task[]>('/api/tasks');
}

export async function getTask(taskId: number): Promise<Task> {
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
        body: JSON.stringify(updateTask)
    });
}

export async function createNewTask(newTask: CreateTaskSchema) {    
    return await request<Task>(`/api/tasks`, {
        method: "POST",
        body: JSON.stringify(newTask)
    });
}