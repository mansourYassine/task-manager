import type { LoaderFunctionArgs } from "react-router";
import { getTask, getUser } from "../api";
import { requireAuth } from "../utils/helpers";
import type { Task } from "../types/task";
import type { User } from "../types/user";

export default async function taskDetailsLoader({params, request}: LoaderFunctionArgs): Promise<{task: Task, user: User}> {
    const {taskId} = params as {taskId : string};
    await requireAuth(request);
    const task = await getTask(Number(taskId));
    const user = await getUser();
    return {task, user};
}