import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BackButton() {
    return (
        <button onClick={() => window.history.back()} className=" p-px w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md cursor-pointer ">
            <FontAwesomeIcon className=" text-gray-500 px-2 text-sm " icon={faArrowLeft} />
        </button>
    )
}