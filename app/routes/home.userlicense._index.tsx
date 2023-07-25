import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

import Stripe from "stripe";

export async function loader(params: LoaderArgs) {
    const baseUrl = params.request.url.split("/").slice(0, 3).join("/");
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

    const license = await ApiCall({
        query: `
        query getUserLicenseSlave($id:Int!){
            getUserLicenseSlave(id:$id){
            licenseTypeId,
            paymentStatus,
            licenseValidity,
            paymentReference,
            paymentAmount,
            createdAt,
            licenseType{
              paymentAmount,
              licenseType,
              questionAllowed,
              projectPerLicense,
              discountValidTill,          
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
        license: data.data.getAllLicense,
        token: cookie.token,
        user: cookie,
        userlicense: license.data.getUserLicenseSlave,
        strip_key: process.env.STRIP_KEY,
        baseUrl: baseUrl
    });
}

const license: React.FC = (): JSX.Element => {
    const loader = useLoaderData();
    const user = loader.user;
    const token = loader.token;
    const license = loader.license;
    const baseUrl = loader.baseUrl;
    const userlicense = loader.userlicense;
    const [licenseBox, setLicenseBox] = useState<boolean>(false);
    const [licenaseid, setLicenaseid] = useState<any>(null);

    const navigator = useNavigate();

    const purchase = async () => {
        if (licenaseid == null || licenaseid == undefined) toast.error("Select the licenas plain.", { theme: "dark" });
        var date = new Date();
        date.setDate(date.getDate() + 30);

        const data = await ApiCall({
            query: `
            mutation createLicenseSlave($createLicenseslaveInput:CreateLicenseslaveInput!){
                createLicenseSlave(createLicenseslaveInput:$createLicenseslaveInput){
                    id,
                }
              }
            `,
            veriables: {
                "createLicenseslaveInput": {
                    "licenseTypeId": licenaseid.id,
                    "paymentStatus": "ACTIVE",
                    "licenseValidity": date,
                    "userId": Number(user.id),
                    "paymentReference": "SoMe_RaNdOm",
                    "paymentAmount": licenaseid.paymentAmount,
                    "status": "ACTIVE"
                }
            },
            headers: { authorization: `Bearer ${token}` },
        });
        if (data.status) {
            navigator("/home");
        } else {
            toast.error(data.message, { theme: "light" });
        }
    }

    const stripkey = loader.strip_key;

    const stripe = new Stripe(
        stripkey,
        { apiVersion: "2022-11-15" }
    );

    const handlepayment = async (amount: number, license: number) => {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Example Product",
                            images: [
                                "https://plus.unsplash.com/premium_photo-1684952849219-5a0d76012ed2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80",
                            ],
                        },
                        unit_amount: amount * 100, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            success_url: `${baseUrl}/success/${license}`,
            cancel_url: `${baseUrl}/cancel`,
        });
        window.location.assign(session.url == null ? "" : session.url);
    };


    return (
        <>
            <div className={`fixed top-0 left-0 bg-black bg-opacity-50 min-h-screen w-full z-50 ${licenseBox ? "grid place-items-center" : "hidden"}`}>
                <div className="bg-white p-4 rounded-md w-80">
                    <h3 className="text-2xl text-center font-semibold">Are you sure you want to continue with this license?</h3>
                    <div className="w-full h-[2px] bg-gray-800 my-4"></div>
                    <div className="flex flex-wrap gap-6 mt-4">
                        <button
                            onClick={purchase}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => setLicenseBox(val => false)}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
            <div className="min-h-screen w-full grow  p-4">
                <h1 className="text-secondary font-medium text-2xl text-center my-4">My License</h1>
                <div className="w-full bg-secondary h-[1px] my-2"></div>
                <div className="grow bg-primary-800 p-4 rounded-md mx-auto w-96">
                    <p className="text-gray-200 font-semibold text-xl text-center">
                        License Details
                    </p>
                    <p className="text-gray-200 font-semibold text-md">
                        License Type: {userlicense.licenseType.licenseType}
                    </p>
                    <p className="text-gray-200 font-semibold text-md">
                        Question Allowed: {userlicense.licenseType.questionAllowed}
                    </p>
                    <p className="text-gray-200 font-semibold text-md">
                        Project Per License: {userlicense.licenseType.projectPerLicense}
                    </p>
                    <p className="text-gray-200 font-semibold text-md">
                        License Start: {new Date(userlicense.createdAt).toDateString()}
                    </p>
                    <p className="text-gray-200 font-semibold text-md">
                        License end: {new Date(userlicense.licenseValidity).toDateString()} [{((new Date(userlicense.licenseValidity).getTime() - new Date().getTime()) / (1000 * 3600 * 24)).toFixed(0)} Days Left.]
                    </p>
                </div>
                <div className="h-10"></div>
                <h1 className="text-secondary font-medium text-2xl text-center my-4">Available License(s)</h1>
                <div className="w-full bg-secondary h-[1px] my-2"></div>
                <div className="flex sm:w-4/5 mx-auto justify-center my-8 flex-wrap gap-10">
                    {license == null || license == undefined ? (
                        <>
                            <p className="text-secondary font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-secondary bg-opacity-20 border-secondary w-full">
                                There is no license.
                            </p>
                        </>
                    ) : (
                        license.map((val: any, index: number) => {
                            return (
                                <div key={index} className="bg-primary-500 text-white rounded-md w-80 p-4 flex flex-col  hover:scale-105 transition-all">

                                    <p className="text-3xl text-center font-bold">
                                        {val.licenseType}
                                    </p>

                                    <p className="text-xl text-center font-bold">
                                        ${val.paymentAmount} / Month
                                    </p>
                                    <p className="text-2xl my-2 text-center font-bold">&#x2756; &#x2756; &#x2756;</p>


                                    <p className="text-xl font-normal my-1">
                                        <span className="text-secondary pr">&#x2756;</span> {val.projectPerLicense} Project(s)
                                    </p>

                                    <p className="text-xl font-normal my-1">
                                        <span className="text-secondary pr">&#x2756;</span> {val.questionAllowed} Ethical Criteria(s)
                                    </p>
                                    {val.licenseType == "FREE" ? null :
                                        <div className="bg-secondary bg-opacity-20 border-2 border-secondary rounded-md p px-4 mt-4">
                                            <p className="font-semibold text-xl my-1 text-secondary">
                                                ${val.discountAmount} Discount
                                            </p>

                                            <p className="font-normal text-lg my-1 text-secondary">
                                                Valid till {new Date(val.discountValidTill).toDateString()}
                                            </p>
                                        </div>
                                    }
                                    <div className="grow"></div>
                                    <div className="flex w-full gap-4 mt-2">
                                        {val.licenseType == "FREE" ?
                                            <button
                                                onClick={() => {
                                                    setLicenseBox(value => true);
                                                    setLicenaseid((value: any) => val);
                                                }}
                                                className="py-1 text-white text-lg grow bg-green-500 text-center rounded-md font-medium"
                                            >
                                                Select
                                            </button>
                                            :
                                            <button
                                                onClick={() => {
                                                    handlepayment(val.paymentAmount, val.id);
                                                }}
                                                className="py-1 text-white text-lg grow bg-green-500 text-center rounded-md font-medium"
                                            >
                                                Select
                                            </button>
                                        }
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <div className="h-20"></div>
            </div>
        </>
    );
}

export default license;