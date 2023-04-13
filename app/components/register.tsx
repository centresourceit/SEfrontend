import { faEye, faEyeSlash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "@remix-run/react";
import { useRef, useState } from "react";
import { z } from "zod";

import { ToastContainer, toast } from "react-toastify";

export default function Register(): JSX.Element {
  const navitgator = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRePassword, setShowRePassword] = useState<boolean>(false);

  const emaliRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const rePassRef = useRef<HTMLInputElement>(null);

  const handelPassword = () => {
    setShowPassword((val) => !val);
  };
  const handelRePassword = () => {
    setShowRePassword((val) => !val);
  };

  const submit = () => {
    const RegisterScheme = z
      .object({
        email: z
          .string()
          .nonempty("Email is required.")
          .email("Enter a valid email."),
        password: z
          .string()
          .nonempty("Password is required")
          .min(8, "Password should be have atlest 8 character.")
          .regex(
            /[A-Z]/,
            "Password should be contain atleast one Capital letter."
          )
          .regex(
            /[a-z]/,
            "Password should be contain atleast one lower letter."
          )
          .regex(/\d/, "Password should be contain atleast one degit letter.")
          .regex(
            /[@$!%*?&]/,
            "Password should be contain atleast one specil character [@$!%*?&]."
          ),
        repassword: z
          .string()
          .nonempty("Re-Password is required")
          .min(8, "Re-Password should be have atlest 8 character.")
          .regex(
            /[A-Z]/,
            "Re-Password should be contain atleast one Capital letter."
          )
          .regex(
            /[a-z]/,
            "Re-Password should be contain atleast one lower letter."
          )
          .regex(
            /\d/,
            "Re-Password should be contain atleast one degit letter."
          )
          .regex(
            /[@$!%*?&]/,
            "Re-Password should be contain atleast one specil character [@$!%*?&]."
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
      navitgator("/home");
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
            <div className="border-b-2 border-gray-200 py-1">
              <FontAwesomeIcon
                className="text-white fotn-bold text-xl mr-4"
                icon={faUser}
              ></FontAwesomeIcon>
              <input
                ref={emaliRef}
                type="text"
                placeholder="Email"
                className="bg-transparent outline-none border-none fill-none text-white"
              />
            </div>
            <div className="border-b-2 border-gray-200 py-1 mt-4">
              <FontAwesomeIcon
                className="text-white fotn-bold text-xl mr-4"
                icon={showPassword ? faEye : faEyeSlash}
                onClick={handelPassword}
              ></FontAwesomeIcon>
              <input
                ref={passRef}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="bg-transparent outline-none border-none fill-none text-white"
              />
            </div>
            <div className="border-b-2 border-gray-200 py-1 mt-4">
              <FontAwesomeIcon
                className="text-white fotn-bold text-xl mr-4"
                icon={showRePassword ? faEye : faEyeSlash}
                onClick={handelRePassword}
              ></FontAwesomeIcon>
              <input
                ref={rePassRef}
                type={showRePassword ? "text" : "password"}
                placeholder="Re-Password"
                className="bg-transparent outline-none border-none fill-none text-white"
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
      </section>
      <ToastContainer></ToastContainer>
    </>
  );
}
