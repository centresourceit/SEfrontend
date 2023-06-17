import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import React, { useRef, useState } from "react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

import { ToastContainer, toast } from "react-toastify";

import styles from "react-toastify/dist/ReactToastify.css";
import { z } from "zod";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader(params: LoaderArgs) {
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const data = await ApiCall({
    query: `
    query getAllProject{
      getAllProject{
        id,
        name,
        description,
        status
      },
    }
  `,
    veriables: {},
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  return json({ project: data.data.getAllProject, token: cookie.token });
}

const UserDashboard = () => {
  const loaderproject = useLoaderData().project;
  const token = useLoaderData().token;

  const [delBox, setDelBox] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);

  const navigator = useNavigate();



  const [project, setProject] = useState<any[]>(loaderproject);


  const updateStatus = async (id: number, status: string) => {
    const data = await ApiCall({
      query: `
      mutation updateProjectById($updateProjectInput:UpdateProjectInput!){
        updateProjectById(updateProjectInput:$updateProjectInput){
          name,
          id
        }
      }
      `,
      veriables: {
        updateProjectInput: {
          id: id,
          status: status,
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });

    if (data.status) {
      await updateProjects();
      toast.success("Status updated successfully", { theme: "light" });
    } else {
      toast.error(data.message, { theme: "light" });
    }
  };



  const updateProjects = async () => {
    const data = await ApiCall({
      query: `
      query getAllProject{
        getAllProject{
          id,
          name,
          description,
          status
        },
      }
    `,
      veriables: {},
      headers: { authorization: `Bearer ${token}` },
    });
    setProject((val) => data.data.getAllProject);
  };


  const deleteProject = async () => {
    const data = await ApiCall({
      query: `
      mutation deleteProjectById($updateProjectInput:UpdateProjectInput!){
        deleteProjectById(updateProjectInput:$updateProjectInput){
          name,
          id
        }
      }
      `,
      veriables: {
        updateProjectInput: {
          id: id,
          deletedAt: Date.now(),
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });

    if (data.status) {
      await updateProjects();
      toast.success("Project deleted successfully", { theme: "light" });
      setDelBox(val => false);
    } else {
      toast.error(data.message, { theme: "light" });
    }
  };

  return (
    <>
      <div className={`w-full bg-black bg-opacity-40 h-screen fixed z-50 top-0 left-0 ${delBox ? "grid" : "hidden"} place-content-center`}>
        <div className="bg-white rounded-md p-4">
          <h1 className="text-center text-2xl font-semibold">Delete</h1>
          <h3 className="text-lg font-semibold">Are you sure you want to delete?</h3>
          <div className="flex w-full gap-4 mt-2">
            <button
              onClick={() => deleteProject()}
              className="py-1 text-white text-lg grow bg-green-500 text-center rounded-md font-medium"
            >
              Delete
            </button>
            <button
              onClick={() => setDelBox(val => false)}
              className="py-1 text-white text-lg grow bg-rose-500 text-center rounded-md font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="grow bg-[#272934] p-4 w-full overflow-x-hidden">
        <div className="flex w-full justify-between">
          <h1 className="text-white font-medium text-2xl">Project</h1>
          <Link to={"/home/addproject"} className="text-center py-1 text-white font-semibold text-md px-4 bg-green-500 rounded-md">Add New Project</Link>
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
                <div key={index} className="bg-[#31353f] w-80 p-4 flex flex-col">
                  <div className="flex gap-6">
                    <p className="text-white font-semibold text-lg">{val.id}</p>
                    <p className="text-white font-semibold text-xl">
                      {val.name}
                    </p>
                    <div className="grow"></div>
                    <div className="cursor-pointer">
                      {val.status == "ACTIVE" ? (
                        <div
                          onClick={() => updateStatus(val.id, "INACTIVE")}
                          className="w-16 py-1 text-white text-xs bg-green-500 text-center rounded-md font-medium"
                        >
                          ACTIVE
                        </div>
                      ) : (
                        <div
                          onClick={() => updateStatus(val.id, "ACTIVE")}
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
                  <div className="w-full bg-gray-400 h-[2px] my-2"></div>
                  <p className="text-gray-200 font-semibold text-md text-center">
                    Action
                  </p>
                  <div className="flex w-full gap-4 mt-2">
                    <button
                      onClick={() => { setId(val.id); setDelBox(val => true); }}
                      className="py-1 text-white text-lg grow bg-rose-500 text-center rounded-md font-medium"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigator(`/home/editproject/${val.id}`)}
                      className="py-1 text-white text-lg grow bg-cyan-500 text-center rounded-md font-medium"
                    >
                      Update
                    </button>
                  </div>
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

export default UserDashboard;
