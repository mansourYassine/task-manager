import type { Task } from "../types/task";

export default async function allTasksLoader(): Promise<Task[]> {
    const data = await fetch('http://localhost:3000/api/tasks');
    const tasks = await data.json();
    return tasks.data;
}