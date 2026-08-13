import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router"

export default function AllTasks() {
    return (
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
    )
}