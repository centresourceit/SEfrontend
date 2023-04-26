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
    query getPrinciple{
      getPrinciple{
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

  return json({ principle: data.data.getPrinciple });
}

const UserDashboard = () => {
  const principle = useLoaderData().principle;
  return (
    <div className="grow bg-[#272934] p-4 w-full overflow-x-hidden">
      <h1 className="text-white font-medium text-2xl">User</h1>
      <div className="w-full bg-slate-400 h-[1px] my-2"></div>
      <div className="no-scrollbar w-full">
        <div className="bg-[#31353f]  rounded-md flex px-4 py-2 my-2 text-white font-medium text-md flex-nowrap">
          <div className="w-14">Id</div>
          <div className="grow"></div>
          <div className="w-44">Name</div>
          <div className="grow"></div>
          <div className="w-44">Description</div>
          <div className="grow"></div>
          <div className="w-24">Status</div>
        </div>
        {principle.map((val: any, index: number) => {
          return (
            <div
              key={index}
              className="bg-[#31353f] hover:bg-opacity-60 rounded-md flex px-4 py-2 my-2 text-white font-medium text-md flex-nowrap"
            >
              <div className="w-14">{val.id}</div>
              <div className="grow"></div>
              <div className="w-44">{val.name}</div>
              <div className="grow"></div>
              <div className="w-44">{val.description}</div>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserDashboard;
