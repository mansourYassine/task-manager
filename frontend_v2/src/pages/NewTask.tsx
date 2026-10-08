import { Link, Navigate, useNavigate } from "react-router";
import BackButton from "../components/BackButton";
import { useState } from "react";
import type { Task } from "../types/task";

export default function NewTask() {
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));

        if (formData.dueDate === "") {
            delete formData.dueDate;
        }

        if (formData.description === "") {
            delete formData.description;
        }

        if (formData.assignedTo === "") {
            delete formData.assignedTo;
        }

        console.log(formData);

        try {
            const response = await fetch("http://localhost:3000/api/tasks", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data : {success: boolean, errors: {field: string, message: string}[]} = await response.json();
            if (!response.ok) {
                throw data;
            }

            setErrors({});
            navigate('/', {replace: true});
        } catch (error) {
            let errors = {};
            error.errors.forEach(e => {
                errors[e.field] = e.message;
            });
            setErrors(errors);
        }
        
    }

    return (
        <>
            <header className=" flex justify-between py-4 px-4.5 sm:py-4.5 sm:px-5.5 lg:py-5 lg:px-7 border-b border-[#d4d4d8] ">
                <BackButton />
            </header>
            <main className=" pt-7 px-4.5 sm:px-5.5 lg:px-7 ">
                <h1 className=" text-2xl font-bold text-custom-dark ">Create task</h1>
                <form method="post" onSubmit={handleSubmit} className=" mt-7 sm:w-[60%] lg:w-[50%] ">
                    <div>
                        <label>
                            <span className=" after:ml-0.5 after:text-red-500 after:content-['*'] ">Title</span>
                            <input type="text" name="title" placeholder="e.g. Add pagination to task list endpoint" className=" block mt-2 w-full border border-dashed rounded-md border-gray-300 px-4 py-2 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 " />
                        </label>
                        {errors['title'] && <p className=" text-red-500 text-sm ">{errors['title']}</p>}
                    </div>
                    <div className=" mt-4 ">
                        <label>
                            <span>Description</span>
                            <textarea name="description" placeholder="Add any context, acceptance criteria, or notes..." className=" block mt-2 w-full border border-dashed rounded-md border-gray-300 px-4 py-2 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 "></textarea>
                        </label>
                        {errors['description'] && <p className=" text-red-500 text-sm ">{errors['description']}</p>}
                    </div>
                    <div className=" mt-4 flex flex-col gap-4 sm:gap-3 sm:flex-row ">
                        <div className=" flex-1 ">
                            <label>
                                <span>Due date</span>
                                <input type="date" name="dueDate" className=" block mt-2 w-full border border-dashed rounded-md border-gray-300 px-4 py-2 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 " />
                            </label>
                            {errors['dueDate'] && <p className=" text-red-500 text-sm ">{errors['dueDate']}</p>}
                        </div>
                        <div className=" flex-1 ">
                            <label>
                                <span>Assigned to</span>
                                <select name="assignedTo" className=" block mt-2 w-full border rounded-md border-gray-300 px-4 py-2 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 " >
                                    <option value="Yassine">Yassine</option>
                                    <option value="Ayoub">Ayoub</option>
                                    <option value="Kamal">Kamal</option>
                                </select>
                            </label>
                            {errors['assignedTo'] && <p className=" text-red-500 text-sm ">{errors['assignedTo']}</p>}
                        </div>
                    </div>
                    <div className=" mt-4 mb-6 ">
                        <span className=" after:ml-0.5 after:text-red-500 after:content-['*'] ">Priority</span>
                        <div className=" mt-2 flex gap-2 ">
                            <input type="radio" name="priority" id="low" value={"LOW"} className=" peer/low sr-only " />
                            <label htmlFor="low" className=" flex-1 text-center text-gray-500 font-medium cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm transition-colors peer-checked/low:border-primary peer-checked/low:bg-cstmbg-blue-badge peer-checked/low:text-primary peer-focus-visible/low:ring-2 peer-focus-visible/low:ring-primary/40 ">Low</label>

                            <input type="radio" name="priority" id="medium" value={"MEDIUM"} className=" peer/medium sr-only " />
                            <label htmlFor="medium" className=" flex-1 text-center text-gray-500 font-medium cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm transition-colors peer-checked/medium:border-primary peer-checked/medium:bg-cstmbg-blue-badge peer-checked/medium:text-primary peer-focus-visible/medium:ring-2 peer-focus-visible/medium:ring-primary/40 ">Medium</label>

                            <input type="radio" name="priority" id="high" value={"HIGH"} className=" peer/high sr-only " />
                            <label htmlFor="high" className=" flex-1 text-center text-gray-500 font-medium cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm transition-colors peer-checked/high:border-primary peer-checked/high:bg-cstmbg-blue-badge peer-checked/high:text-primary peer-focus-visible/high:ring-2 peer-focus-visible/high:ring-primary/40 ">High</label>
                        </div>
                        {errors['priority'] && <p className=" text-red-500 text-sm ">{errors['priority']}</p>}
                    </div>
                    <hr className=" border-0 h-px w-full bg-gray-300 " />
                    <div className=" mt-6 flex gap-4 ">
                        <button type="submit" className=" cursor-pointer text-white bg-primary py-2 px-3.5 rounded-md ">Create task</button>
                        <Link to={"/"} className=" text-gray-500 bg-white border border-gray-300 py-2 px-3.5 rounded-md ">Cancel</Link>
                    </div>
                    
                </form>
            </main>
        </>
    )
}