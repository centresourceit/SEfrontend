import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useRef } from "react";
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
  return json({ token: cookie.token, userId: cookie.id });
}

const AddPrinciple: React.FC = (): JSX.Element => {
  const token = useLoaderData().token;
  const navigator = useNavigate();

  const pName = useRef<HTMLInputElement>(null);
  const pDesciption = useRef<HTMLTextAreaElement>(null);

  const addPrinciple = async () => {
    const PrincipleScheme = z
      .object({
        name: z.string().nonempty("Principle Name is required."),
        description: z.string().nonempty("Principle Description is required"),
      })
      .strict();

    type PrincipleScheme = z.infer<typeof PrincipleScheme>;

    const principleScheme: PrincipleScheme = {
      name: pName!.current!.value,
      description: pDesciption!.current!.value,
    };

    const parsed = PrincipleScheme.safeParse(principleScheme);

    if (parsed.success) {
      const data = await ApiCall({
        query: `
                mutation createPrinciple($createPrincipleInput:CreatePrincipleInput!){
                    createPrinciple(createPrincipleInput:$createPrincipleInput){
                      id
                    }
                  }
              `,
        veriables: {
          createPrincipleInput: {
            name: principleScheme.name,
            description: principleScheme.description,
          },
        },
        headers: { authorization: `Bearer ${token}` },
      });

      if (!data.status) {
        toast.error(data.message, { theme: "light" });
      } else {
        pName!.current!.value = "";
        pDesciption!.current!.value = "";
        navigator("/home/principle/");
      }
    } else {
      toast.error(parsed.error.errors[0].message, { theme: "light" });
    }
  };
  return (
    <>
      <div className="grow w-full  p-4  ">
        <h1 className="text-white font-medium text-2xl">Add New Principle</h1>
        <div className="bg-gray-400 w-full h-[2px] my-2"></div>
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Principle Name
        </h2>
        <input
          ref={pName}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
          placeholder="Enter Principle Name"
        />
        <h2 className="text-white font-semibold text-md">
          <span className="text-green-500 pr-2">&#x2666;</span>
          Principle Description
        </h2>
        <textarea
          ref={pDesciption}
          className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300 resize-none h-28"
          placeholder="Enter Principle Description"
        ></textarea>
        <div></div>
        <button
          onClick={addPrinciple}
          className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded mt-4"
        >
          SUBMIT
        </button>
      </div>
    </>
  );
};

export default AddPrinciple;
