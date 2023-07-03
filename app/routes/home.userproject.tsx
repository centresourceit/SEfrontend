import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";
import { ToastContainer, toast } from "react-toastify";
import styles from "react-toastify/dist/ReactToastify.css";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export async function loader(params: LoaderArgs) {
    const cookieHeader = params.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    const data = await ApiCall({
        query: `
            query searchProject($searchProjectInput:SearchProjectInput!){
                searchProject(searchProjectInput:$searchProjectInput){
                    id,
                    name,
                    description,
                    createdUserId,
                    status
                },
            }
            `,
        veriables: {
            searchProjectInput: {
                createdUserId: Number(cookie.id)
            }
        },
        headers: { authorization: `Bearer ${cookie.token}` },
    });
    const license = await ApiCall({
        query: `
        query searchLicenseslave($searchLicenseslaveInput:SearchLicenseslaveInput!){
            searchLicenseslave(searchLicenseslaveInput:$searchLicenseslaveInput){
              licenseType{
                questionAllowed,
                projectPerLicense,
              }
            }
          }
            `,
        veriables: {
            searchLicenseslaveInput: {
                userId: Number(cookie.id)
            }
        },
        headers: { authorization: `Bearer ${cookie.token}` },
    });

    return json({ project: data.data.searchProject, token: cookie.token, license: license.data.searchLicenseslave });
}

const UserProject = () => {
    const project = useLoaderData().project;
    const token = useLoaderData().token;
    const license = useLoaderData().license[0];

    const navigator = useNavigate();

    const addProject = () => {
        if (license.licenseType.projectPerLicense <= project.length) return toast.error("Your project limit is reached.");
        navigator("/home/addproject");
    }
    return (
        <>
            <div className="grow  p-4 w-full overflow-x-hidden">
                <div className="flex w-full justify-between">
                    <h1 className="text-white font-medium text-2xl">Your Project</h1>
                    <button onClick={addProject} className="text-center py-1 text-white font-semibold text-md px-4 bg-green-500 rounded-md">Add New Project</button>
                </div>
                <div className="w-full bg-slate-400 h-[1px] my-2"></div>
                <div className="flex gap-6 flex-wrap my-6">

                    {project == null || project == undefined ? (
                        <>
                            <p className="text-rose-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
                                There is no project.
                            </p>
                        </>
                    ) : (
                        project.map((val: any, index: number) => {
                            return (
                                <div key={index} className="bg-primary-800 w-80 p-4 flex flex-col">
                                    <div className="flex gap-6">
                                        <p className="text-white font-semibold text-lg">{val.id}</p>
                                        <p className="text-white font-semibold text-xl">
                                            {val.name}
                                        </p>
                                        <div className="grow"></div>
                                        <div className="cursor-pointer">
                                            {val.status == "ACTIVE" ? (
                                                <div
                                                    className="w-16 py-1 text-white text-xs bg-green-500 text-center rounded-md font-medium"
                                                >
                                                    ACTIVE
                                                </div>
                                            ) : (
                                                <div
                                                    className="w-16 py-1 text-white text-xs bg-rose-500 text-center rounded-md font-medium"
                                                >
                                                    INACTIVE
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-gray-200 font-semibold text-md">
                                        {val.description}
                                    </p>
                                    <div className="grow"></div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <ToastContainer></ToastContainer>
        </>
    );
};

export default UserProject;
