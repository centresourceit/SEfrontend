import { LoaderArgs, LoaderFunction, json, logDevReady } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
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
        verification: verification,
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

    const resentmail = async () => {
        const resentmail = await ApiCall({
            query: `
            mutation resendmail($mail:String!,$name:String!){
                resendmail(mail:$mail,name:$name)
              }
                `,
            veriables: {
                mail: (editemail == null || editemail == undefined || editemail == "") ? email : editemail,
                name: name,
            },
            headers: { authorization: `Bearer ${token}` },
        });
        if (resentmail.status) {
            toast.success("E-Mail Send successfully. Check your email and verify.", { theme: "light" });
        } else {
            toast.error(resentmail.message, { theme: "light" });
        }
    }

    const [editemail, setEditEmail] = useState<string>("");
    const [emailbox, setEmailbox] = useState<boolean>(false);

    const addemail = async () => {

        const EmailScheme = z
            .object({
                email: z
                    .string()
                    .nonempty("Email is required.")
                    .email("Enter a valid email."),
            })
            .strict();

        type EmailScheme = z.infer<typeof EmailScheme>;

        const emailScheme: EmailScheme = {
            email: editemail,
        };

        const parsed = EmailScheme.safeParse(emailScheme);
        if (parsed.success) {
            const user = await ApiCall({
                query: `
                mutation updateUserById($updateUserInput:UpdateUserInput!){
                    updateUserById(updateUserInput:$updateUserInput){
                      id
                    }
                  }
                `,
                veriables: {
                    updateUserInput: {
                        id: Number(userId),
                        email: editemail
                    },
                },
                headers: { authorization: `Bearer ${token}` },
            });

            if (!user.status) {
                toast.error(user.message, { theme: "light" });
            } else {
                setEmailbox((val: boolean) => false);
            }
        }
        else {
            toast.error(parsed.error.errors[0].message, { theme: "light" });
        }
    }

    return (
        <>
            <div className={`fixed top-0 left-0 bg-black bg-opacity-50 min-h-screen w-full z-50 ${emailbox ? "grid place-items-center" : "hidden"}`}>
                <div className="bg-primary-800 p-4 rounded-md w-80">
                    <h3 className="text-2xl text-center font-semibold text-secondary">Add your comment here.</h3>
                    <div className="w-full h-[2px] bg-gray-800 my-4"></div>
                    <input
                        value={editemail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="fill-none outline-none bg-transparent my-2 border-2 border-gray-200 p-2 text-white placeholder:text-gray-300 w-full"
                        placeholder="Enter Your Comment"
                    />
                    <div className="flex flex-wrap gap-6 mt-4">
                        <button
                            onClick={addemail}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
                        >
                            Submit
                        </button>
                        <button
                            onClick={() => setEmailbox(val => false)}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full bg-primary-700 grid place-content-center h-screen">
                <div className="bg-primary-800 rounded-lg shadow-md px-6 py-2 mx-10">
                    <p className="text-xl text-center font-semibold text-secondary my-4">Email has been sent to your registered mail id please verify your email before proceeding.</p>
                    <p className="text-xl text-center font-semibold text-secondary my-4">Email : {(editemail == null || editemail == undefined || editemail == "") ? email : editemail} <button onClick={() => setEmailbox((val: boolean) => true)} className="text-xl text-center font-semibold text-blue-500">Edit Mail</button></p>
                    <div className="w-full flex gap-4">
                        <Link to="/logout" className="text-xl text-center font-semibold text-blue-500">Go back to login</Link>
                        <div className="grow"></div>
                        <button
                            onClick={resentmail}
                            className="text-xl text-center font-semibold text-blue-500">Resend E-Mail</button>
                    </div>
                </div>
            </div>
        </>
    );
}


export default verifyuser;