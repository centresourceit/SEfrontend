import { Form, Link } from "@remix-run/react";
import { useRef, useState } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import { ApiCall } from "~/services/api";
import { Fa6SolidEye, Fa6SolidEyeSlash, Fa6SolidUser } from "./icons/Icons";

export default function Login(): JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const nextButton = useRef<HTMLButtonElement>(null);

  const iref = useRef<HTMLInputElement>(null);
  const eref = useRef<HTMLInputElement>(null);
  const rref = useRef<HTMLInputElement>(null);
  const tref = useRef<HTMLInputElement>(null);

  const emaliRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const submit = async () => {
    const LoginScheme = z
      .object({
        email: z
          .string()
          .nonempty("Email is required.")
          .email("Enter a valid email."),
        password: z
          .string()
          .nonempty("Password is required")
          .min(8, "Password should be have atlest 8 character."),
      })
      .strict();

    type LoginScheme = z.infer<typeof LoginScheme>;

    const login: LoginScheme = {
      email: emaliRef!.current!.value,
      password: passRef!.current!.value,
    };

    const parsed = LoginScheme.safeParse(login);
    if (parsed.success) {
      const data = await ApiCall({
        query: `
        query signin($loginUserInput:LoginUserInput!){
          signin(loginUserInput:$loginUserInput){
            token,
            id,
            email,
            role
          }
        }
      `,
        veriables: { loginUserInput: login },
      });
      if (!data.status) {
        toast.error(data.message, { theme: "light" });
      } else {
        iref!.current!.value = data.data.signin!.id;
        eref!.current!.value = data.data.signin!.email;
        rref!.current!.value = data.data.signin!.role;
        tref!.current!.value = data.data.signin!.token;
        nextButton.current!.click();
      }
    } else {
      toast.error(parsed.error.errors[0].message, { theme: "light" });
    }
  };
  const mail = useRef<HTMLInputElement>(null);
  const [box, setBox] = useState(false);

  const forgetpassword = async () => {
    const ForgetPasswordScheme = z
      .object({
        email: z
          .string()
          .nonempty("Email is required.")
          .email("Enter a valid email."),
      })
      .strict();

    type ForgetPasswordScheme = z.infer<typeof ForgetPasswordScheme>;

    const forgetPasswordScheme: ForgetPasswordScheme = {
      email: mail!.current!.value,
    };

    const parsed = ForgetPasswordScheme.safeParse(forgetPasswordScheme);
    if (parsed.success) {
      const forgetpassword = await ApiCall({
        query: `
        mutation forgetpassword($mail:String!){
          forgetpassword(mail:$mail)
          }
          `,
        veriables: {
          mail: mail!.current!.value,
        },
      });

      if (forgetpassword.status) {
        toast.success("E-Mail Send successfully, Check you mail.", {
          theme: "light",
        });
        setBox((val: boolean) => false);
      } else {
        toast.error(forgetpassword.message, { theme: "light" });
      }
    } else {
      toast.error(parsed.error.errors[0].message, { theme: "light" });
    }
  };

  return (
    <>
      <section className="h-screen w-full relative">
        <img
          src="/images/bg/bg5.png"
          alt="error"
          className="scale-x-[-1] scale-y-[-1] absolute top-0 left-0 w-full h-screen object-cover object-center"
        />
        <div className="grid place-items-center bg-[#181136] h-screen w-full">
          <div className="z-50 w-80">
            <h2 className="text-white text-center text-3xl font-semibold my-4">
              Login
            </h2>
            <div className="border-b-2 border-gray-200 py-1 flex items-center">
              <div className="text-white font-bold text-xl mr-4">
                <Fa6SolidUser></Fa6SolidUser>
              </div>
              <input
                type="text"
                ref={emaliRef}
                placeholder="Email"
                className="bg-transparent outline-none border-none fill-none text-white py-2 grow"
              />
            </div>
            <div className="border-b-2 border-gray-200 py-1 mt-4 flex items-center">
              <div
                className="text-white font-bold text-xl mr-4"
                onClick={() => setShowPassword((val) => !showPassword)}
              >
                {showPassword ? (
                  <Fa6SolidEye></Fa6SolidEye>
                ) : (
                  <Fa6SolidEyeSlash></Fa6SolidEyeSlash>
                )}
              </div>
              <input
                ref={passRef}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="bg-transparent outline-none border-none fill-none text-white py-2 grow"
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    submit();
                  }
                }}
              />
            </div>
            <button
              onClick={submit}
              className="text-[#181136] bg-[#54edec] py-2 px-6 text-md font-medium rounded-full w-full mt-6"
            >
              Login
            </button>
            <div className="flex w-full">
              <div className="grow"></div>

              <button
                onClick={(e) => setBox(true)}
                className="text-secondary text-md text-right mt-4"
              >
                Forgot Password
              </button>
            </div>

            <h5 className="text-white text-center mt-8">
              Don't have an account?{" "}
              <Link to={"/register"} className="text-[#54edec]">
                Sign Up
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
      <div
        className={`fixed top-0 left-0 bg-black bg-opacity-50 min-h-screen w-full z-50 ${
          box ? "grid place-items-center" : "hidden"
        }`}
      >
        <div className="bg-primary-800 p-4 rounded-md w-80">
          <h3 className="text-2xl text-center font-semibold text-secondary">
            Enter your email.
          </h3>
          <div className="w-full h-[2px] bg-gray-800 my-4"></div>
          <input
            ref={mail}
            className="fill-none outline-none bg-transparent my-2 border-2 border-gray-200 p-2 text-white placeholder:text-gray-300 w-full"
            placeholder="Enter Your email here."
          />
          <div className="flex flex-wrap gap-6 mt-4">
            <button
              onClick={forgetpassword}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
            >
              Send
            </button>
            <button
              onClick={() => setBox((val: any) => false)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
