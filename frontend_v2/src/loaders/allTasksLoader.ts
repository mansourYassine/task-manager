import type { Task } from "../types/task";

export async function loader(): Promise<Task[]> {
    const data = await fetch('http://localhost:3000/api/tasks');
    const tasks = await data.json();
    return tasks.data;
}