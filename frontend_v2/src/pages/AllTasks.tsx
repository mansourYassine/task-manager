import { faArrowUpWideShort, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { differenceInCalendarDays, format, getYear, parseISO } from "date-fns";
import React, { useRef, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import { type Task } from "../types/task";
import { PRIORITY_THEME } from "../constants/customUIClasses";
import { logout, setAccessToken, updateTaskStatus } from "../api";
import { type User } from "../types/user";
import { makeFirstLetterUpperCase } from "../utils/helpers";
import { UnauthorizedError } from "../exceptions/exceptions";

function displayTaskDate(date: string) {
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
    const loaderData: {tasks: Task[], user: User} = useLoaderData();
    const [tasks, setTasks] = useState<Task[]>(loaderData.tasks);
    const originalTasks = useRef(tasks);
    const [user] = useState<User>(loaderData.user);
    const navigate = useNavigate();
    
    async function handleLogout() {
        await logout();
        setAccessToken(undefined);
        navigate('/login', {replace: true});
    }

    const statusThemeClasses = {
        TODO: " border-txtlow ",
        IN_PROGRESS: " bg-cstmbg-blue-badge text-primary border-brdblue ",
        DONE: " text-txtlow border-txtlow "
    };

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const searchWord = e.target.value;
        if (searchWord.length > 0) {
            setTasks(originalTasks.current);
            setTasks(prevTasks => {
                return prevTasks.filter(task => task.title.toLowerCase().includes(searchWord.toLowerCase()));
            });
        } else {
            setTasks(originalTasks.current);
        }
    }

    function handleFilterByPriority(e: React.ChangeEvent<HTMLSelectElement>) {
        const filterBy = e.target.value;
        setTasks(originalTasks.current);
        setTasks(prevTasks => {
            return prevTasks.filter(task => task.priority === filterBy);
        });
    }

    function handleFilterByStatus(e: React.ChangeEvent<HTMLSelectElement>) {
        const filterBy = e.target.value;
        setTasks(originalTasks.current);
        setTasks(prevTasks => {
            return prevTasks.filter(task => task.status === filterBy);
        });
    }

    function handleSorting() {
        setTasks(originalTasks.current);
        setTasks(prevTasks => {
            return prevTasks.toSorted((a, b) => {
                if (a.dueDate === null) {
                    return 1;
                }
                const dateA = new Date(a.dueDate);
                const dateB = new Date(b.dueDate);
                return dateA.getTime() - dateB.getTime();
            });
        });
    }

    async function updateStatus(e: React.ChangeEvent<HTMLSelectElement>, id: number) {
        const newStatus = e.target.value;
        try {
            const updatedTask = await updateTaskStatus(id, newStatus);
            setTasks((prevTasks) => {
                const updatedTasks = prevTasks.map((e) => e.id === updatedTask.id ? updatedTask : e);
                return updatedTasks;
            });
            return updatedTask;
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                navigate('/login');
            }
        }
    }

    const taskElements = tasks.map(task => {
        return (
            <div key={task.id} className=" flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center border-b border-[#d4d4d8] py-4 ">
                <Link to={`/tasks/${task.id}`} className="flex-1">
                    <p className={` font-semibold ${task.status === "DONE" ? "text-txtlow line-through" : "text-custom-dark"} `}>{task.title}</p>
                    {displayTaskDate(task.dueDate)}
                </Link>
                <div className=" flex items-center justify-between sm:gap-3   ">
                    <span className={` ${PRIORITY_THEME[task.priority]} text-[12px] font-medium py-1 px-2.5 rounded-md `}>{task.priority.split('').map((c, i) => i !== 0 ? c.toLowerCase() : c).join('')}</span>
                    <span className=" bg-cstmbg-blue-badge text-primary text-[12px] font-medium p-1 rounded-full border border-brdblue ">{task.createdByName.slice(0, 2).toUpperCase()}</span>
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
                <div className="flex items-center gap-10">
                    <h2 className=" font-bold text-3xl text-custom-dark ">Tasks List</h2>
                    <h3 className=" font-bold text-primary text-xl">Welcome {makeFirstLetterUpperCase(user.name)}</h3>
                </div>
                <div className=" flex items-center justify-between gap-2.5 ">
                    <div className=" hidden sm:flex items-center bg-cstmbg-secondary border border-[#d4d4d8] rounded-md py-2 ">
                        <FontAwesomeIcon className=" text-[#b6b6b6] px-2 text-sm " icon={faMagnifyingGlass} />
                        <input onChange={handleSearch} type="search" name="search-tasks" placeholder="Search tasks..." className=" text-sm outline-none " />
                    </div>
                    <button onClick={handleLogout} className="bg-red-600 text-white py-2 pl-5 pr-4 rounded-lg font-semibold cursor-pointer ">Logout</button>
                </div>
            </header>
            <section className=" py-1.5 px-4.5 sm:py-1.5 sm:px-5.5 lg:py-1.5 lg:px-7">
                <div className="flex gap-5 flex-col sm:flex-row py-3 border-b border-[#d4d4d8]">
                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-700">Filter by priority:</span>
                        <select 
                            onChange={handleFilterByPriority} 
                            name="status" 
                            className="text-[14px] font-medium py-1.5 px-2 border border-gray-400 rounded-md cursor-pointer focus:outline-none"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-700">Filter by status:</span>
                        <select 
                            onChange={handleFilterByStatus} 
                            name="status" 
                            className="text-[14px] font-medium py-1.5 px-2 border border-gray-400 rounded-md cursor-pointer focus:outline-none"
                        >
                            <option value="TODO">To do</option>
                            <option value="IN_PROGRESS">In progress</option>
                            <option value="DONE">Done</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-700">Sort by Due Date:</span>
                        <button onClick={handleSorting} className=" p-px w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md cursor-pointer ">
                            <FontAwesomeIcon className=" text-gray-500 px-2 text-sm " icon={faArrowUpWideShort} />
                        </button>
                    </div>
                    <button onClick={() => setTasks(originalTasks.current)} className="text-[14px] font-medium py-1.5 px-2 bg-gray-200 border border-gray-400 rounded-md cursor-pointer focus:outline-none">Clear</button>
                </div>
                <div>
                    {taskElements}
                </div>
                {user.role === "admin" && <Link to="create" className="fixed right-5 bottom-5 bg-primary text-white py-2 pl-5 pr-4 rounded-lg text-lg font-semibold ">+ New task</Link>}
            </section>
        </>
    )
}