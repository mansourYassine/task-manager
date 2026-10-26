import type { LoaderFunctionArgs } from "react-router";
import { requireAuth } from "../utils/helpers";

export async function parentTasksLoader({request}: LoaderFunctionArgs) {
    await requireAuth(request);
}