import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    query getAllLicenseslave{
      getAllLicenseslave{
        id,
        paymentStatus,
        licenseValidity,
        paymentReference,
        status,
        user{
          email,
          name,
          contact,
        },
        licenseType{
          questionAllowed
          licenseType,
          projectPerLicense
        }
      }
    }
  `,
    veriables: {},
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  return json({ license: data.data.getAllLicenseslave, token: cookie.token });
}

const Compliance = () => {
  const loaderlicense = useLoaderData().license;
  const token = useLoaderData().token;
  const [license, setLicense] = useState<any[]>(loaderlicense);

  const updateStatus = async (id: number, status: string) => {
    const data = await ApiCall({
      query: `
      mutation updateLicenseslaveById($updateLicenseslaveInput:UpdateLicenseslaveInput!){
        updateLicenseslaveById(updateLicenseslaveInput:$updateLicenseslaveInput){
          id
        }
      }
      `,
      veriables: {
        updateLicenseslaveInput: {
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
      query getAllLicenseslave{
        getAllLicenseslave{
          id,
          paymentStatus,
          licenseValidity,
          paymentReference,
          status,
          user{
            email,
            name,
            contact,
          },
          licenseType{
            questionAllowed
            licenseType,
            projectPerLicense
          }
        }
      }
    `,
      veriables: {},
      headers: { authorization: `Bearer ${token}` },
    });
    setLicense((val) => data.data.getAllLicenseslave);
  };

  return (
    <>
      <div className="grow bg-[#272934] p-4 w-full overflow-x-hidden">
        <h1 className="text-white font-medium text-2xl">License Purchased</h1>
        <div className="w-full bg-slate-400 h-[1px] my-2"></div>
        <div className="flex gap-6 flex-wrap my-6">
          {license == null || license == undefined ? (
            <>
              <p className="text-rose-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
                There is no compliance.
              </p>
            </>
          ) : (
            license.map((val: any, index: number) => {
              return (
                <div key={index} className="bg-[#31353f] w-80 p-4">
                  <div className="flex gap-6">
                    <p className="text-white font-semibold text-lg">{val.id}</p>
                    <p className="text-white font-semibold text-xl">
                      {val.user.name}
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
                    Email : {val.user.email}
                  </p>
                  <p className="text-gray-200 font-normal text-md my-1">
                    Contact : {val.user.contact}
                  </p>
                  <div className="w-full h-[2px] bg-gray-400 my-2"></div>
                  <p className="text-gray-200 font-normal text-md my-1">
                    License Validity :
                    {new Date(val.licenseValidity).toLocaleString()}
                  </p>
                  <p className="text-gray-200 font-normal text-md my-1">
                    Payment Reference : {val.paymentReference}
                  </p>
                  <div className="w-full h-[2px] bg-gray-400 my-2"></div>
                  <p className="text-gray-200 font-normal text-md my-1">
                    Question Allowed : {val.licenseType.questionAllowed}
                  </p>
                  <p className="text-gray-200 font-normal text-md my-1">
                    License Type: {val.licenseType.licenseType}
                  </p>
                  <p className="text-gray-200 font-normal text-md my-1">
                    Project/License : {val.licenseType.projectPerLicense}
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

export default Compliance;
