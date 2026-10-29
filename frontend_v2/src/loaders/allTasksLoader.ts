import { redirect, type LoaderFunctionArgs } from "react-router";
import { getTasks, getUser } from "../api";
import type { Task } from "../types/task";
import { requireAuth } from "../utils/helpers";
import type { User } from "../types/user";
import { UnauthorizedError } from "../exceptions/exceptions";

export default async function allTasksLoader({request}: LoaderFunctionArgs): Promise<{tasks: Task[], user: User} | undefined> {
    await requireAuth(request);
    try {
        const tasks = await getTasks();
        const user = await getUser();
        return {tasks, user};
    } catch (error: unknown) {
        if (error instanceof UnauthorizedError) {
            throw redirect('/login');
        }
    }
}