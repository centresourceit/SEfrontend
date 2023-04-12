export default function Challenges(): JSX.Element {
    return (
        <section className="h-screen w-full relative" id="about">
            <img src="/images/bg/bg2.png" alt="error" className="scale-x-[-1] scale-y-[-1] absolute top-0 left-0 w-full h-screen object-cover object-center" />
            <div className="grid grid-cols-1 md:grid-cols-2 place bg-[#54edec] h-screen w-full">
                <div className="z-50 grid place-items-center">
                    <div className="p-2 md:p-10">
                        <h1 className="text-[#865fe5] text-4xl font-semibold text-left">We Address Global Ethics Challenges</h1>
                        <h4 className="text-left text-lg text-[#865fe5] mt-10">Unregulated AI</h4>
                        <h4 className="text-left text-lg text-black">Is killing business</h4>

                        <h4 className="text-left text-lg text-[#865fe5] mt-10">No Compliance Managment</h4>
                        <h4 className="text-left text-lg text-black">Constantly Changing & fragmented Global Compliance Requirement</h4>

                        <h4 className="text-left text-lg text-[#865fe5] mt-10">Long-term Risks</h4>
                        <h4 className="text-left text-lg text-black">Raising Unquantifiable Ethical Concens</h4>
                    </div>
                </div>
                <div className="hidden md:block"></div>
            </div>
        </section>);
}