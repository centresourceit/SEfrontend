import { LoaderArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";
import { toast } from "react-toastify";
import { useEffect } from "react";
import sideBarStore, { SideBarTabs } from "~/state/sidebar";


export async function loader(params: LoaderArgs) {
    const cookieHeader = params.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);

    if (cookie.role == "ADMIN") {
        return redirect("/home/user")
    }

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
        query getUserLicenseSlave($id:Int!){
            getUserLicenseSlave(id:$id){
            licenseTypeId,
            paymentStatus,
            licenseValidity,
            paymentReference,
            paymentAmount,
            createdAt,
            licenseType{
            paymentAmount,
              licenseType,
              questionAllowed,
              projectPerLicense,
              discountValidTill,          
              }
            }
        }
            `,
        veriables: {
            id: Number(cookie.id)
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
              company{
                id,
                name,
                website,
                email,
                logo,
                ctoContact,
                description,
                address,
                status
              }
            }
          }
          `,
        veriables: {
            id: Number(cookie.id)
        },
        headers: { authorization: `Bearer ${cookie.token}` },
    });



    return json({
        isProject: data.status,
        project: data.data.searchProject,
        token: cookie.token,
        license: license.data.getUserLicenseSlave,
        isLicense: license.status,
        user: user.data.getUserById,
    });
}

const UserProject = () => {
    const loader = useLoaderData();
    const project = loader.project;
    const token = loader.token;
    const isLicense = loader.isLicense;
    const license = isLicense ? loader.license : null;
    const user = loader.user;
    const navigator = useNavigate();
    const isProject = loader.isProject;

    const addProject = () => {
        if (!isProject) {
            return navigator("/home/addproject");
        }
        if (isLicense) {
            if (license.licenseType.projectPerLicense <= project.length) return toast.error("Your project limit is reached.");
            return navigator("/home/addproject");
        }
    }
    // const projectdata = project.searchProject;

    const achangeindex = sideBarStore((state) => state.changeTab);

    useEffect(() => {
        achangeindex(SideBarTabs.User);
    }, []);

    return (
        <>
            <div className="grow  p-4 w-full overflow-x-hidden">
                {
                    user.companyId == null ?
                        <div className=" my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
                            <p className="text-rose-500 font-semibold text-2xl">
                                You haven't created your company.
                            </p>
                            <Link to={"/home/addcompanyuser"} className="bg-rose-500 text-white py-1 px-4 rounded-md text-xl mt-4 inline-block">Create</Link>
                        </div>
                        :
                        <>
                            <div className="bg-primary-800 gap-6 p-4 flex mb-6 flex-wrap">
                                <div>

                                    {user.company.logo == "0" ?
                                        <img src={"/images/logo.png"} alt="logo" className="w-44 h-44 rounded-md object-contain" />
                                        :
                                        <img src={user.company.logo} alt="logo" className="w-44 h-44 rounded-md object-cover" />
                                    }
                                </div>
                                <div className="w-96">
                                    <div className="flex">
                                        <p className="text-white font-semibold text-xl">
                                            {user.company.name}
                                        </p>
                                        <div className="grow"></div>
                                        <div className="cursor-pointer">
                                            {user.company.status == "ACTIVE" ? (
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
                                    <p className="text-gray-200 font-semibold text-md">
                                        {user.company.description}
                                    </p>
                                    <p className="text-gray-200 font-normal text-md my-1">
                                        Email: {user.company.email}
                                    </p>
                                    <p className="text-gray-200 font-normal text-md my-1">
                                        Contact: {user.company.ctoContact}
                                    </p>
                                    <p className="text-gray-200 font-normal text-md my-1">
                                        Address: {user.company.address}
                                    </p>
                                </div>
                                <div className="grow bg-white bg-opacity-5 p-4 rounded-md items-center">
                                    <div className="flex gap-4 flex-wrap">
                                        <p className="text-gray-200 font-semibold text-xl text-left grow">
                                            License Details
                                        </p>
                                        <Link to={"/home/userlicense/"} className="px-4 py-1 grid place-items-center text-white text-xs bg-cyan-500 text-center rounded-md font-medium">Upgrade License</Link>
                                    </div>
                                    <p className="text-gray-200 font-semibold text-md">
                                        License Type: {license.licenseType.licenseType}
                                    </p>
                                    <p className="text-gray-200 font-semibold text-md">
                                        Question Allowed: {license.licenseType.questionAllowed}
                                    </p>
                                    <p className="text-gray-200 font-semibold text-md">
                                        Project Per License: {license.licenseType.projectPerLicense}
                                    </p>
                                    <p className="text-gray-200 font-semibold text-md">
                                        License Start: {new Date(license.createdAt).toDateString()}
                                    </p>
                                    <p className="text-gray-200 font-semibold text-md">
                                        License end: {new Date(license.licenseValidity).toDateString()} [{((new Date(license.licenseValidity).getTime() - new Date().getTime()) / (1000 * 3600 * 24)).toFixed(0)} Days Left.]
                                    </p>
                                </div>
                            </div>
                        </>
                }
                <div className="flex w-full justify-between">
                    <h1 className="text-white font-medium text-2xl">Your Project</h1>
                    <button onClick={addProject} className="text-center py-1 text-white font-semibold text-md px-4 bg-green-500 rounded-md">Add New Project</button>
                </div>
                <div className="w-full bg-slate-400 h-[1px] my-2"></div>

                {
                    (isLicense) ? null :
                        <div className=" my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
                            <p className="text-rose-500 font-semibold text-2xl">
                                Create license in order to create project.
                            </p>
                            <Link to={"/license"} className="bg-rose-500 text-white py-1 px-4 rounded-md text-xl mt-4 inline-block">Create</Link>
                        </div>
                }
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
                                    <div className="flex gap-4 w-full mt-4">
                                        <Link to={`/home/taketest/${val.id}`} className="bg-primary-500 py-1 text-white text-xl font-normal flex-1 rounded-md text-center">Take Test</Link>
                                        <Link to={`/home/userresult/${val.id}`} className="bg-primary-500 py-1 text-white text-xl font-normal flex-1 rounded-md text-center">Result</Link >
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
};

export default UserProject;