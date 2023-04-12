import { Link } from "@remix-run/react";

export default function ContactUs(): JSX.Element {
    return (
        <section className="h-screen w-full relative" id="contact">
            <img src="/images/bg/bg1.png" alt="error" className="absolute top-0 left-0 w-full h-screen object-cover object-center" />
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#865fe5] h-screen w-full place-items-center">
                <div className="hidden lg:block"></div>
                <div className="grid place-items-center">
                    <div className="z-50 p-6">
                        <h1 className="text-white text-4xl font-semibold text-center">Contact Us</h1>
                        <div className="border-4 border-[#54edec] rounded-xl my-4 p-6">
                            <h1 className="text-black text-4xl font-semibold text-center">Try Open Ethics</h1>
                            <p className="text-black text-sm font-normal text-center my-2">Fill in the Expression of Interest</p>
                            <div className="grid place-items-center">
                                <Link to={"/register"} className="text-[#181136] bg-[#54edec] py-4 px-10 text-md font-medium rounded-full text-center mx-auto">Sign Up</Link>
                            </div>
                        </div>
                        <div className="border-4 border-[#54edec] rounded-xl my-4 p-6">
                            <h1 className="text-black text-4xl font-semibold text-center">Get in Touch</h1>
                            <p className="text-black text-sm font-normal text-center my-2">For more information</p>
                            <div className="grid place-items-center">
                                <Link to={"/contact"} className="text-[#181136] bg-[#54edec] py-4 px-10 text-md font-medium rounded-full text-center mx-auto">Contact Us</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}