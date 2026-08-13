import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router"

export default function AllTasks() {
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
                    <div className=" flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center border-b border-[#d4d4d8] py-4 ">
                        <div>
                            <p className=" font-bold ">Fix dirty-checking bug on PATCH/status</p>
                            <span className=" text-sm font-medium text-txthigh ">Due Tomorrow</span>
                        </div>
                        <div className=" flex items-center justify-between sm:gap-3   ">
                            <span className=" bg-cstmbg-high-badge text-txthigh text-[12px] font-medium py-1 px-2.5 rounded-md ">High</span>
                            <span className=" bg-cstmbg-blue-badge text-primary text-[12px] font-medium p-1 rounded-full border border-brdblue ">YM</span>
                            <select name="status" className=" bg-cstmbg-blue-badge text-primary text-[12px] font-medium py-1.5 px-2 border border-brdblue rounded-md focus:outline-none appearance-none ">
                                <option value="TODO">ToDo</option>
                                <option value="IN_PROGRESS">In progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}