import { faEye, faEyeSlash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";
import { useRef, useState } from "react";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';




export default function Login(): JSX.Element {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handelPassword = () => {
        setShowPassword((val) => !val);
    }

    const emaliRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);


    const submit = () => {
        const LoginScheme = z.object({
            email: z.string().nonempty("Email is required.").email("Enter a valid email."),
            password: z.string().nonempty("Password is required").min(8, "Password should be have atlest 8 character.")
        }).strict();

        type LoginScheme = z.infer<typeof LoginScheme>

        const login: LoginScheme = {
            email: emaliRef!.current!.value,
            password: passRef!.current!.value,
        };

        const parsed = LoginScheme.safeParse(login)
        if (parsed.success) {
            toast.success("Successfully Deleted.", { theme: "light", });
        } else {
            toast.error(parsed.error.errors[0].message, { theme: "light", });
        }

    }

    return (
        <>
            <section className="h-screen w-full relative">
                <img src="/images/bg/bg5.png" alt="error" className="scale-x-[-1] scale-y-[-1] absolute top-0 left-0 w-full h-screen object-cover object-center" />
                <div className="grid place-items-center bg-[#181136] h-screen w-full">
                    <div className="z-50 w-80">
                        <h2 className="text-white text-center text-3xl font-semibold my-4">
                            Login
                        </h2>
                        <div className="border-b-2 border-gray-200 py-1">
                            <FontAwesomeIcon className="text-white fotn-bold text-xl mr-4" icon={faUser}></FontAwesomeIcon>
                            <input type="text" ref={emaliRef} placeholder="Email" className="bg-transparent outline-none border-none fill-none text-white" />
                        </div>
                        <div className="border-b-2 border-gray-200 py-1 mt-4">
                            <FontAwesomeIcon className="text-white fotn-bold text-xl mr-4" icon={showPassword ? faEye : faEyeSlash} onClick={handelPassword}></FontAwesomeIcon>
                            <input ref={passRef} type={showPassword ? "text" : "password"} placeholder="Password" className="bg-transparent outline-none border-none fill-none text-white" />
                        </div>
                        <button onClick={submit} className="text-[#181136] bg-[#54edec] py-2 px-6 text-md font-medium rounded-full w-full mt-6">Login</button>
                        <h5 className="text-white text-center mt-8">Don't have an account? <Link to={"/register"} className="text-[#54edec]">Sign Up</Link></h5>
                        <div className="text-center mt-4">
                            <Link className="text-cyan-500 hover:underline" to={"/"}>Go to home</Link>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer></ToastContainer>
        </>

    );
}