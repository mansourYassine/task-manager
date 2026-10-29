import { redirect, type LoaderFunctionArgs } from "react-router";
import { getAccessToken, refresh, setAccessToken } from "../api";
// import { ApiError } from "../exceptions/exceptions";

export async function loginLoader({request}: LoaderFunctionArgs) {
    const redirectTo = new URL(request.url).searchParams.get('redirectTo') || 'tasks';
    if (getAccessToken()) {
        throw redirect(`/${redirectTo}`);
    } else {
        try {
            const data = await refresh();
            setAccessToken(data.accessToken);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
            return redirectTo;
        }
        throw redirect(`/${redirectTo}`);
    }
}