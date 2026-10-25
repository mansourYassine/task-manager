import { redirect, type LoaderFunctionArgs } from "react-router";
import { getTask, getUser } from "../api";
import { requireAuth } from "../utils/helpers";

export default async function editTaskLoader({params, request}: LoaderFunctionArgs) {
    const user = await getUser();
    if (user.role === "employee") {
        throw redirect('/not-found');
    }
    const {taskId} = params as {taskId : string};
    await requireAuth(request);
    const task = await getTask(Number(taskId));
    return task
}