import { redirect } from "react-router";
import { getAccessToken, refresh, setAccessToken } from "../api";

export async function requireAuth(request: Request) {
    const pathName = new URL(request.url).pathname;
    if (!getAccessToken()) {
        try {
            const data = await refresh();
            setAccessToken(data.accessToken);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
            throw redirect(pathName === "/tasks" ? `/login` : `/login?redirectTo=${pathName}`);
        }
        throw redirect(`${pathName}`);
    }
}

export function makeFirstLetterUpperCase(noun: string) {
    return noun[0].toUpperCase() + noun.slice(1);
}