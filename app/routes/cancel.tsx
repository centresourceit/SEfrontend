import { Link } from "@remix-run/react";

const Cencel: React.FC = (): JSX.Element => {
    return (
        <div className="bg-[#eeeeee] h-screen w-full grid place-items-center">
            <div className="w-80 bg-white rounded-md shadow-md p-6">
                <h1 className="text-red-500  text-xl font-semibold">Error!</h1>
                <h1 className="my-4 text-red-500 bg-red-500 bg-opacity-10 rounded-md border-l-2 border-red-500 p-2">Payment not completed Something went wrong. Try Again!</h1>

                <Link to={"/home"} className="py-2 rounded-md shadow-md bg-red-500 text-white font-semibold px-4">Go Back Home</Link>
            </div>
        </div>
    )
}

export default Cencel;