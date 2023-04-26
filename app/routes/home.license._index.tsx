import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";
export async function loader(params: LoaderArgs) {
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const data = await ApiCall({
    query: `
    query getAllLicense{
      getAllLicense{
        id,
        licenseType,
        paymentAmount,
        discountAmount,
        discountValidTill,
        questionAllowed,
        projectPerLicense,
        status
      }
    }
  `,
    veriables: {},
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  return json({ license: data.data.getAllLicense });
}

const UserDashboard = () => {
  const license = useLoaderData().license;
  return (
    <div className="grow bg-[#272934] p-4 w-full overflow-x-hidden">
      <h1 className="text-white font-medium text-2xl">User</h1>
      <div className="w-full bg-slate-400 h-[1px] my-2"></div>
      <div className="flex gap-6 flex-wrap my-6">
        {license.map((val: any, index: number) => {
          return (
            <div key={index} className="bg-[#31353f] w-72 p-4">
              <div className="flex gap-6">
                <p className="text-white font-semibold text-lg">{val.id}</p>
                <p className="text-white font-semibold text-xl">
                  {val.licenseType}
                </p>
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
              <p className="text-gray-200 font-normal text-md my-1">
                Payment Amount : {val.paymentAmount}
              </p>
              <p className="text-gray-200 font-normal text-md my-1">
                Discount Amount : {val.discountAmount}
              </p>
              <p className="text-gray-200 font-normal text-md my-1">
                Question Allowed : {val.questionAllowed}
              </p>
              <p className="text-gray-200 font-normal text-md my-1">
                Project/License : {val.projectPerLicense}
              </p>
              <p className="text-gray-200 font-normal text-md my-1">
                Discount Valid Till :{" "}
                {new Date(val.discountValidTill).toLocaleDateString("en-US")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserDashboard;
