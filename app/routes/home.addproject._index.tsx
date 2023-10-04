import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

import { z } from "zod";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";


export async function loader({ params, request }: LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    return json({ token: cookie.token, userId: cookie.id });
}


const AddProject: React.FC = (): JSX.Element => {
    const userId = useLoaderData().userId;
    const token = useLoaderData().token;

    const navigator = useNavigate();

    const pName = useRef<HTMLInputElement>(null);
    const pDesciption = useRef<HTMLTextAreaElement>(null);

    const addProject = async () => {
        const ProjectScheme = z
            .object({
                name: z
                    .string()
                    .nonempty("Project Name is required."),
                description: z
                    .string()
                    .nonempty("Project Description is required")
            })
            .strict();

        type ProjectScheme = z.infer<typeof ProjectScheme>;

        const projectScheme: ProjectScheme = {
            name: pName!.current!.value,
            description: pDesciption!.current!.value,
        };



        const parsed = ProjectScheme.safeParse(projectScheme);

        if (parsed.success) {
            const data = await ApiCall({
                query: `
                mutation createProject($createProjectInput:CreateProjectInput!){
                    createProject(createProjectInput:$createProjectInput){
                      id
                    }
                  }
              `,
                veriables: {
                    createProjectInput: {
                        name: projectScheme.name,
                        description: projectScheme.description,
                        createdUserId: Number(userId)
                    }
                },
                headers: { authorization: `Bearer ${token}` },
            });

            if (!data.status) {
                toast.error(data.message, { theme: "light" });
            } else {
                pName!.current!.value = ""
                pDesciption!.current!.value = "";
                navigator(-1);
            }
        }
        else { toast.error(parsed.error.errors[0].message, { theme: "light" }); }
    };
    return (<>
        <div className="grow w-full  p-4 bg-primary-700 ">

            <h1 className="text-white font-medium text-2xl">Add New Project</h1>
            <div className="bg-gray-400 w-full h-[2px] my-2"></div>


            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Project Name
            </h2>
            <input
                ref={pName}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter Project Name"
            />
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Project Description
            </h2>
            <textarea
                ref={pDesciption}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300 resize-none h-28"
                placeholder="Enter Project Description"
            ></textarea>
            <div></div>
            <button
                onClick={addProject}
                className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded mt-4"
            >
                SUBMIT
            </button>
        </div>
    </>);
}

export default AddProject;