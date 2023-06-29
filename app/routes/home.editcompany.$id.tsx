import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import styles from "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { userPrefs } from "~/cookies";
import { ApiCall, UploadFile } from "~/services/api";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export async function loader({ params, request }: LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);

    const data = await ApiCall({
        query: `
            query getCompanyById($id:Int!){
                getCompanyById(id:$id){
                    id,
                    name,
                    logo,
                    website,
                    email,
                    ctoContact,
                    description,
                    address
                }
            }
            `,
        veriables: {
            id: parseInt(params.id!)
        },
        headers: { authorization: `Bearer ${cookie.token}` },
    });
    return json({ token: cookie.token, userId: cookie.id, company: data.data.getCompanyById });
}

const AddComapany: React.FC = (): JSX.Element => {
    const userId = useLoaderData().userId;
    const token = useLoaderData().token;
    const navigator = useNavigate();

    const company = useLoaderData().company;


    const [logo, setLogo] = useState<File | null>(null);
    const cLogo = useRef<HTMLInputElement>(null);
    const cName = useRef<HTMLInputElement>(null);
    const cWebsite = useRef<HTMLInputElement>(null);
    const cEmail = useRef<HTMLInputElement>(null);
    const cNumber = useRef<HTMLInputElement>(null);
    const cDesciption = useRef<HTMLTextAreaElement>(null);
    const cAddress = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        cName!.current!.value = company.name;
        cWebsite!.current!.value = company.website;
        cEmail!.current!.value = company.email;
        cNumber!.current!.value = company.ctoContact;
        cDesciption!.current!.value = company.description;
        cAddress!.current!.value = company.address;
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
    }

    const addComapany = async () => {
        const CompanyScheme = z
            .object({
                id: z
                    .number({ required_error: "Company id is required.", invalid_type_error: "Enter a valid company id." }),
                name: z
                    .string()
                    .nonempty("Company Name is required."),
                website: z
                    .string()
                    .nonempty("Website Url is required."),
                email: z
                    .string()
                    .nonempty("Email is required.")
                    .email("Enter a valid email."),
                logo: z
                    .string()
                    .nonempty("Please select an image."),
                ctoContact: z
                    .string()
                    .nonempty("Please Enter your mobile number.")
                    .min(10, "Contact Number should be minmum 10 digit"),
                address: z
                    .string()
                    .nonempty("Address is required."),
                description: z
                    .string()
                    .nonempty("Company Description is required"),
                image: z
                    .any()
            })
            .strict();

        type CompanyScheme = z.infer<typeof CompanyScheme>;

        let imageurl: string = "";

        if (logo != null) {
            const image = await UploadFile(logo);
            if (!image.status) return toast.error("Unable to upload logo", { theme: "light" });
            imageurl = image.data!.toString();
        }

        const companyScheme: CompanyScheme = {
            id: company.id,
            name: cName!.current!.value,
            website: cWebsite!.current!.value,
            email: cEmail!.current!.value,
            ctoContact: cNumber!.current!.value,
            description: cDesciption!.current!.value,
            address: cAddress!.current!.value,
            logo: logo == null ? company.logo : imageurl
        };


        const parsed = CompanyScheme.safeParse(companyScheme);
        if (parsed.success) {
            const data = await ApiCall({
                query: `
                mutation updateCompanyById($updateCompanyInput:UpdateCompanyInput!){
                    updateCompanyById(updateCompanyInput:$updateCompanyInput){
                      id
                    }
                  }
                `,
                veriables: {
                    updateCompanyInput: companyScheme,
                },
                headers: { authorization: `Bearer ${token}` },
            });


            if (!data.status) {
                toast.error(data.message, { theme: "light" });
            } else {
                navigator("/home/company/");
            }
        }
        else { toast.error(parsed.error.errors[0].message, { theme: "light" }); }
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
                {logo != null ?
                    <div className="my-4">
                        <img src={URL.createObjectURL(logo!)} alt="logo" className="w-80 rounded-md" />
                    </div>
                    :
                    <div className="my-4">
                        <img src={company.logo} alt="logo" className="w-80 rounded-md" />
                    </div>
                }
                <button onClick={() => cLogo.current?.click()} className="text-white font-semibold text-md py-1 my-2 inline-block px-4 rounded-md bg-green-500">{logo == null ? "Add Logo" : "Change Logo"}</button>
                <div className="hidden">
                    <input type="file" ref={cLogo} accept="image/*" onChange={handleLogoChange} />
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
                    SUBMIT
                </button>
            </div>
            <ToastContainer></ToastContainer>
        </>
    );
}

export default AddComapany;