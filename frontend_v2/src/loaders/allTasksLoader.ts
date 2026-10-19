import { getTasks } from "../api";
import type { Task } from "../types/task";

export default async function allTasksLoader(): Promise<Task[]> {
    const tasks = await getTasks();
    return tasks;
}