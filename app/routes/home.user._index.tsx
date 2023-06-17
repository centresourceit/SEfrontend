import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import axios from "axios";
import React, { useState } from "react";
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
    query getAllUser{
      getAllUser{
        id,
        role,
        name,
        email,
        status,
        role
      }
    }
  `,
    veriables: {},
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  return json({ users: data.data.getAllUser, token: cookie.token });
}

const UserDashboard = () => {
  const loadreusers = useLoaderData().users;
  const token = useLoaderData().token;


  const [delBox, setDelBox] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);


  const [user, setUser] = useState<any[]>(loadreusers);

  const updateStatus = async (id: number, status: string) => {
    const data = await ApiCall({
      query: `
      mutation updateUserById($updateUserInput:UpdateUserInput!){
        updateUserById(updateUserInput:$updateUserInput){
          name,
          email,
          id
        }
      }
      `,
      veriables: {
        updateUserInput: {
          id: id,
          status: status,
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });

    if (data.status) {
      await updateUsers();
      toast.success("Status updated successfully", { theme: "light" });
    } else {
      toast.error(data.message, { theme: "light" });
    }
  };

  const updateUsers = async () => {
    const data = await ApiCall({
      query: `
      query getAllUser{
        getAllUser{
          id,
          role,
          name,
          email,
          status,
          role
        }
      }
    `,
      veriables: {},
      headers: { authorization: `Bearer ${token}` },
    });
    setUser((val) => data.data.getAllUser);
  };

  const deleteUser = async () => {
    const data = await ApiCall({
      query: `
      mutation deleteUserById($updateUserInput:UpdateUserInput!){
        deleteUserById(updateUserInput:$updateUserInput){
          name,
          id
        }
      }
      `,
      veriables: {
        updateUserInput: {
          id: id,
          deletedAt: Date.now(),
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });

    if (data.status) {
      await updateUsers();
      toast.success("User deleted successfully", { theme: "light" });
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
              onClick={() => deleteUser()}
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
      <div className="grow bg-[#272934] p-4 w-full">
        <h1 className="text-white font-medium text-2xl">User</h1>
        <div className="w-full bg-slate-400 h-[1px] my-2"></div>
        <div className="flex gap-6 flex-wrap my-6">
          {user == null || user == undefined ? (
            <>
              <p className="text-rose-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
                There is no User.
              </p>
            </>
          ) :
            user.map((val: any, index: number) => {
              return (
                <div key={index} className="bg-[#31353f] w-80 p-4 flex flex-col">
                  <div className="flex gap-2">
                    <p className="text-white font-semibold text-lg">{val.id}</p>
                    <p className="text-white font-semibold text-xl">
                      {val.name}
                    </p>
                    <div className="grow"></div>
                    <div>
                      {val.role == "ADMIN" ? (
                        <div className="w-16 py-1 text-white text-xs bg-green-500 text-center rounded-md font-medium">
                          ADMIN
                        </div>
                      ) : (
                        <div className="w-16 py-1 text-white text-xs bg-cyan-500 text-center rounded-md font-medium">
                          USER
                        </div>
                      )}
                    </div>
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
                  <p className="text-gray-200 font-semibold text-md">
                    {val.name}
                  </p>
                  <p className="text-gray-200 font-semibold text-md">
                    {val.email}
                  </p>
                  <p className="text-gray-200 font-semibold text-md">
                    {val.contact}
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
                      onClick={() => updateStatus(val.id, "ACTIVE")}
                      className="py-1 text-white text-lg grow bg-cyan-500 text-center rounded-md font-medium"
                    >
                      Update
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default UserDashboard;
