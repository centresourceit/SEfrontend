import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const cookieHeader = props.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);


    const user = await ApiCall({
        query: `
          query getUserById($id:Int!){
            getUserById(id:$id){
            id,
            name, 
            companyId, 
            email,
            }
          }
          `,
        veriables: {
            id: Number(cookie.id)
        },
        headers: { authorization: `Bearer ${cookie.token}` },
    });
    return json({
        token: cookie.token,
        name: user.data.getUserById.name,
        email: user.data.getUserById.email,
        userId: user.data.getUserById.id
    });
};

const verifyuser: React.FC = (): JSX.Element => {
    const loader = useLoaderData();
    const token = loader.token;
    const name = loader.name;
    const email = loader.email;
    const userId = loader.userId;



    return (
        <>
            <div className="w-full bg-primary-700 grid place-content-center h-screen">
                <div className="bg-primary-800 rounded-lg shadow-md px-6 py-2 mx-10">
                    <p className="text-xl text-center font-semibold text-secondary my-4">Your Email has been verified but admin is not accepted your request kindly wait 1 or 2 days for verification. Thank You!</p>
                    <p className="text-xl text-center font-semibold text-secondary my-4">Something wrong contact us <Link to="/contact" className="text-xl text-center font-semibold text-blue-500">Contact Us</Link></p>
                    <div className="w-full flex gap-4">
                        <Link to="/logout" className="text-xl text-center font-semibold text-blue-500">Go back to Login</Link>
                        <div className="grow"></div>
                        <Link to="/" className="text-xl text-center font-semibold text-blue-500">Go back to Home</Link>
                    </div>
                </div>
            </div>
        </>
    );
}


export default verifyuser;