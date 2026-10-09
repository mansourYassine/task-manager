import { useLoaderData } from "react-router";
import Header from "../components/Header";
import { useState } from "react";
import type { Task } from "../types/task";

export default function EditTask() {
    const loaderData = useLoaderData();
    const [task, setTask] = useState<Task>(loaderData);
    
    return (
        <>
            <Header />
            <main className=" pt-7 px-4.5 sm:px-5.5 lg:px-7 ">
                <h1 className=" text-2xl font-bold text-custom-dark ">Edit task</h1>
            </main>
        </>
    );
}
