import { Form, Link, useNavigate } from "@remix-run/react";
import { useRef, useState } from "react";
import { z } from "zod";

import { toast } from "react-toastify";
import { ApiCall } from "~/services/api";
import { Fa6SolidEye, Fa6SolidEyeSlash, Fa6SolidUser } from "./icons/Icons";



export default function Register(): JSX.Element {
  const navitgator = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRePassword, setShowRePassword] = useState<boolean>(false);

  const nextButton = useRef<HTMLButtonElement>(null);

  const emaliRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const rePassRef = useRef<HTMLInputElement>(null);

  const iref = useRef<HTMLInputElement>(null);
  const eref = useRef<HTMLInputElement>(null);
  const rref = useRef<HTMLInputElement>(null);
  const tref = useRef<HTMLInputElement>(null);

  const handelPassword = () => {
    setShowPassword((val) => !val);
  };
  const handelRePassword = () => {
    setShowRePassword((val) => !val);
  };

  const submit = async () => {
    const RegisterScheme = z
      .object({
        email: z
          .string()
          .nonempty("Email is required.")
          .email("Enter a valid email."),
        password: z
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
        (val) => {
          if (val.password == val.repassword) {
            return true;
          }
        },
        { message: "Password and Re-Password should be the same" }
      );

    type RegisterScheme = z.infer<typeof RegisterScheme>;

    const register: RegisterScheme = {
      email: emaliRef!.current!.value,
      password: passRef!.current!.value,
      repassword: rePassRef!.current!.value,
    };

    const parsed = RegisterScheme.safeParse(register);
    if (parsed.success) {
      const data = await ApiCall({
        query: `
        mutation signup($signUpUser:SignUpUserInput!){
          signup(signUpUserInput:$signUpUser){
            id,
            email,
            role,
            token
          }
        }
      `,
        veriables: {
          signUpUser: { email: register.email, password: register.password },
        },
      });
      if (!data.status) {
        toast.error(data.message, { theme: "light" });
      } else {
        iref!.current!.value = data.data.signup!.id;
        eref!.current!.value = data.data.signup!.email;
        rref!.current!.value = data.data.signup!.role;
        tref!.current!.value = data.data.signup!.token;
        nextButton.current!.click();
      }
    } else {
      toast.error(parsed.error.errors[0].message, { theme: "light" });
    }
  };

  return (
    <>
      <section className="h-screen w-full relative">
        <img
          src="/images/bg/bg4.png"
          alt="error"
          className="scale-x-[-1] scale-y-[-1] absolute top-0 left-0 w-full h-screen object-cover object-center"
        />
        <div className="grid place-items-center bg-[#181136] h-screen w-full">
          <div className="z-50 w-80">
            <h2 className="text-white text-center text-3xl font-semibold my-4">
              Register
            </h2>
            <div className="border-b-2 border-gray-200 py-1 flex items-center">
              <div
                className="text-white font-bold text-xl mr-4"
              >
                <Fa6SolidUser></Fa6SolidUser>
              </div>
              <input
                ref={emaliRef}
                type="text"
                placeholder="Email"
                className="bg-transparent outline-none border-none fill-none text-white py-2 grow"
              />
            </div>
            <div className="border-b-2 border-gray-200 py-1 mt-4 flex items-center">
              <div
                className="text-white font-bold text-xl mr-4"
                onClick={handelPassword}
              >
                {showPassword ? <Fa6SolidEye></Fa6SolidEye> : <Fa6SolidEyeSlash></Fa6SolidEyeSlash>}
              </div>
              <input
                ref={passRef}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="bg-transparent outline-none border-none fill-none text-white py-2 grow"
              />
            </div>
            <div className="border-b-2 border-gray-200 py-1 mt-4 flex items-center">
              <div
                className="text-white font-bold text-xl mr-4"
                onClick={handelRePassword}
              >
                {showRePassword ? <Fa6SolidEye></Fa6SolidEye> : <Fa6SolidEyeSlash></Fa6SolidEyeSlash>}
              </div>
              <input
                ref={rePassRef}
                type={showRePassword ? "text" : "password"}
                placeholder="Re-Password"
                className="bg-transparent outline-none border-none fill-none text-white py-2 grow"
              />
            </div>
            <button
              onClick={submit}
              className="text-[#181136] bg-[#54edec] py-2 px-6 text-md font-medium rounded-full w-full mt-6"
            >
              Register
            </button>
            <h5 className="text-white text-center mt-8">
              Already have an account?{" "}
              <Link to={"/login"} className="text-[#54edec]">
                Sign In
              </Link>
            </h5>
            <div className="text-center mt-4">
              <Link className="text-cyan-500 hover:underline" to={"/"}>
                Go to home
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden">
          <Form method="post">
            <input type="hidden" name="id" ref={iref} />
            <input type="hidden" name="token" ref={tref} />
            <input type="hidden" name="email" ref={eref} />
            <input type="hidden" name="role" ref={rref} />
            <button ref={nextButton} name="submit">
              Submit
            </button>
          </Form>
        </div>
      </section>
    </>
  );
}
