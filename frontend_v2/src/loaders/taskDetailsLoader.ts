import { redirect, type LoaderFunctionArgs } from "react-router";
import { getTask, getUser } from "../api";
import { requireAuth } from "../utils/helpers";
import type { Task } from "../types/task";
import type { User } from "../types/user";
import { ApiError, UnauthorizedError } from "../exceptions/exceptions";

export default async function taskDetailsLoader({params, request}: LoaderFunctionArgs): Promise<{task: Task, user: User} | undefined> {
    await requireAuth(request);
    try {
        const {taskId} = params as {taskId : string};
        const task = await getTask(Number(taskId));
        const user = await getUser();
        return {task, user};
    } catch (error: unknown) {
        if (error instanceof UnauthorizedError) {
            throw redirect('/login');
        }
        if (error instanceof ApiError) {
            if (error.status === 404) {
                throw redirect('/not-found');
            }
        }
    }
}