import { faArrowUpWideShort, faCircleUser, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { differenceInCalendarDays, format, getYear, parseISO } from "date-fns";
import React, { useState } from "react";
import { Link, useLoaderData, useNavigate, useSearchParams } from "react-router";
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
    const [user] = useState<User>(loaderData.user);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('q');
    const filterPriority = searchParams.get('priority');
    const filterStatus = searchParams.get('status');
    const sort = searchParams.get('sort');
    
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
        setSearchParams(prevSp => {
            if (searchWord.length > 0) {
                prevSp.set('q', searchWord);
            } else {
                prevSp.delete('q');
            }
            return prevSp;
        });
    }
    
    function handleFilterByPriority(e: React.ChangeEvent<HTMLSelectElement>) {
        const filterPriorityBy = e.target.value;
        setSearchParams(prevSp => {
            prevSp.set('priority', filterPriorityBy);
            return prevSp;
        });
    }

    function handleFilterByStatus(e: React.ChangeEvent<HTMLSelectElement>) {
        const filterStatusBy = e.target.value;
        setSearchParams(prevSp => {
            prevSp.set('status', filterStatusBy);
            return prevSp;
        });
    }

    function handleSorting() {
        setSearchParams(prevSp => {
            prevSp.set('sort', '1');
            return prevSp;
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

    function makeTaskElements(tasks: Task[]) {
        return (tasks.map(task => {
            return (
                <div key={task.id} className=" flex flex-col gap-0.5 sm:gap-3 sm:flex-row sm:justify-between sm:items-center border-b border-[#d4d4d8] py-1.5 sm:py-2 ">
                    <Link to={`/tasks/${task.id}`} state={{search: `?${searchParams.toString()}`}} className="flex-1 flex flex-col justify-center min-h-12">
                        <p className={` font-semibold ${task.status === "DONE" ? "text-txtlow line-through" : "text-custom-dark"} `}>{task.title}</p>
                        {displayTaskDate(task.dueDate)}
                    </Link>
                    <div className=" flex items-center justify-between sm:gap-3">
                        <span className={` ${PRIORITY_THEME[task.priority]} w-16.75 flex justify-center items-center text-[12px] font-medium py-1 px-2.5 rounded-md `}>{task.priority.split('').map((c, i) => i !== 0 ? c.toLowerCase() : c).join('')}</span>
                        <span className=" bg-cstmbg-blue-badge text-primary text-[12px] font-medium p-1 rounded-full border border-brdblue ">{task.createdByName.slice(0, 2).toUpperCase()}</span>
                        <select 
                            onChange={(e) => {
                                updateStatus(e, task.id)
                            }} 
                            name="status" 
                            defaultValue={task.status} 
                            className={`${statusThemeClasses[task.status]} text-[12px] font-medium py-1.5 px-2 border rounded-md focus:outline-none appearance-none cursor-pointer`}
                        >
                            <option value="TODO">To do</option>
                            <option value="IN_PROGRESS">In progress</option>
                            <option value="DONE">Done</option>
                        </select>
                    </div>
                </div>
            );
        }));
    }

    const taskElements = () => {
        if (search) {
            const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()));
            return makeTaskElements(filteredTasks);
        }
        if (filterPriority && filterStatus) {
            const filteredTasks = tasks.filter(task => task.priority === filterPriority && task.status === filterStatus);
            return makeTaskElements(filteredTasks);
        } else {
            if (filterPriority) {
                const filteredTasks = tasks.filter(task => task.priority === filterPriority);
                return makeTaskElements(filteredTasks);
            }
            if (filterStatus) {
                const filteredTasks = tasks.filter(task => task.status === filterStatus);
                return makeTaskElements(filteredTasks);
            }
        }
        if (sort) {
            const filteredTasks = tasks.toSorted((a, b) => {
                if (a.dueDate === null) {
                    return 1;
                }
                const dateA = new Date(a.dueDate);
                const dateB = new Date(b.dueDate);
                return dateA.getTime() - dateB.getTime();
            });
            return makeTaskElements(filteredTasks);
        }
        return makeTaskElements(tasks);
    }

    return (
        <>
            <header className=" py-3 px-4.5 sm:py-4.5 sm:px-5.5 lg:py-5 lg:px-7 border-b border-[#d4d4d8] ">
                <div className="flex justify-between items-center">
                    <h2 className=" font-bold text-2xl sm:text-3xl text-custom-dark ">Task Manager</h2>
                    <div className=" flex flex-col sm:flex-row items-center justify-between gap-2.5 ">
                        <div className=" hidden sm:flex items-center bg-cstmbg-secondary border border-[#d4d4d8] rounded-md py-2 ">
                            <FontAwesomeIcon className=" text-[#b6b6b6] px-2 text-sm " icon={faMagnifyingGlass} />
                            <input onChange={handleSearch} type="search" name="search-tasks" placeholder="Search tasks..." className=" text-sm outline-none " />
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faCircleUser} className="text-primary text-2xl" />
                            <h3 className=" font-bold text-primary">{makeFirstLetterUpperCase(user.name)}</h3>
                        </div>
                        <button onClick={handleLogout} className="bg-red-600 text-white py-1 px-2 sm:py-2 sm:pl-5 sm:pr-4 rounded-lg font-medium cursor-pointer ">Logout</button>
                    </div>
                </div>
                <div className="sm:hidden mt-2 bg-cstmbg-secondary border border-[#d4d4d8] rounded-md py-1 ">
                    <FontAwesomeIcon className=" text-[#b6b6b6] px-2 text-sm " icon={faMagnifyingGlass} />
                    <input onChange={handleSearch} type="search" name="search-tasks" placeholder="Search tasks..." className=" text-sm outline-none " />
                </div>
            </header>
            <section className=" sm:w-180 sm:mx-auto relative py-1.5 px-4.5 sm:py-1.5 sm:px-5.5 lg:py-1.5 lg:px-7">
                <div className=" flex justify-between py-2 sm:py-3 border-b border-[#d4d4d8]">
                    <div className="flex gap-2 sm:gap-5 items-center">
                        <span className="font-semibold text-sm text-gray-700 hidden sm:inline">Filter by:</span>
                        <div>
                            <select 
                                onChange={handleFilterByPriority} 
                                name="status"
                                value={filterPriority ? filterPriority : ""}
                                className="text-[14px] font-medium py-1.5 px-2 border border-gray-400 rounded-md cursor-pointer focus:outline-none"
                            >
                                <option value="" disabled hidden>Priority</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <div>
                            <select 
                                onChange={handleFilterByStatus} 
                                name="status"
                                value={filterStatus ? filterStatus : ""}
                                className="text-[14px] font-medium py-1.5 px-2 border border-gray-400 rounded-md cursor-pointer focus:outline-none"
                            >
                                <option value="" disabled hidden>Status</option>
                                <option value="TODO">To do</option>
                                <option value="IN_PROGRESS">In progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-sm text-gray-700 hidden sm:inline">Sort:</span>
                            <button onClick={handleSorting} className=" p-px w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md cursor-pointer ">
                                <FontAwesomeIcon className=" text-gray-500 px-2 text-sm " icon={faArrowUpWideShort} />
                            </button>
                        </div>
                        {searchParams.size > 0 && <button onClick={() => setSearchParams(undefined)} className="text-[14px] font-medium py-1.5 px-2 bg-gray-200 border border-gray-400 rounded-md cursor-pointer focus:outline-none">Clear</button>}
                    </div>
                    {user.role === "admin" && <Link to="create" className="hidden bg-primary text-white py-1 pl-2 pr-2.5 rounded-lg sm:flex justify-center items-center ">+ New task</Link>}
                </div>
                <div>
                    {taskElements()}
                </div>
                {user.role === "admin" && <Link to="create" className="fixed right-5 bottom-5 sm:hidden bg-primary w-14 h-14 rounded-2xl flex justify-center items-center ">
                    <FontAwesomeIcon icon={faPlus} className="text-xl text-white" />
                </Link>}
            </section>
        </>
    )
}