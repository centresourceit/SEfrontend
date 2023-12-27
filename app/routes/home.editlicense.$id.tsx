import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { z } from "zod";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export async function loader({ params, request }: LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  if (cookie.role != "ADMIN") {
    return redirect("/home");
  }

  const data = await ApiCall({
    query: `
            query getAllLicenseById($id:Int!){
                getAllLicenseById(id:$id){
                    id,
                    licenseType,
                    name,
                    description,
                    licenseValidTill,
                    paymentAmount,
                    discountAmount,
                    questionAllowed,
                    projectPerLicense,
                    discountValidTill
                },
            }
        `,
    veriables: {
      id: parseInt(params.id!),
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  return json({
    token: cookie.token,
    userId: cookie.id,
    license: data.data.getAllLicenseById,
  });
}

const AddLicense: React.FC = (): JSX.Element => {
  const token = useLoaderData().token;
  const navigator = useNavigate();

  const license = useLoaderData().license;

  const lName = useRef<HTMLInputElement>(null);
  const lType = useRef<HTMLSelectElement>(null);
  const paymentamount = useRef<HTMLInputElement>(null);
  const discountamount = useRef<HTMLInputElement>(null);
  const discountvalid = useRef<HTMLInputElement>(null);
  const questionallowed = useRef<HTMLInputElement>(null);
  const projectperlicense = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const licenseValidTill = useRef<HTMLInputElement>(null);

  useEffect(() => {
    lName!.current!.value = license.name;
    lType!.current!.value = license.licenseType;
    paymentamount!.current!.value = license.paymentAmount;
    discountamount!.current!.value = license.discountAmount;
    questionallowed!.current!.value = license.questionAllowed;
    projectperlicense!.current!.value = license.projectPerLicense;
    description!.current!.value = license.description;
    licenseValidTill!.current!.value = license.licenseValidTill;

    if (
      !(
        license.discountValidTill == null ||
        license.discountValidTill == undefined
      )
    ) {
      discountvalid!.current!.value = license.discountValidTill.slice(0, 10);
    }
  }, []);

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");
    e.target.value = numericValue;
  };

  const editLicense = async () => {
    const LicenseScheme = z
      .object({
        id: z.number({
          required_error: "License Id is required.",
          invalid_type_error: "License Id should be valid.",
        }),
        name: z.string().nonempty("License Name is required."),
        licenseType: z.string().nonempty("License Type is required."),
        description: z.string().nonempty("License description is required."),
        licenseValidTill: z.number({
          required_error: "License valid till is required.",
          invalid_type_error: "License valid till should be valid number.",
        }),
        paymentAmount: z.number({
          required_error: "License Payment Amount is required.",
          invalid_type_error: "License Payment Amount should be valid.",
        }),
        discountAmount: z.number({
          required_error: "License Discount Amount is required.",
          invalid_type_error: "License Discount Amount should be valid.",
        }),
        discountValidTill: z.date({
          required_error: "Discount Till Valid is required",
          invalid_type_error: "Discount Till Valid Should be a valid date",
        }),
        questionAllowed: z.number({
          required_error: "License Question Allowed is required.",
          invalid_type_error: "License Question Allowed should be valid.",
        }),
        projectPerLicense: z.number({
          required_error: "Project Per License is required.",
          invalid_type_error: "Project Per License should be valid.",
        }),
      })
      .strict();

    type LicenseScheme = z.infer<typeof LicenseScheme>;

    const licenseScheme: LicenseScheme = {
      id: license.id,
      name: lName!.current!.value,
      licenseType: lType!.current!.value,
      description: description!.current!.value,
      licenseValidTill: parseInt(licenseValidTill!.current!.value),
      paymentAmount: parseInt(paymentamount!.current!.value),
      discountAmount: parseInt(discountamount!.current!.value),
      discountValidTill: new Date(discountvalid!.current!.value),
      questionAllowed: parseInt(questionallowed!.current!.value),
      projectPerLicense: parseInt(projectperlicense!.current!.value),
    };

    const parsed = LicenseScheme.safeParse(licenseScheme);

    if (parsed.success) {
      const data = await ApiCall({
        query: `
                    mutation updateLicenseById($updateLicenseInput:UpdateLicenseInput!){
                        updateLicenseById(updateLicenseInput:$updateLicenseInput){
                          id
                        }
                      }
                  `,
        veriables: {
          updateLicenseInput: licenseScheme,
        },
        headers: { authorization: `Bearer ${token}` },
      });

      if (!data.status) {
        toast.error(data.message, { theme: "light" });
      } else {
        navigator("/home/license/");
      }
    } else {
      toast.error(parsed.error.errors[0].message, { theme: "light" });
    }
  };
  return (
    <>
      <div className="grow w-full  p-4  ">
        <h1 className="text-white font-medium text-2xl">Edit License</h1>
        <div className="bg-gray-400 w-full h-[2px] my-2"></div>

        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          License Name
        </h2>
        <input
          ref={lName}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="Enter License Name"
        />
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          License Type
        </h2>

        <select
          ref={lType}
          defaultValue={"0"}
          className="px-4 bg-primary-700 fill-none outline-none border-2 border-white text-white py-2 w-96 my-2"
        >
          <option value="0" className=" text-white text-lg " disabled>
            Select License Type
          </option>
          <option className=" text-white text-lg" value="FREE">
            FREE
          </option>
          <option className=" text-white text-lg" value="BUSINESS">
            BUSINESS
          </option>
          <option className=" text-white text-lg" value="PREMIUM">
            PREMIUM
          </option>
          <option className=" text-white text-lg" value="PLATINUM">
            PLATINUM
          </option>
        </select>
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          License Description
        </h2>
        <input
          ref={description}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="Enter License Description"
        />

        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          License validity (In Days)
        </h2>
        <input
          ref={licenseValidTill}
          disabled
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="Enter License Till Valid"
          onInput={handleNumberInput}
        />

        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Payment License Amount
        </h2>
        <input
          ref={paymentamount}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="Enter License Amount"
          onInput={handleNumberInput}
        />
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          License Discount Amount
        </h2>
        <input
          ref={discountamount}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="License Discount Amount"
          onInput={handleNumberInput}
        />
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Discount Valid Till Date
        </h2>
        <input
          type="date"
          ref={discountvalid}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="Enter License Discount Valid Till Date"
        />
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Question Allowed
        </h2>
        <input
          ref={questionallowed}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="Enter Question Allowed In This License"
          onInput={handleNumberInput}
        />
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Project Per License
        </h2>
        <input
          ref={projectperlicense}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="Enter License Project Per License"
          onInput={handleNumberInput}
        />
        <div></div>
        <button
          onClick={editLicense}
          className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded mt-4"
        >
          SUBMIT
        </button>
      </div>
    </>
  );
};

export default AddLicense;
