import { Outlet } from "react-router";

export default function Layout() {
    return (
        <div className=" min-h-screen font-[Inter] ">
            <main>
                <Outlet />
            </main>
        </div>
    )
}