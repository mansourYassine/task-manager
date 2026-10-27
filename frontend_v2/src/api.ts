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

export function setAccessToken(token: string | undefined) {
    accessToken = token;
}

async function sendRequest(path: string, options: RequestInit = {}): Promise<Response> {
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
    
    return response;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await sendRequest(path, options);

    if (response.status === 204) {
        throw new Error("Expected a JSON response, but received 204 No Content.");
    }

    const data = await response.json();
    return data.data;
}

async function requestNoContent(path: string, options: RequestInit = {}): Promise<void> {
    await sendRequest(path, options);
}

export async function login(user: LoginUserSchema) {
    return await request<{accessToken: string}>(`/auth/login`, {
        method: "POST",
        body: JSON.stringify(user)
    });
}

export async function logout() {
    await requestNoContent(`/auth/logout`, {
        method: "POST",
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
    await requestNoContent(`/api/tasks/${taskId}`, {
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