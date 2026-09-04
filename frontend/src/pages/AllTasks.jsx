import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { differenceInCalendarDays, format, getYear, parseISO } from "date-fns";
import { useState } from "react";
import { Link, useLoaderData } from "react-router"

export async function loader() {
    const data = await fetch('http://localhost:8080/api/tasks');
    const tasks = await data.json();
    return tasks;
}

function displayTaskDate(date) {
    if (!date) return "";

    const dueDate = parseISO(date);

    const diffInDays = differenceInCalendarDays(dueDate, new Date());

    if (diffInDays === 0) {
        return <span className=" text-[13px] text-txthigh font-medium ">Due today</span>;
    } else if (diffInDays === 1) {
        return <span className=" text-[13px] text-txtlow font-medium ">Due tomorrow</span>;
    } else if (diffInDays === -1) {
        return <span className=" text-[13px] text-txtlow font-medium ">Due yesterday</span>;
    } else {
        return <span className=" text-[13px] text-txtlow font-medium ">{`Due ${getYear(dueDate) === getYear(new Date()) ? format(dueDate, 'MMMM d') : format(dueDate, 'MMMM d, yyyy') }`}</span>;
    }
}

export default function AllTasks() {
    const loaderData = useLoaderData();
    
    const [tasks, setTasks] = useState(loaderData);
    
    const priorityThemeClasses = {
        LOW: " bg-cstmbg-low-badge text-txtlow ",
        MEDIUM: " bg-cstmbg-meduim-badge text-txtmeduim ",
        HIGH: " bg-cstmbg-high-badge text-txthigh "
    };
    
    const statusThemeClasses = {
        TODO: " border-txtlow ",
        IN_PROGRESS: " bg-cstmbg-blue-badge text-primary border-brdblue ",
        DONE: " text-txtlow border-txtlow "
    };
    
    async function updateStatus(e, id) {
        const newStatus = e.target.value;
        try {
            const response = await fetch(
                `http://localhost:8080/api/tasks/${id}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({status: newStatus}),
                    headers: {
                        "Content-Type" : "application/json"
                    }
                }
            )
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            setTasks((prevTasks) => {
                const updatedTasks = prevTasks.map((e) => e.id === data.id ? data : e);
                return updatedTasks;
            });
            return data;
        } catch (error) {
            console.log(`Failed to patch data: ${error.message}`);
        }
    }

    const taskElements = tasks.map(task => {
        return (
            <div key={task.id} className=" flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center border-b border-[#d4d4d8] py-4 ">
                <div>
                    <p className={` font-semibold ${task.status === "DONE" ? "text-txtlow line-through" : "text-custom-dark"} `}>{task.title}</p>
                    {displayTaskDate(task.dueDate)}
                </div>
                <div className=" flex items-center justify-between sm:gap-3   ">
                    <span className={` ${priorityThemeClasses[task.priority]} text-[12px] font-medium py-1 px-2.5 rounded-md `}>{task.priority.split('').map((c, i) => i !== 0 ? c.toLowerCase() : c).join('')}</span>
                    <span className=" bg-cstmbg-blue-badge text-primary text-[12px] font-medium p-1 rounded-full border border-brdblue ">{task.createdBy.slice(0, 2).toUpperCase()}</span>
                    <select 
                        onChange={(e) => {
                            updateStatus(e, task.id)
                        }} 
                        name="status" 
                        defaultValue={task.status} 
                        className={`${statusThemeClasses[task.status]} text-[12px] font-medium py-1.5 px-2 border rounded-md focus:outline-none appearance-none`}
                    >
                        <option value="TODO">To do</option>
                        <option value="IN_PROGRESS">In progress</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>
            </div>
        )
    });

    return (
        <>
            <header className=" flex justify-between py-4 px-4.5 sm:py-4.5 sm:px-5.5 lg:py-5 lg:px-7 border-b border-[#d4d4d8] ">
                <h2 className=" font-bold text-3xl text-custom-dark ">All tasks</h2>
                <div className=" flex items-center justify-between gap-2.5 ">
                    <div className=" hidden sm:flex items-center bg-cstmbg-secondary border border-[#d4d4d8] rounded-md py-2 ">
                        <FontAwesomeIcon className=" text-[#b6b6b6] px-2 text-sm " icon={faMagnifyingGlass} />
                        <input type="search" name="search-tasks" placeholder="Search tasks..." className=" text-sm outline-none " />
                    </div>
                    <Link to="create" className=" bg-primary text-white py-2 pl-5 pr-4 rounded-lg text-sm font-medium ">+ New task</Link>
                </div>
            </header>
            <section className=" py-1.5 px-4.5 sm:py-1.5 sm:px-5.5 lg:py-1.5 lg:px-7 ">
                <div>
                    {taskElements}
                </div>
            </section>
        </>
    )
}