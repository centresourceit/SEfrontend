import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

import { z } from "zod";
import { userPrefs } from "~/cookies";
import type { imageReture } from "~/services/api";
import { ApiCall, UploadFile } from "~/services/api";

export async function loader({ params, request }: LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  return json({ token: cookie.token, userId: cookie.id });
}

const AddComapany: React.FC = (): JSX.Element => {
  const userId = useLoaderData().userId;
  const token = useLoaderData().token;
  const navigator = useNavigate();
  const [logo, setLogo] = useState<File | null>(null);
  const cLogo = useRef<HTMLInputElement>(null);
  const cName = useRef<HTMLInputElement>(null);
  const cWebsite = useRef<HTMLInputElement>(null);
  const cEmail = useRef<HTMLInputElement>(null);
  const cNumber = useRef<HTMLInputElement>(null);
  const cDesciption = useRef<HTMLTextAreaElement>(null);
  const cAddress = useRef<HTMLTextAreaElement>(null);

  const handleLogoChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    let file_size = parseInt(
      (value!.target.files![0].size / 1024 / 1024).toString()
    );
    if (file_size < 4) {
      if (value!.target.files![0].type.startsWith("image/")) {
        setLogo((val) => value!.target.files![0]);
      } else {
        toast.error("Please select an image file.", { theme: "light" });
      }
    } else {
      toast.error("Image file size must be less then 4 mb", { theme: "light" });
    }
  };

  const addComapany = async () => {
    // if (logo == null) return toast.error("Select company Logo", { theme: "light" });

    const CompanyScheme = z
      .object({
        name: z.string().nonempty("Company Name is required."),
        website: z.string().nonempty("Website Url is required."),
        email: z
          .string()
          .nonempty("Email is required.")
          .email("Enter a valid email."),
        logo: z.string().nonempty("Please select an image."),
        ctoContact: z
          .string()
          .nonempty("Please Enter your mobile number.")
          .min(10, "Contact Number should be minmum 10 digit"),
        address: z.string().nonempty("Address is required."),
        description: z.string().nonempty("Company Description is required"),
        image: z.any(),
      })
      .strict();

    type CompanyScheme = z.infer<typeof CompanyScheme>;

    let image: imageReture;
    if (logo != null) {
      image = await UploadFile(logo);
      if (!image.status)
        return toast.error("Unable to upload logo", { theme: "light" });
    }

    const companyScheme: CompanyScheme = {
      name: cName!.current!.value,
      website: cWebsite!.current!.value,
      email: cEmail!.current!.value,
      ctoContact: cNumber!.current!.value,
      description: cDesciption!.current!.value,
      address: cAddress!.current!.value,
      logo: logo != null ? image!.data!.toString() : "0",
    };

    const parsed = CompanyScheme.safeParse(companyScheme);
    if (parsed.success) {
      const data = await ApiCall({
        query: `
                mutation createCompany($createCompanyInput:CreateCompanyInput!){
                    createCompany(createCompanyInput:$createCompanyInput){
                      id
                    }
                  }
                `,
        veriables: {
          createCompanyInput: companyScheme,
        },
        headers: { authorization: `Bearer ${token}` },
      });

      if (!data.status) {
        toast.error(data.message, { theme: "light" });
      } else {
        const user = await ApiCall({
          query: `
                    mutation updateUserById($updateUserInput:UpdateUserInput!){
                        updateUserById(updateUserInput:$updateUserInput){
                          id
                        }
                      }
                    `,
          veriables: {
            updateUserInput: {
              id: Number(userId),
              companyId: data.data.createCompany.id,
            },
          },
          headers: { authorization: `Bearer ${token}` },
        });

        if (!data.status) {
          toast.error(data.message, { theme: "light" });
        } else {
          navigator("/home");
        }
      }
    } else {
      toast.error(parsed.error.errors[0].message, { theme: "light" });
    }
  };
  return (
    <>
      <div className="grow w-full  p-4  ">
        <h1 className="text-white font-medium text-2xl">Add New Company</h1>
        <div className="bg-gray-400 w-full h-[2px] my-2"></div>
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Logo
        </h2>
        {logo != null ? (
          <div className="my-4">
            <img
              src={URL.createObjectURL(logo!)}
              alt="logo"
              className="w-80 rounded-md"
            />
          </div>
        ) : null}
        <button
          onClick={() => cLogo.current?.click()}
          className="text-white font-semibold text-md py-1 my-2 inline-block px-4 rounded-md bg-green-500"
        >
          {logo == null ? "Add Logo" : "Change Logo"}
        </button>
        <div className="hidden">
          <input
            type="file"
            ref={cLogo}
            accept="image/*"
            onChange={handleLogoChange}
          />
        </div>
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Company Name
        </h2>
        <input
          ref={cName}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="Enter Company Name"
        />
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Website
        </h2>
        <input
          ref={cWebsite}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="Enter Company website"
        />
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Email
        </h2>
        <input
          ref={cEmail}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="Enter Email"
        />
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Contact Number
        </h2>
        <input
          ref={cNumber}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="Enter Contact Number"
        />
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Description
        </h2>
        <textarea
          ref={cDesciption}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300 resize-none h-28"
          placeholder="Enter Company Description"
        ></textarea>
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Address
        </h2>
        <textarea
          ref={cAddress}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300 resize-none h-28"
          placeholder="Enter Company Address"
        ></textarea>
        <div></div>
        <button
          onClick={addComapany}
          className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded mt-4"
        >
          Create
        </button>
      </div>
    </>
  );
};

export default AddComapany;
