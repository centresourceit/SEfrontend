import { Link } from "@remix-run/react";
import { ChangeEvent, useRef, useState } from "react";
import { z } from "zod";
import { toast } from 'react-toastify';
import { Fa6SolidEnvelope, Fa6SolidUser } from "./icons/Icons";

export default function Contact(): JSX.Element {
    const [chatcount, setCharcount] = useState<number>(0);

    const nameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const messageRef = useRef<HTMLTextAreaElement | null>(null);

    const textaredHandel = (e: ChangeEvent) => {
        setCharcount(messageRef.current?.value.length ?? 0);
    }

    const submit = () => {
        const ContactScheme = z.object({
            name: z
                .string()
                .nonempty("Name is required")
                .min(3, "Name should be have at least 3 character"),
            email: z
                .string()
                .nonempty("Email is required.")
                .email("Enter a valid email."),
            message: z
                .string()
                .nonempty("message is required"),
        }).strict();

        type ContactScheme = z.infer<typeof ContactScheme>

        const contact: ContactScheme = {
            name: nameRef!.current!.value,
            email: emailRef!.current!.value,
            message: messageRef!.current!.value,
        };

        const parsed = ContactScheme.safeParse(contact)
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
                            Contact Us
                        </h2>
                        <div className="border-b-2 border-gray-200 py-1 mt-4 flex items-center">
                            <div className="text-white font-bold text-xl mr-4">
                                <Fa6SolidUser></Fa6SolidUser>
                            </div>
                            <input ref={nameRef} type="text" placeholder="Name" className="bg-transparent outline-none border-none fill-none text-white placeholder:text-gray-300 py-2" />
                        </div>
                        <div className="border-b-2 border-gray-200 py-1 mt-4 flex items-center">
                            <div className="text-white font-bold text-xl mr-4">
                                <Fa6SolidEnvelope></Fa6SolidEnvelope>
                            </div>
                            <input ref={emailRef} type="text" placeholder="Email" className="bg-transparent outline-none border-none fill-none text-white placeholder:text-gray-300 py-2" />
                        </div>
                        <textarea ref={messageRef} maxLength={500} onChange={(e) => textaredHandel(e)} rows={4} className="mt-4 w-full bg-transparent fill-none outline-none resize-none border-b-2 border-white text-white placeholder:text-gray-300" placeholder="Help us to understand how can i help you?"></textarea>
                        <div className="flex">
                            <div className="grow"></div>
                            <div className="text-sm text-white font-normal">{chatcount}/1000</div>
                        </div>
                        <button onClick={submit} className="text-[#181136] bg-[#54edec] py-2 px-6 text-md font-medium rounded-full w-full mt-6 ">Contact</button>
                        <div className="text-center mt-4">
                            <Link className="text-cyan-500 hover:underline" to={"/"}>Go to home</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}