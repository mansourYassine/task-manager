import type { LoaderFunctionArgs } from "react-router";
import { getTask } from "../api";
import { requireAuth } from "../utils/helpers";

export default async function editTaskLoader({params, request}: LoaderFunctionArgs) {
    const {taskId} = params as {taskId : string};
    await requireAuth(request);
    const task = await getTask(Number(taskId));
    return task
}