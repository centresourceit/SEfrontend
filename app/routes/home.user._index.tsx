import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import axios from "axios";
import React from "react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";
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

  return json({ users: data.data.getAllUser });
}

const UserDashboard = () => {
  const users = useLoaderData().users;
  return (
    <div className="grow bg-[#272934] p-4 w-full">
      <h1 className="text-white font-medium text-2xl">User</h1>
      <div className="w-full bg-slate-400 h-[1px] my-2"></div>
      <div className="no-scrollbar w-full overflow-x-auto">
        <div className="bg-[#31353f]  rounded-md flex px-4 py-2 my-2 text-white font-medium text-md flex-nowrap">
          <div className="w-14">Id</div>
          <div className="grow"></div>
          <div className="w-44">Name</div>
          <div className="grow"></div>
          <div className="w-44">Email</div>
          <div className="grow"></div>
          <div className="w-24">Status</div>
          <div className="grow"></div>
          <div className="w-24">Role</div>
        </div>
        {users.map((val: any, index: number) => {
          return (
            <div
              key={index}
              className="bg-[#31353f] hover:bg-opacity-60 rounded-md flex px-4 py-2 my-2 text-white font-medium text-md flex-nowrap"
            >
              <div className="w-14">{val.id}</div>
              <div className="grow"></div>
              <div className="w-44">{val.name}</div>
              <div className="grow"></div>
              <div className="w-44">{val.email}</div>
              <div className="grow"></div>
              <div className="w-24 grid place-items-center">
                {val.status == "ACTIVE" ? (
                  <div className="w-16 py-1 text-white text-xs bg-green-500 text-center rounded-md font-medium">
                    ACTIVE
                  </div>
                ) : (
                  <div className="w-16 py-1 text-white text-xs bg-rose-500 text-center rounded-md font-medium">
                    INACTIVE
                  </div>
                )}
              </div>
              <div className="grow"></div>
              <div className="w-24">
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserDashboard;