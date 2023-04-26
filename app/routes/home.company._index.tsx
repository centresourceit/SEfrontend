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
    query getAllCompany{
      getAllCompany{
        id,
        name
        website,
        email,
        ctoContact,
        description,
        address,
        status
      }
    }
  `,
    veriables: {},
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  return json({ company: data.data.getAllCompany });
}

const UserDashboard = () => {
  const company = useLoaderData().company;
  return (
    <div className="grow bg-[#272934] p-4 w-full overflow-x-hidden">
      <h1 className="text-white font-medium text-2xl">Company</h1>
      <div className="w-full bg-slate-400 h-[1px] my-2"></div>
      <div className="flex gap-6 flex-wrap my-6">
        {company.map((val: any, index: number) => {
          return (
            <div
              key={index}
              className="bg-[#31353f] w-80 p-4"
            >
              <div className="flex gap-6">
                <p className="text-white font-semibold text-lg">{val.id}</p>
                <p className="text-white font-semibold text-xl">{val.name}</p>
                <div className="grow"></div>
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
              <p className="text-gray-200 font-semibold text-md">
                {val.description}
              </p>
              <p className="text-gray-200 font-normal text-md my-1">
                Email: {val.email}
              </p>
              <p className="text-gray-200 font-normal text-md my-1">
                Contact: {val.ctoContact}
              </p>
              <p className="text-gray-200 font-normal text-md my-1">
                Address: {val.email}
              </p>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserDashboard;
