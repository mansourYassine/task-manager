import type { LoaderFunctionArgs } from "react-router";
import { requireAuth } from "../utils/helpers";

export default async function createTaskLoader({request}: LoaderFunctionArgs) {
    await requireAuth(request);
}