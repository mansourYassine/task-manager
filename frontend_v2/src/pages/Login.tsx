import { useState } from "react";
import { loginUserSchema } from "../validations/user.validation";
import { login, setAccessToken } from "../api";
import { useLoaderData, useNavigate } from "react-router";

export default function Login() {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const redirectTo: string = useLoaderData();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));
        const result = loginUserSchema.safeParse(formData);

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
            const res = await login(result.data);
            const accessToken = res.accessToken;
            setAccessToken(accessToken);
            setErrors({});
            navigate(redirectTo, {replace: true});
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
            <h1 className="font-bold text-3xl md:text-4xl text-custom-dark">Welcome Back</h1>
            <form method="post" onSubmit={handleSubmit} className="mt-7 w-full px-10 sm:px-0 sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-130">
                <div>
                    <label>
                        <span className="after:ml-0.5">Email</span>
                        <input type="email" name="email" placeholder="johndoe@gmail.com" className=" block mt-2 w-full border-2 rounded-md border-gray-300 px-4 py-2 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 " />
                    </label>
                    {errors['email'] && <p className=" text-red-500 text-sm ">{errors['email']}</p>}
                </div>
                <div className="mt-5">
                    <label>
                        <span className="after:ml-0.5">Password</span>
                        <input type="password" name="password" placeholder="••••••••" className=" block mt-2 w-full border-2 rounded-md border-gray-300 px-4 py-2 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 " />
                    </label>
                    {errors['password'] && <p className=" text-red-500 text-sm ">{errors['password']}</p>}
                </div>
                <div className="mt-5 flex justify-center">
                    <button type="submit" className="cursor-pointer text-white font-bold bg-primary py-2 px-5.5 rounded-md">Login</button>
                </div>   
            </form>
        </div>
        </>
    );
}
