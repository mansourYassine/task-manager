import { redirect } from "react-router";
import { getAccessToken, refresh, setAccessToken } from "../api";

export async function ParentTasksLoader() {
    if (!getAccessToken()) {
        const data = await refresh();
        console.log(`getAccessTokenLoader: ${data.accessToken}`);
        setAccessToken(data.accessToken);
        return redirect('/tasks');
    }
    // return redirect('/tasks/create');
}