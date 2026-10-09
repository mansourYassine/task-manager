import { useLoaderData } from "react-router";
import Header from "../components/Header";
import { useState } from "react";
import type { Task } from "../types/task";

export default function TaskDetails() {
    const loaderData = useLoaderData();
    const [task, setTask] = useState<Task>(loaderData);

    return (
        <>
            <Header />
        </>
    );
}