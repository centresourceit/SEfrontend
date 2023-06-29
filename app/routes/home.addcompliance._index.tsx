import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import styles from "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export async function loader({ params, request }: LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    return json({ token: cookie.token, userId: cookie.id });
}


const AddCompliance: React.FC = (): JSX.Element => {
    const userId = useLoaderData().userId;
    const token = useLoaderData().token;
    const navigator = useNavigate();

    const cName = useRef<HTMLInputElement>(null);
    const cDesciption = useRef<HTMLTextAreaElement>(null);
    const cLink = useRef<HTMLInputElement>(null);

    const addCompliance = async () => {
        const ComplianceScheme = z
            .object({
                name: z
                    .string()
                    .nonempty("Compliance Name is required."),
                description: z
                    .string()
                    .nonempty("Compliance Description is required"),
                LearnMoreLink: z
                    .string()
                    .nonempty("Compliance url is required")
            })
            .strict();

        type ComplianceScheme = z.infer<typeof ComplianceScheme>;

        const complianceScheme: ComplianceScheme = {
            name: cName!.current!.value,
            description: cDesciption!.current!.value,
            LearnMoreLink: cLink!.current!.value,
        };



        const parsed = ComplianceScheme.safeParse(complianceScheme);

        if (parsed.success) {
            const data = await ApiCall({
                query: `
                mutation createCompliance($createComplianceInput:CreateComplianceInput!){
                    createCompliance(createComplianceInput:$createComplianceInput){
                      id
                    }
                  }
              `,
                veriables: {
                    createComplianceInput: {
                        name: complianceScheme.name,
                        description: complianceScheme.description,
                        LearnMoreLink: complianceScheme.LearnMoreLink
                    }
                },
                headers: { authorization: `Bearer ${token}` },
            });

            if (!data.status) {
                toast.error(data.message, { theme: "light" });
            } else {
                cName!.current!.value = "";
                cDesciption!.current!.value = ""
                cLink!.current!.value = "";
                navigator("/home/compliance/");
            }
        }
        else { toast.error(parsed.error.errors[0].message, { theme: "light" }); }
    };
    return (<>
        <div className="grow w-full  p-4  ">
            <h1 className="text-white font-medium text-2xl">Add New Compliance</h1>
            <div className="bg-gray-400 w-full h-[2px] my-2"></div>
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Compliance Name
            </h2>
            <input
                ref={cName}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter Compliance Name"
            />
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Compliance Description
            </h2>
            <textarea
                ref={cDesciption}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300 resize-none h-28"
                placeholder="Enter Compliance Description"
            ></textarea>
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Compliance Url
            </h2>
            <input
                ref={cLink}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter Compliance Name"
            />
            <div></div>
            <button
                onClick={addCompliance}
                className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded mt-4"
            >
                SUBMIT
            </button>
        </div>
        <ToastContainer></ToastContainer>
    </>);
}

export default AddCompliance;