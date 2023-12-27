import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { z } from "zod";
import { userPrefs } from "~/cookies";
import { ApiCall, UploadFile } from "~/services/api";

export async function loader({ params, request }: LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  if (cookie.role != "ADMIN") {
    return redirect("/home");
  }
  const data = await ApiCall({
    query: `
        query getAllCompliancesById($id:Int!){
            getAllCompliancesById(id:$id){
                id,
                name,
                logo,
                description,
                LearnMoreLink
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
    compliance: data.data.getAllCompliancesById,
  });
}

const AddCompliance: React.FC = (): JSX.Element => {
  const loader = useLoaderData();

  const token = loader.token;
  const navigator = useNavigate();

  const compliance = loader.compliance;

  const cName = useRef<HTMLInputElement>(null);
  const cDesciption = useRef<HTMLTextAreaElement>(null);
  const cLink = useRef<HTMLInputElement>(null);

  const [logo, setLogo] = useState<File | null>(null);
  const cLogo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    cName!.current!.value = compliance.name;
    cDesciption!.current!.value = compliance.description;
    cLink!.current!.value = compliance.LearnMoreLink;
  }, []);

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

  const editCompliance = async () => {
    const ComplianceScheme = z
      .object({
        name: z.string().nonempty("Compliance Name is required."),
        description: z.string().nonempty("Compliance Description is required"),
        LearnMoreLink: z.string().nonempty("Compliance url is required"),
        logo: z.string().nonempty("Please select an image."),
      })
      .strict();

    type ComplianceScheme = z.infer<typeof ComplianceScheme>;

    let imageurl: string = "";

    if (logo != null) {
      const image = await UploadFile(logo);
      if (!image.status)
        return toast.error("Unable to upload logo", { theme: "light" });
      imageurl = image.data!.toString();
    }

    const complianceScheme: ComplianceScheme = {
      name: cName!.current!.value,
      description: cDesciption!.current!.value,
      LearnMoreLink: cLink!.current!.value,
      logo: logo == null ? compliance.logo : imageurl,
    };

    const parsed = ComplianceScheme.safeParse(complianceScheme);

    if (parsed.success) {
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
            id: compliance.id,
            name: complianceScheme.name,
            description: complianceScheme.description,
            LearnMoreLink: complianceScheme.LearnMoreLink,
            logo: complianceScheme.logo,
          },
        },
        headers: { authorization: `Bearer ${token}` },
      });

      if (!data.status) {
        toast.error(data.message, { theme: "light" });
      } else {
        cName!.current!.value = "";
        cDesciption!.current!.value = "";
        cLink!.current!.value = "";
        navigator("/home/compliance/");
      }
    } else {
      toast.error(parsed.error.errors[0].message, { theme: "light" });
    }
  };
  return (
    <>
      <div className="grow w-full  p-4  ">
        <h1 className="text-white font-medium text-2xl">Edit Compliance</h1>
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
        ) : (
          <div className="my-4">
            <img src={compliance.logo} alt="logo" className="w-80 rounded-md" />
          </div>
        )}
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
          Compliance Name
        </h2>
        <input
          ref={cName}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="Enter Compliance Name"
        />
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Compliance Description
        </h2>
        <textarea
          ref={cDesciption}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300 resize-none h-28"
          placeholder="Enter Compliance Description"
        ></textarea>
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Compliance Url
        </h2>
        <input
          ref={cLink}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="Enter Compliance Name"
        />
        <div></div>
        <button
          onClick={editCompliance}
          className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded mt-4"
        >
          SUBMIT
        </button>
      </div>
    </>
  );
};

export default AddCompliance;
