import type { LoaderFunctionArgs } from "react-router";
import { getTasks } from "../api";
import type { Task } from "../types/task";
import { requireAuth } from "../utils/helpers";

export default async function allTasksLoader({request}: LoaderFunctionArgs): Promise<Task[]> {
    await requireAuth(request);
    const tasks = await getTasks();
    return tasks;
}