import { useState } from "react";
import { registerUserSchema } from "../validations/user.validation";
import { login, register, setAccessToken } from "../api";
import { Link, useNavigate } from "react-router";

export default function Register() {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        const result = registerUserSchema.safeParse(formData);

        if(!result.success) {
            const errors: Record<string, string> = {};
            result.error.issues.map(issue => ({
                field: issue.path.join('.'), 
                message: issue.message
            })).forEach(e => {
                if (typeof e.field === "string") {
                    errors[e.field] = e.message;
                }
            });
            setErrors(errors);
            return;
        }

        try {
            await register(result.data);
            const {accessToken} = await login({email: result.data.email, password: result.data.password});
            setAccessToken(accessToken);
            setErrors({});
            navigate('/tasks', {replace: true});
        } catch (error: unknown) {
            if (
                typeof error === 'object' &&
                error !== null &&
                "errors" in error &&
                Array.isArray(error.errors)
            ) {
                const errors: Record<string, string> = {};
                error.errors.forEach(e => {
                    if (typeof e.field === "string") {
                        errors[e.field] = e.message;
                    }
                });
                setErrors(errors);
            }
        }
    }

    return (
        <>
        <div className="mt-10 md:mt-50 flex flex-col items-center justify-center">
            <h1 className="font-bold text-3xl md:text-4xl text-custom-dark">Register</h1>
            <form method="post" onSubmit={handleSubmit} className="mt-7 w-full px-10 sm:px-0 sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-130">
                <div>
                    <label>
                        <span className="after:ml-0.5">Name</span>
                        <input type="text" name="name" placeholder="johndoe" className=" block mt-2 w-full border-2 rounded-md border-gray-300 px-4 py-2 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 " />
                    </label>
                    {errors['name'] && <p className=" text-red-500 text-sm ">{errors['name']}</p>}
                </div>
                <div className="mt-5">
                    <label>
                        <span className="after:ml-0.5">Email</span>
                        <input type="email" name="email" placeholder="johndoe@gmail.com" className=" block mt-2 w-full border-2 rounded-md border-gray-300 px-4 py-2 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 " />
                    </label>
                    {errors['email'] && <p className=" text-red-500 text-sm ">{errors['email']}</p>}
                </div>
                <div className="mt-5">
                    <label>
                        <span className="after:ml-0.5">Role</span>
                        <select name="role" className=" block mt-2 w-full border rounded-md border-gray-300 px-4 py-2 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 " >
                            <option value="admin">admin</option>
                            <option value="employee">employee</option>
                        </select>
                    </label>
                    {errors['role'] && <p className=" text-red-500 text-sm ">{errors['role']}</p>}
                </div>
                <div className="mt-5">
                    <label>
                        <span className="after:ml-0.5">Password</span>
                        <input type="password" name="password" placeholder="••••••••" className=" block mt-2 w-full border-2 rounded-md border-gray-300 px-4 py-2 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 " />
                    </label>
                    {errors['password'] && <p className=" text-red-500 text-sm ">{errors['password']}</p>}
                </div>
                <div className="mt-5 flex justify-center">
                    <button type="submit" className="cursor-pointer text-white font-bold bg-primary py-2 px-5.5 rounded-md">Register</button>
                </div>   
            </form>
            <Link to="/login" className="mt-3 text-blue-500 underline underline-offset-4">I already have an account</Link>
        </div>
        </>
    );
}
