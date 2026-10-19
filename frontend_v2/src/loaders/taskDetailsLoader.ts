import type { LoaderFunctionArgs } from "react-router";
import { getTask } from "../api";

export default async function taskDetailsLoader({params}: LoaderFunctionArgs) {
    const {taskId} = params as {taskId : string};
    const task = await getTask(taskId);
    return task;
}