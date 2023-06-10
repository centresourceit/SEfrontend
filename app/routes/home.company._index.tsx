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

  return json({ company: data.data.getAllCompany, token: cookie.token });
}

const UserDashboard = () => {
  const loaderCompany = useLoaderData().company;
  const token = useLoaderData().token;
  const [company, setCompany] = useState<any[]>(loaderCompany);

  const updateStatus = async (id: number, status: string) => {
    const data = await ApiCall({
      query: `
      mutation updateCompanyById($updateCompanyInput:UpdateCompanyInput!){
        updateCompanyById(updateCompanyInput:$updateCompanyInput){
          id
        }
      }
      `,
      veriables: {
        updateCompanyInput: {
          id: id,
          status: status,
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });

    if (data.status) {
      await updateCompnay();
      toast.success("Status updated successfully", { theme: "light" });
    } else {
      toast.error(data.message, { theme: "light" });
    }
  };

  const updateCompnay = async () => {
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
      headers: { authorization: `Bearer ${token}` },
    });
    setCompany((val) => data.data.getAllCompany);
  };
  return (
    <>
      <div className="grow bg-[#272934] p-4 w-full overflow-x-hidden">
        <div className="flex w-full justify-between">
          <h1 className="text-white font-medium text-2xl">Company</h1>
          <Link to={"/home/addcompany/"} className="text-center py-1 text-white font-semibold text-md px-4 bg-green-500 rounded-md">Add New Company</Link>
        </div>
        <div className="w-full bg-slate-400 h-[1px] my-2"></div>
        <div className="flex gap-6 flex-wrap my-6">
          {company == null || company == undefined ? (
            <>
              <p className="text-rose-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
                There is no company.
              </p>
            </>
          ) : (
            company.map((val: any, index: number) => {
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
            })
          )}
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default UserDashboard;
