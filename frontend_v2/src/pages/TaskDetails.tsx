import { useLoaderData } from "react-router";
import Header from "../components/Header";
import { useState } from "react";
import type { Task } from "../types/task";

export default function TaskDetails() {
    const loaderData = useLoaderData();
    const [task, setTask] = useState<Task>(loaderData);

    async function updateStatus(
        e: React.ChangeEvent<HTMLInputElement>,
        id: number,
    ) {
        const newStatus = e.target.value;
        try {
            const response = await fetch(
                `http://localhost:3000/api/tasks/${id}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status: newStatus }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const updatedTask = data.data;
            setTask(updatedTask);
            return data;
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Failed to patch data: ${error.message}`);
            }
        }
    }

    return (
        <>
            <Header />
            <main className=" pt-7 px-4.5 sm:px-5.5 lg:px-7 ">
                <h1 className=" text-2xl font-bold text-custom-dark ">
                    {task.title}
                </h1>
                <div className=" mt-5 flex justify-between sm:items-center flex-col sm:flex-row gap-2 sm:w-150 px-5 py-3.5 rounded-md border border-gray-200 bg-gray-100 ">
                    <span className="text-sm font-medium text-gray-600">
                        Status
                    </span>
                    <div className=" flex gap-2 sm:w-87.5 ">
                        <input
                            type="radio"
                            name="priority"
                            id="todo"
                            value={"TODO"}
                            className=" peer/todo sr-only "
                            checked={task.status === "TODO"}
                            onChange={(e) => {
                                updateStatus(e, task.id);
                            }}
                        />
                        <label
                            htmlFor="todo"
                            className=" flex justify-center items-center flex-1 text-center bg-white text-gray-500 font-medium cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm transition-colors peer-checked/todo:border-primary peer-checked/todo:bg-cstmbg-blue-badge peer-checked/todo:text-primary peer-focus-visible/todo:ring-2 peer-focus-visible/todo:ring-primary/40 "
                        >
                            Todo
                        </label>

                        <input
                            type="radio"
                            name="priority"
                            id="in-progress"
                            value={"IN_PROGRESS"}
                            className=" peer/in-progress sr-only "
                            checked={task.status === "IN_PROGRESS"}
                            onChange={(e) => {
                                updateStatus(e, task.id);
                            }}
                        />
                        <label
                            htmlFor="in-progress"
                            className=" flex justify-center items-center flex-1 text-center bg-white text-gray-500 font-medium cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm transition-colors peer-checked/in-progress:border-primary peer-checked/in-progress:bg-cstmbg-blue-badge peer-checked/in-progress:text-primary peer-focus-visible/in-progress:ring-2 peer-focus-visible/in-progress:ring-primary/40 "
                        >
                            In Progress
                        </label>

                        <input
                            type="radio"
                            name="priority"
                            id="done"
                            value={"DONE"}
                            className=" peer/done sr-only "
                            checked={task.status === "DONE"}
                            onChange={(e) => {
                                updateStatus(e, task.id);
                            }}
                        />
                        <label
                            htmlFor="done"
                            className=" flex justify-center items-center flex-1 text-center bg-white text-gray-500 font-medium cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm transition-colors peer-checked/done:border-primary peer-checked/done:bg-cstmbg-blue-badge peer-checked/done:text-primary peer-focus-visible/done:ring-2 peer-focus-visible/done:ring-primary/40 "
                        >
                            Done
                        </label>
                    </div>
                </div>
            </main>
        </>
    );
}
