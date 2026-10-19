import type { LoaderFunctionArgs } from "react-router";
import { getTask } from "../api";

export default async function editTaskLoader({params}: LoaderFunctionArgs) {
    const {taskId} = params as {taskId : string};
    const task = await getTask(taskId);
    return task
}