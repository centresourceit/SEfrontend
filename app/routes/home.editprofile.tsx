import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { userPrefs } from "~/cookies";
import { z } from "zod";
import { ApiCall } from "~/services/api";

export async function loader(params: LoaderArgs) {

    const cookieHeader = params.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    return json({
        user: cookie
    })
}
const EditProfile = () => {
    const loader = useLoaderData();
    const user = loader.user;
    const [userdata, setUserData] = useState<any>();

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLTextAreaElement>(null);
    const contactRef = useRef<HTMLInputElement>(null);
    const professionRef = useRef<HTMLInputElement>(null);

    const init = async () => {
        const data = await ApiCall({
            query: `
            query getUserById($id:Int!){
                getUserById(id:$id){
                  id,
                  name,
                  email,
                  contact,
                  companyId,
                  address,
                  profession,
                  role,
                  company{
                    id,
                    name,
                    logo,
                    website,
                    email,
                    ctoContact,
                    description,
                    address,
                    status
                  }
                }
              }
          `,
            veriables: {
                id: parseInt(user.id)
            },
            headers: { authorization: `Bearer ${user.token}` },
        });
        if (data.status) {
            nameRef!.current!.value = data.data.getUserById.name;
            emailRef!.current!.value = data.data.getUserById.email;
            addressRef!.current!.value = data.data.getUserById.address;
            contactRef!.current!.value = data.data.getUserById.contact;
            professionRef!.current!.value = data.data.getUserById.profession;
            setUserData((val: any) => data.data.getUserById);
        }
        else {
            toast.error(data.message, { theme: "light" });
        }
    }

    useEffect(() => {
        init();
    }, []);


    const updateuser = async () => {
        const UserScheme = z
            .object({
                name: z
                    .string()
                    .nonempty("Name is required."),
                contact: z
                    .string()
                    .nonempty("Contact Number is required"),
                address: z
                    .string()
                    .nonempty("Address url is required"),
                profession: z
                    .string()
                    .nonempty("Profession url is required"),
            })
            .strict();
        type UserScheme = z.infer<typeof UserScheme>;

        const userScheme: UserScheme = {
            name: nameRef!.current!.value,
            contact: contactRef!.current!.value,
            address: addressRef!.current!.value,
            profession: professionRef!.current!.value,
        };

        const parsed = UserScheme.safeParse(userScheme);
        if (parsed.success) {
            const data = await ApiCall({
                query: `
                mutation updateUserById($updateUserInput:UpdateUserInput!){
                    updateUserById(updateUserInput:$updateUserInput){
                      id
                    }
                  }
              `,
                veriables: {
                    updateUserInput: {
                        id: parseInt(user.id),
                        ...userScheme
                    }
                },
                headers: { authorization: `Bearer ${user.token}` },
            });

            if (!data.status) {
                toast.error(data.message, { theme: "light" });
            } else {
                toast.success("User updated successfully.", { theme: "light" });
                await init();
            }
        }
        else { toast.error(parsed.error.errors[0].message, { theme: "light" }); }


    }

    return (
        <>
            <div className="grow  p-4 w-full">
                <h1 className="text-secondary font-medium text-3xl">
                    Edit your profile
                </h1>
                <div className="w-full bg-secondary h-[1px] my-2"></div>
                <h2 className="text-white font-semibold text-md">
                    <span className="text-green-500 pr-2">&#x2666;</span>
                    Name
                </h2>
                <input
                    ref={nameRef}
                    className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                    placeholder="Enter your name"
                />
                <h2 className="text-white font-semibold text-md">
                    <span className="text-green-500 pr-2">&#x2666;</span>
                    Contact
                </h2>
                <input
                    ref={contactRef}
                    className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                    placeholder="Enter your contact number"
                />
                <h2 className="text-white font-semibold text-md">
                    <span className="text-green-500 pr-2">&#x2666;</span>
                    Email
                </h2>
                <input
                    ref={emailRef}
                    className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                    disabled
                    placeholder="Enter your Email"
                />
                <h2 className="text-white font-semibold text-md">
                    <span className="text-green-500 pr-2">&#x2666;</span>
                    Address
                </h2>
                <textarea
                    ref={addressRef}
                    className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300 resize-none h-28"
                    placeholder="Enter your address"
                ></textarea>
                <h2 className="text-white font-semibold text-md">
                    <span className="text-green-500 pr-2">&#x2666;</span>
                    Profession
                </h2>
                <input
                    ref={professionRef}
                    className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                    placeholder="Enter your profession"
                />
                <div>
                    <button
                        onClick={updateuser}
                        className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded mt-4"
                    >
                        UPDATE
                    </button>
                </div>
            </div>
        </>
    );
};

export default EditProfile;