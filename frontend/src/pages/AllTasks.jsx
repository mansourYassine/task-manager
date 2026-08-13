import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useLoaderData } from "react-router"

export async function loader() {
    const data = await fetch('http://localhost:8080/api/tasks');
    const tasks = await data.json();
    return tasks;
}

export default function AllTasks() {
    const tasks = useLoaderData();

    const priorityThemeClasses = {
        LOW: " bg-cstmbg-low-badge text-txtlow ",
        MEDIUM: " bg-cstmbg-meduim-badge text-txtmeduim ",
        HIGH: " bg-cstmbg-high-badge text-txthigh "
    };

    const taskElements = tasks.map( task => {
        return (
            <div key={task.id} className=" flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center border-b border-[#d4d4d8] py-4 ">
                <div>
                    <p className=" font-bold ">{task.title}</p>
                    <span className=" text-sm font-medium text-txthigh ">Due Tomorrow</span>
                </div>
                <div className=" flex items-center justify-between sm:gap-3   ">
                    <span className={` ${priorityThemeClasses[task.priority]} text-[12px] font-medium py-1 px-2.5 rounded-md `}>{task.priority.split('').map((c, i) => i !== 0 ? c.toLowerCase() : c).join('')}</span>
                    <span className=" bg-cstmbg-blue-badge text-primary text-[12px] font-medium p-1 rounded-full border border-brdblue ">{task.createdBy.slice(0, 2).toUpperCase()}</span>
                    <select name="status" className=" bg-cstmbg-blue-badge text-primary text-[12px] font-medium py-1.5 px-2 border border-brdblue rounded-md focus:outline-none appearance-none ">
                        {task.status === "TODO" ? <option value="TODO" selected>ToDo</option> : <option value="TODO">ToDo</option>}
                        {task.status === "IN_PROGRESS" ? <option value="IN_PROGRESS" selected>In progress</option> : <option value="IN_PROGRESS">In progress</option>}
                        {task.status === "DONE" ? <option value="DONE" selected>Done</option> : <option value="DONE">Done</option>}
                    </select>
                </div>
            </div>
        )
    })

    return (
        <>
            <header className=" flex justify-between py-4 px-4.5 sm:py-4.5 sm:px-5.5 lg:py-5 lg:px-7 border-b border-[#d4d4d8] ">
                <h2 className=" font-bold text-2xl text-custom-dark ">All tasks</h2>
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