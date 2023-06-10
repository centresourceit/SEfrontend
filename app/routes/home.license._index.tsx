import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
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

  return json({ license: data.data.getAllLicense, token: cookie.token });
}

const License = () => {
  const loaderlicense = useLoaderData().license;
  const token = useLoaderData().token;
  const [license, setLicense] = useState<any[]>(loaderlicense);

  const updateStatus = async (id: number, status: string) => {
    const data = await ApiCall({
      query: `
      mutation updateLicenseById($updateLicenseInput:UpdateLicenseInput!){
        updateLicenseById(updateLicenseInput:$updateLicenseInput){
          id
        }
      }
      `,
      veriables: {
        updateLicenseInput: {
          id: id,
          status: status,
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });

    if (data.status) {
      await updateLicense();
      toast.success("Status updated successfully", { theme: "light" });
    } else {
      toast.error(data.message, { theme: "light" });
    }
  };

  const updateLicense = async () => {
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
      headers: { authorization: `Bearer ${token}` },
    });
    setLicense((val) => data.data.getAllLicense);
  };

  return (
    <>
      <div className="grow bg-[#272934] p-4 w-full overflow-x-hidden">
        <div className="flex w-full justify-between">
          <h1 className="text-white font-medium text-2xl">License</h1>
          <Link to={"/home/addlicense/"} className="text-center py-1 text-white font-semibold text-md px-4 bg-green-500 rounded-md">Add New License</Link>
        </div>
        <div className="w-full bg-slate-400 h-[1px] my-2"></div>
        <div className="flex gap-6 flex-wrap my-6">
          {license == null || license == undefined ? (
            <>
              <p className="text-rose-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
                There is no license.
              </p>
            </>
          ) : (
            license.map((val: any, index: number) => {
              return (
                <div key={index} className="bg-[#31353f] w-72 p-4">
                  <div className="flex gap-6">
                    <p className="text-white font-semibold text-lg">{val.id}</p>
                    <p className="text-white font-semibold text-xl">
                      {val.licenseType}
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
                    {new Date(val.discountValidTill).toLocaleDateString(
                      "en-US"
                    )}
                  </p>
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

export default License;
