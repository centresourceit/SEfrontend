import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useRef } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";


export async function loader(params: LoaderArgs) {
    const id = params.params.id;
    const cookieHeader = params.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    return json({
        token: cookie.token,
        userid: cookie.id
    });
}
const ChnagePassword: React.FC = (): JSX.Element => {
    const token = useLoaderData().token;
    const userid = useLoaderData().userid;
    const oldPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);
    const rePasswordRef = useRef<HTMLInputElement>(null);
    const navigator = useNavigate();

    const updatepassword = async () => {
        const ChangeScheme = z
            .object({
                oldpassword: z
                    .string()
                    .nonempty("Old password is required."),
                newpassword: z
                    .string()
                    .nonempty("Password is required")
                    .min(8, "Password should be have atleast 8 character.")
                    .regex(
                        /[A-Z]/,
                        "Password should be contain atleast one Capital letter."
                    )
                    .regex(
                        /[a-z]/,
                        "Password should be contain atleast one lower letter."
                    )
                    .regex(/\d/, "Password should be contain atleast one digit letter.")
                    .regex(
                        /[@$!%*?&]/,
                        "Password should be contain atleast one special character [@$!%*?&]."
                    ),
                repassword: z
                    .string()
                    .nonempty("Re-Password is required")
                    .min(8, "Re-Password should be have atleast 8 character.")
                    .regex(
                        /[A-Z]/,
                        "Re-Password should be contain atleast one Capital letter."
                    )
                    .regex(
                        /[a-z]/,
                        "Re-Password should be contain atleast one lower case letter."
                    )
                    .regex(
                        /\d/,
                        "Re-Password should be contain atleast one digit letter."
                    )
                    .regex(
                        /[@$!%*?&]/,
                        "Re-Password should be contain atleast one special character [@$!%*?&]."
                    ),
            })
            .strict()
            .refine(
                (val: any) => {
                    if (val.newpassword == val.repassword) {
                        return true;
                    }
                },
                { message: "Password and Re-Password should be the same" }
            );

        type ChangeScheme = z.infer<typeof ChangeScheme>;

        const changepassword: ChangeScheme = {
            oldpassword: oldPasswordRef!.current!.value,
            newpassword: newPasswordRef!.current!.value,
            repassword: rePasswordRef!.current!.value,
        };

        const parsed = ChangeScheme.safeParse(changepassword);

        if (parsed.success) {
            const changepass = await ApiCall({
                query: `
                mutation changepassword($changePasswordInput:ChangePasswordInput!){
                    changepassword(changePasswordInput:$changePasswordInput)
                  }
                  `,
                veriables: {
                    changePasswordInput: {
                        id: parseInt(userid),
                        oldpassword: changepassword.oldpassword,
                        newpassword: changepassword.newpassword,
                        repassword: changepassword.repassword
                    }
                },
                headers: { authorization: `Bearer ${token}` },
            });

            if (changepass.status) {
                toast.success("Password changed successfully.", { theme: "light" });
                navigator(-1);
            } else {
                toast.error(changepass.message, { theme: "light" });
            }
        } else {
            toast.error(parsed.error.errors[0].message, { theme: "light" });
        }
    }

    return (
        <div className="grow  p-4 w-full">
            <h1 className="text-secondary font-medium text-3xl">Change Password</h1>
            <div className="w-full bg-secondary h-[1px] my-2"></div>
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Old Password
            </h2>
            <input
                ref={oldPasswordRef}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter your old password"
            />
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                New Password
            </h2>
            <input
                ref={newPasswordRef}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter your password"
            />
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Re-Password
            </h2>
            <input
                ref={rePasswordRef}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter Re-Password"
            />
            <div>
                <button
                    onClick={updatepassword}
                    className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded mt-4"
                >
                    UPDATE
                </button>
            </div>
        </div>
    );
}
export default ChnagePassword;