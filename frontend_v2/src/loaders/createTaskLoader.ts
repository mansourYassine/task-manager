import { redirect, type LoaderFunctionArgs } from "react-router";
import { requireAuth } from "../utils/helpers";
import { getUser, getUsers } from "../api";
import { UnauthorizedError } from "../exceptions/exceptions";

export default async function createTaskLoader({request}: LoaderFunctionArgs) {
    await requireAuth(request);
    try {
        const user = await getUser();
        if (user.role === "employee") {
            return redirect('/not-found');
        }
        const users = getUsers();
        return users;
    } catch (error: unknown) {
        if (error instanceof UnauthorizedError) {
            throw redirect('/login');
        }
    }
}