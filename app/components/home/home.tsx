import { Link } from "@remix-run/react";

export default function Home(): JSX.Element {
    return (
        <section className="h-screen w-full relative">
            <img src="/images/bg/bg4.png" alt="home bg" className="scale-y-[-1] absolute top-0 left-0 w-full h-screen object-cover object-center" />
            <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center bg-gradient-to-tl from-[#1f2748] to-[#181136] h-screen w-full">
                <div className="hidden lg:block"></div>
                <div className="z-50 p-8 grid place-items-center">
                    <div >
                        <h1 className="text-white text-3xl text-center">We are the <span className="text-[#54edec]">B-Corp</span> for<br /> <span className="text-[#54edec]">Ethical </span>Tech Offering</h1>
                        <div className="flex flex-col sm:flex-row justify-around my-10 items-center">
                            <div className="h-6 bg-[#54edec] w-[2px] shrink-0 sm:block hidden"></div>
                            <p className="text-white font-medium text-lg">Cost-Saving</p>
                            <div className="h-6 bg-[#54edec] w-[2px] shrink-0 sm:block hidden"></div>
                            <p className="text-white font-medium text-lg">Faster Adoption</p>
                            <div className="h-6 bg-[#54edec] w-[2px] shrink-0 sm:block hidden"></div>
                            <p className="text-white font-medium text-lg">Global Advantage</p>
                            <div className="h-6 bg-[#54edec] w-[2px] shrink-0 sm:block hidden"></div>
                        </div>
                        <p className="text-white font-normal text-md my-4">We are opne, unified teach standared management solution,solving the problem of no AI Standared to accelerate AI adoption, offering seamless global compliance-readiness and embedding ethics efficently</p>
                        <div className="flex justify-evenly my-8">
                            <button className="text-[#181136] bg-[#54edec] py-2 px-4 sm:py-4 sm:px-6 text-md font-medium rounded-full w-32 sm:w-40">Quick Demo</button>
                            <Link to={'/login'} className="text-[#181136] bg-[#54edec] py-2 px-4 sm:py-4 sm:px-6 text-md font-medium rounded-full w-32 sm:w-40 inline-block text-center">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}