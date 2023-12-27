import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import React, { useState } from "react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

import { toast } from "react-toastify";

export async function loader(params: LoaderArgs) {
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  if (cookie.role != "ADMIN") {
    return redirect("/home");
  }

  const data = await ApiCall({
    query: `
    query getAllCompliance{
      getAllCompliances{
        id,
        name,
        logo,
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
  const loader = useLoaderData();
  const loadercompliance = loader.compliance;
  const token = loader.token;
  const [compliance, setCompliance] = useState<any[]>(loadercompliance);

  const navigator = useNavigate();

  const [delBox, setDelBox] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);

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
          logo,
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

  const deleteCompliance = async () => {
    const data = await ApiCall({
      query: `
      mutation deleteComplianceById($updateComplianceInput:UpdateComplianceInput!){
        deleteComplianceById(updateComplianceInput:$updateComplianceInput){
          name,
          id
        }
      }
      `,
      veriables: {
        updateComplianceInput: {
          id: id,
          deletedAt: Date.now(),
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });

    if (data.status) {
      await updateLicense();
      toast.success("Compliance deleted successfully", { theme: "light" });
      setDelBox((val) => false);
    } else {
      toast.error(data.message, { theme: "light" });
    }
  };
  return (
    <>
      <div
        className={`w-full bg-black bg-opacity-40 h-screen fixed z-50 top-0 left-0 ${
          delBox ? "grid" : "hidden"
        } place-content-center`}
      >
        <div className="bg-white rounded-md p-4">
          <h1 className="text-center text-2xl font-semibold">Delete</h1>
          <h3 className="text-lg font-semibold">
            Are you sure you want to delete?
          </h3>
          <div className="flex w-full gap-4 mt-2">
            <button
              onClick={() => deleteCompliance()}
              className="py-1 text-white text-lg grow bg-green-500 text-center rounded-md font-medium"
            >
              Delete
            </button>
            <button
              onClick={() => setDelBox((val) => false)}
              className="py-1 text-white text-lg grow bg-rose-500 text-center rounded-md font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="grow  p-4 w-full overflow-x-hidden">
        <div className="flex w-full justify-between">
          <h1 className="text-white font-medium text-2xl">Compliance</h1>
          <Link
            to={"/home/addcompliance"}
            className="text-center py-1 text-white font-semibold text-md px-4 bg-green-500 rounded-md"
          >
            Add New Compliance
          </Link>
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
                <div
                  key={index}
                  className="bg-primary-800 w-96 p-4 flex flex-col"
                >
                  <div className="flex gap-4">
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
                  <div className="my-4">
                    <img
                      src={val.logo}
                      alt="logo"
                      className="w-44 h-44 rounded-md object-cover"
                    />
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
                  <div className="grow"></div>
                  <div className="flex w-full gap-4 mt-4">
                    <button
                      onClick={() => {
                        setId(val.id);
                        setDelBox((val) => true);
                      }}
                      className="py-1 text-white text-lg grow bg-rose-500 text-center rounded-md font-medium"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        navigator(`/home/editcompliance/${val.id}`)
                      }
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

export default Compliance;
