import type React from "react";
import BackButton from "./BackButton";

export default function Header({children} : {children?: React.ReactNode}) {
    return (
        <header className=" flex justify-between py-4 px-4.5 sm:py-4.5 sm:px-5.5 lg:py-5 lg:px-7 border-b border-[#d4d4d8] ">
            <BackButton />
            <div>{children}</div>
        </header>
    );
}
