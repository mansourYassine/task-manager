import { redirect, type LoaderFunctionArgs } from "react-router";
import { getTask, getUser, getUsers } from "../api";
import { requireAuth } from "../utils/helpers";
import { UnauthorizedError } from "../exceptions/exceptions";

export default async function editTaskLoader({params, request}: LoaderFunctionArgs) {
    await requireAuth(request);
    const {taskId} = params as {taskId : string};
    try {
        const user = await getUser();
        if (user.role === "employee") {
            return redirect('/not-found');
        }
        const users = await getUsers();
        const task = await getTask(Number(taskId));
        return {task, users};
    } catch (error: unknown) {
        if (error instanceof UnauthorizedError) {
            throw redirect(`/login?redirectTo=tasks/${taskId}/edit`);
        }
    }
}