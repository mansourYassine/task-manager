import type { Task } from "./types/task";
import type { CreateTaskSchema, UpdateTaskSchema } from "./validations/task.validation";

export async function getTasks(): Promise<Task[]>  {
    const data = await fetch('http://localhost:3000/api/tasks');
    const tasks = await data.json();
    return tasks.data;
}

export async function getTask(taskId: string): Promise<Task> {
    const data = await fetch(`http://localhost:3000/api/tasks/${taskId}`);
    const task = await data.json();
    return task.data;
}

export async function updateTaskStatus(taskId: number, status: string): Promise<Task> {
    const response = await fetch(
        `http://localhost:3000/api/tasks/${taskId}/status`,
        {
            method: "PATCH",
            body: JSON.stringify({status: status}),
            headers: {
                "Content-Type" : "application/json"
            }
        }
    );

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const task = await response.json();
    return task.data;
}

export async function deleteTask(taskId: number) {
    const response = await fetch(
        `http://localhost:3000/api/tasks/${taskId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error(`Failed to delete resource. Status: ${response.status}`)
    }
}

export async function updateTask(taskId: number, updateTask: UpdateTaskSchema) {
    const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateTask)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw data;
    }
}

export async function createNewTask(newTask: CreateTaskSchema) {
    const response = await fetch("http://localhost:3000/api/tasks", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw data;
    }
}