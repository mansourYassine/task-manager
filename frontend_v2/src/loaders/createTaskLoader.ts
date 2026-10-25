import { redirect, type LoaderFunctionArgs } from "react-router";
import { requireAuth } from "../utils/helpers";
import { getUser } from "../api";

export default async function createTaskLoader({request}: LoaderFunctionArgs) {
    const user = await getUser();
    if (user.role === "employee") {
        throw redirect('/not-found');
    }
    await requireAuth(request);
}