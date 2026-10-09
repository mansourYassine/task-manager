import type { LoaderFunctionArgs } from "react-router";

export default async function taskDetailsLoaders({params}: LoaderFunctionArgs) {
    const {taskId} = params as {taskId : string};
    const data = await fetch(`http://localhost:3000/api/tasks/${taskId}`);
    const task = await data.json();
    return task.data;
}