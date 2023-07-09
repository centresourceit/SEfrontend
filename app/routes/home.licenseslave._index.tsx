import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import React, { useState } from "react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

import { toast } from "react-toastify";

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
        paymentAmount,
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



const LicenseSlave = () => {
  const loaderlicense = useLoaderData().license;
  const token = useLoaderData().token;
  const [license, setLicense] = useState<any[]>(loaderlicense);

  const navigator = useNavigate();


  const [delBox, setDelBox] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);

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
      await updateLicenseSlave();
      toast.success("Status updated successfully", { theme: "light" });
    } else {
      toast.error(data.message, { theme: "light" });
    }
  };


  const updateLicenseSlave = async () => {
    const data = await ApiCall({
      query: `
      query getAllLicenseslave{
        getAllLicenseslave{
          id,
          paymentStatus,
          licenseValidity,
          paymentReference,
          paymentAmount,
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


  const deleteLicenseSlave = async () => {
    const data = await ApiCall({
      query: `
      mutation deleteLicenseSlaveById($updateLicenseslaveInput:UpdateLicenseslaveInput!){
        deleteLicenseSlaveById(updateLicenseslaveInput:$updateLicenseslaveInput){
          id
        }
      }
      `,
      veriables: {
        updateLicenseslaveInput: {
          id: id,
          deletedAt: Date.now(),
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });

    if (data.status) {
      await updateLicenseSlave();
      toast.success("LicenseSlave deleted successfully", { theme: "light" });
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
              onClick={() => deleteLicenseSlave()}
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
      <div className="grow  p-4 w-full overflow-x-hidden">
        <h1 className="text-white font-medium text-2xl">License Purchased</h1>
        <div className="w-full bg-slate-400 h-[1px] my-2"></div>
        <div className="flex gap-6 flex-wrap my-6">
          {license == null || license == undefined ? (
            <>
              <p className="text-rose-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
                There are no Licenses.
              </p>
            </>
          ) : (
            license.map((val: any, index: number) => {
              return (
                <div key={index} className="bg-primary-800 w-80 p-4 flex flex-col">
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
                    License Payment Amount :
                    {val.paymentAmount}
                  </p>
                  <p className="text-gray-200 font-normal text-md my-1">
                    License Validity :   {new Date(val.licenseValidity).toLocaleString()}
                  </p>
                  <p className="text-gray-200 font-normal text-md my-1">
                    Payment Reference : {val.paymentReference.toString().toUpperCase()}
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
                      onClick={() => navigator(`/home/editlicenseslave/${val.id}`)}
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
    </>
  );
};

export default LicenseSlave;
