import type { LoaderFunctionArgs } from "react-router";
import { getTasks, getUser } from "../api";
import type { Task } from "../types/task";
import { requireAuth } from "../utils/helpers";
import type { User } from "../types/user";

export default async function allTasksLoader({request}: LoaderFunctionArgs): Promise<{tasks: Task[], user: User}> {
    await requireAuth(request);
    const tasks = await getTasks();
    const user = await getUser();
    return {tasks, user};
}