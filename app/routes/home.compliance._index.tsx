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
    query getAllCompliance{
      getAllCompliances{
        id,
        name,
        description,
        status,
        LearnMoreLink
      }
    }
  `,
    veriables: {},
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  return json({ compliance: data.data.getAllCompliances, token: cookie.token });
}

const Compliance = () => {
  const loadercompliance = useLoaderData().compliance;
  const token = useLoaderData().token;
  const [compliance, setCompliance] = useState<any[]>(loadercompliance);

  const updateStatus = async (id: number, status: string) => {
    const data = await ApiCall({
      query: `
      mutation updateComplianceById($updateComplianceInput:UpdateComplianceInput!){
        updateComplianceById(updateComplianceInput:$updateComplianceInput){
          id
        }
      }
      `,
      veriables: {
        updateComplianceInput: {
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
      query getAllCompliance{
        getAllCompliances{
          id,
          name,
          description,
          status,
          LearnMoreLink
        }
      }
    `,
      veriables: {},
      headers: { authorization: `Bearer ${token}` },
    });
    setCompliance((val) => data.data.getAllCompliances);
  };

  return (
    <>
      <div className="grow bg-[#272934] p-4 w-full overflow-x-hidden">
        <div className="flex w-full justify-between">
          <h1 className="text-white font-medium text-2xl">Compliance</h1>
          <Link to={"/home/addcompliance"} className="text-center py-1 text-white font-semibold text-md px-4 bg-green-500 rounded-md">Add New Compliance</Link>
        </div>
        <div className="w-full bg-slate-400 h-[1px] my-2"></div>
        <div className="flex gap-6 flex-wrap my-6">
          {compliance == null || compliance == undefined ? (
            <>
              <p className="text-rose-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
                There is no compliance.
              </p>
            </>
          ) : (
            compliance.map((val: any, index: number) => {
              return (
                <div key={index} className="bg-[#31353f] w-80 p-4">
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
                  <p className="text-gray-200 font-normal text-md my-1">
                    Description : {val.description}
                  </p>
                  <Link
                    className="text-blue-400 font-normal text-md my-1"
                    to={val.LearnMoreLink}
                  >
                    {val.LearnMoreLink}
                  </Link>
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
