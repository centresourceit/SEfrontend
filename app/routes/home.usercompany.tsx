
import { LoaderArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Fa6SolidHeart } from "~/components/icons/Icons";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";


import Stripe from "stripe";
import { useEffect, useState } from "react";

export async function loader(params: LoaderArgs) {
    const cookieHeader = params.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);

    const user = await ApiCall({
        query: `
      query getUserById($id:Int!){
        getUserById(id:$id){
          id,
       	  name, 
    		  companyId, 
          company{
            id,
            name,
            website,
            email,
            logo,
            ctoContact,
            description,
            address,
            status
          }
        }
      }
      `,
        veriables: {
            id: Number(cookie.id)
        },
        headers: { authorization: `Bearer ${cookie.token}` },
    });

    return json({
        token: cookie.token,
        userId: cookie.id,
        user: user.data.getUserById
    });
}


const UserCompany = (): JSX.Element => {

    const loader = useLoaderData();
    const user = loader.user;
    return (

        <div className="grow  p-4 w-full">

            {
                user.companyId == null ?
                    <div className=" my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
                        <p className="text-rose-500 font-semibold text-2xl">
                            You haven't created your company.
                        </p>
                        <Link to={"/home/addcompanyuser"} className="bg-rose-500 text-white py-1 px-4 rounded-md text-xl mt-4 inline-block">Create</Link>
                    </div>
                    :
                    <div className="bg-primary-800 gap-6 p-4 flex">
                        <div>
                            <img src={user.company.logo} alt="logo" className="w-44 h-44 rounded-md object-cover" />
                        </div>
                        <div className="grow">

                            <div className="flex">
                                <p className="text-white font-semibold text-xl">
                                    {user.company.name}
                                </p>
                                <div className="grow"></div>
                                <div className="cursor-pointer">
                                    {user.company.status == "ACTIVE" ? (
                                        <div
                                            className="w-16 py-1 text-white text-xs bg-green-500 text-center rounded-md font-medium"
                                        >
                                            ACTIVE
                                        </div>
                                    ) : (
                                        <div
                                            className="w-16 py-1 text-white text-xs bg-rose-500 text-center rounded-md font-medium"
                                        >
                                            INACTIVE
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-200 font-semibold text-md">
                                {user.company.description}
                            </p>
                            <p className="text-gray-200 font-normal text-md my-1">
                                Email: {user.company.email}
                            </p>
                            <p className="text-gray-200 font-normal text-md my-1">
                                Contact: {user.company.ctoContact}
                            </p>
                            <p className="text-gray-200 font-normal text-md my-1">
                                Address: {user.company.address}
                            </p>

                        </div>
                    </div>
            }
        </div>

    );
}

export default UserCompany;