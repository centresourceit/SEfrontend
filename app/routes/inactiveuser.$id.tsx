import { LoaderArgs, LoaderFunction, json, logDevReady } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { BaseUrl } from "~/const";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const email = props.params.mail;
    const cookieHeader = props.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    const verification = await ApiCall({
        query: `
        mutation verifyUser($mail:String!){
            verifyUser(mail:$mail){
              id
            }
          }
            `,
        veriables: {
            mail: email
        },
        headers: { authorization: `Bearer ${cookie.token}` },
    });
    return json({ verification: verification });
};

const verifyuser: React.FC = (): JSX.Element => {
    return (
        <>
            <div className="w-full bg-primary-700 grid place-content-center h-screen">
                <div className="bg-primary-800 rounded-lg shadow-md px-6 py-2 mx-10">
                    <p className="text-xl text-center font-semibold text-secondary my-4">Email has been sent to your registered mail id please verify your email before proceeding.</p>
                    <div className="w-full grid place-items-center">
                        <Link to="/" className="text-xl text-center font-semibold text-blue-500">Go back to website</Link>
                    </div>
                </div>
            </div>
        </>
    );
}


export default verifyuser;