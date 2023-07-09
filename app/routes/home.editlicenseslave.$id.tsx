import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { z } from "zod";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";


export async function loader({ params, request }: LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);

    const data = await ApiCall({
        query: `
            query getAllLicenseslaveById($id:Int!){
                getAllLicenseslaveById(id:$id){
                    id,
                    paymentAmount,
                    licenseTypeId,
                    userId,
                    paymentStatus,
                    licenseValidity,
                    paymentReference
                },
            }
        `,
        veriables: {
            id: parseInt(params.id!)
        },
        headers: { authorization: `Bearer ${cookie.token}` },
    });

    const user = await ApiCall({
        query: `
        query getAllUser{
            getAllUser{
              id,
              name
            },
          }
        `,
        veriables: {},
        headers: { authorization: `Bearer ${cookie.token}` },
    });

    const licenses = await ApiCall({
        query: `
        query getAllLicense{
            getAllLicense{
              id,
              licenseType
            },
          }
        `,
        veriables: {},
        headers: { authorization: `Bearer ${cookie.token}` },
    });

    return json({ users: user.data.getAllUser, licenses: licenses.data.getAllLicense, token: cookie.token, userId: cookie.id, licenseslave: data.data.getAllLicenseslaveById });
}


const AddLicenseSlave: React.FC = (): JSX.Element => {
    const userId = useLoaderData().userId;
    const token = useLoaderData().token;
    const navigator = useNavigate();

    const licenseslave = useLoaderData().licenseslave;
    const users = useLoaderData().users;
    const licenses = useLoaderData().licenses;

    const lType = useRef<HTMLSelectElement>(null);
    const lUser = useRef<HTMLSelectElement>(null);
    const paymentStatus = useRef<HTMLSelectElement>(null);
    const licenseValidity = useRef<HTMLInputElement>(null);
    const paymentReference = useRef<HTMLInputElement>(null);
    const paymentAmount = useRef<HTMLInputElement>(null);

    useEffect(() => {
        lType!.current!.value = licenseslave.licenseTypeId;
        lUser!.current!.value = licenseslave.userId;
        paymentAmount!.current!.value = licenseslave.paymentAmount;
        paymentStatus!.current!.value = licenseslave.paymentStatus;
        licenseValidity!.current!.value = licenseslave.licenseValidity.slice(0, 10);
        paymentReference!.current!.value = licenseslave.paymentReference;
    }, []);



    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/[^0-9]/g, '');
        e.target.value = numericValue;
    };


    const editLicenseSlave = async () => {
        const LicenseSlaveScheme = z
            .object({
                id: z
                    .number({
                        required_error: "License Id is required.",
                        invalid_type_error: "License Id should be valid."
                    })
                    .refine(val => val != 0, { message: "Select License Id" }),
                licenseTypeId: z
                    .number({
                        required_error: "License Type is required.",
                        invalid_type_error: "License Type should be valid."
                    })
                    .refine(val => val != 0, { message: "Select the License Type" }),
                userId: z
                    .number({
                        required_error: "User is required.",
                        invalid_type_error: "User should be valid."
                    })
                    .refine(val => val != 0, { message: "Select the User" }),
                paymentAmount: z
                    .number({
                        required_error: "Payment Amount is required.",
                        invalid_type_error: "Payment Amount should be valid."
                    })
                    .refine(val => val != 0, { message: "Payment Amount shoud be more then 0" }),
                paymentStatus: z
                    .string()
                    .nonempty("Select Payment Status")
                    .refine(val => val != "0", { message: "Select the Payment Status" }),
                licenseValidity: z
                    .date({ required_error: "License Validity is required", invalid_type_error: "License Validitys Should be a valid date" }),

            })
            .strict();



        type LicenseSlaveScheme = z.infer<typeof LicenseSlaveScheme>;

        const licenseSlaveScheme: LicenseSlaveScheme = {
            id: licenseslave.id,
            licenseTypeId: parseInt(lType!.current!.value),
            paymentAmount: parseInt(paymentAmount!.current!.value),
            paymentStatus: paymentStatus!.current!.value,
            licenseValidity: new Date(licenseValidity!.current!.value),
            userId: parseInt(lUser!.current!.value),
        };

        const parsed = LicenseSlaveScheme.safeParse(licenseSlaveScheme);

        if (parsed.success) {
            const data = await ApiCall({
                query: `
                    mutation updateLicenseslaveById($updateLicenseslaveInput:UpdateLicenseslaveInput!){
                        updateLicenseslaveById(updateLicenseslaveInput:$updateLicenseslaveInput){
                          id
                        }
                      }
                  `,
                veriables: {
                    updateLicenseslaveInput: licenseSlaveScheme
                },
                headers: { authorization: `Bearer ${token}` },
            });

            if (!data.status) {
                toast.error(data.message, { theme: "light" });
            } else {
                navigator("/home/licenseslave/");
            }
        }
        else {
            toast.error(parsed.error.errors[0].message, { theme: "light" });
        }
    };


    return (<>
        <div className="grow w-full  p-4  ">
            <h1 className="text-white font-medium text-2xl">Edit License Slave</h1>
            <div className="bg-gray-400 w-full h-[2px] my-2"></div>
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                License Type
            </h2>

            <select ref={lType} defaultValue={"0"} className="px-4 bg-primary-700 fill-none outline-none border-2 border-white text-white py-2 w-96 my-2">
                <option value="0" className=" text-white text-lg " disabled>Select License Type</option>
                {
                    licenses.map((val: any, index: number) => {
                        return (
                            <option key={index} className=" text-white text-lg" value={val.id}>{val.licenseType}</option>
                        );
                    })
                }
            </select>

            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                License User
            </h2>
            <select ref={lUser} defaultValue={"0"} className="px-4 bg-primary-700 fill-none outline-none border-2 border-white text-white py-2 w-96 my-2">
                <option value="0" className=" text-white text-lg " disabled>Select License User</option>
                {
                    users.map((val: any, index: number) => {
                        return (
                            <option key={index} className=" text-white text-lg" value={val.id}>{val.name}</option>
                        );
                    })
                }
            </select>

            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                License Payment Amount
            </h2>

            <input
                ref={paymentAmount}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter License Amount"
                onInput={handleNumberInput}
            />

            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                License Status
            </h2>
            <select ref={paymentStatus} defaultValue={"0"} className="px-4 bg-primary-700 fill-none outline-none border-2 border-white text-white py-2 w-96 my-2">
                <option value="0" className=" text-white text-lg " disabled>Select License Status</option>
                <option className=" text-white text-lg" value="ACTIVE">ACTIVE</option>
                <option className=" text-white text-lg" value="INACTIVE">INACTIVE</option>
            </select>


            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                License Valid Till Date
            </h2>
            <input
                type="date"
                ref={licenseValidity}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter License Valid Till Date"
            />
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Payment Reference Id
            </h2>
            <input
                ref={paymentReference}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter Payment Reference Id"
                disabled
            />
            <div></div>
            <button
                onClick={editLicenseSlave}
                className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded mt-4"
            >
                SUBMIT
            </button>
        </div>
    </>);
}

export default AddLicenseSlave;