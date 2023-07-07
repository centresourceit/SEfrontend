export default function Managment(): JSX.Element {
    return (
        <section className="h-screen w-full relative overflow-hidden">
            <img src="/images/bg/bg3.png" alt="error" className="scale-110 absolute top-0 left-0 w-full h-screen object-cover object-right" />
            <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center bg-gradient-to-r from-[#1f2748] to-[#181136] h-screen w-full">
                <div className="hidden lg:block"></div>
                <div className="z-50 grid place-items-center">
                    <div className="p-10">
                        <h1 className="text-white text-3xl font-semibold text-left">Our Unique Eithics Management Solution enables Faster, Cheaper & Easy AI Adoption</h1>
                        <h4 className="text-left text-2xl text-[#54edec] mt-6 font-medium">Intellectual Privacy</h4>
                        <h4 className="text-left text-2xl text-[#54edec] mt-6 font-medium">Accountable Redesign</h4>
                        <h4 className="text-left text-2xl text-[#54edec] mt-6 font-medium">Purpose Realisation</h4>
                        <h4 className="text-left text-2xl text-[#54edec] mt-6 font-medium">Risk Evaluation</h4>
                        <h4 className="text-left text-2xl text-[#54edec] mt-6 font-medium">Sustainability Managment</h4>
                    </div>
                </div>
            </div>
        </section>
    );
}