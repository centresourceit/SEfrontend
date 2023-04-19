export default function Challenges(): JSX.Element {
  return (
    <section className="h-screen w-full relative" id="about">
      <img
        src="/images/bg/bg2.png"
        alt="error"
        className="scale-x-[-1] scale-y-[-1] absolute top-0 left-0 w-full h-screen object-cover object-center"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 place bg-[#54edec] h-screen w-full z-50 relative">
        <div>
          <div className="z-50 grid place-items-center">
            <div className="p-2 md:p-10">
              <h1 className="text-[#865fe5] text-4xl font-semibold text-left">
                We Address Global Ethical Challenges
              </h1>
              <h4 className="text-left text-lg text-[#865fe5] mt-10">
                Unregulated AI
              </h4>
              <h4 className="text-left text-lg text-black">
                Is killing business
              </h4>

              <h4 className="text-left text-lg text-[#865fe5] mt-10">
                No Compliance Managment
              </h4>
              <h4 className="text-left text-lg text-black">
                Constantly Changing & fragmented Global Compliance Requirement
              </h4>
              <h4 className="text-left text-lg text-[#865fe5] mt-10">
                Long-term Risks
              </h4>
              <h4 className="text-left text-lg text-black">
                Raising Unquantifiable Ethical Concerns
              </h4>
            </div>
            <div className="p-6">
              <button className="text-white font-medium text-xl bg-[#865fe5] py-1 px-4 rounded-full border-2 border-[#865fe5] m-2 hover:bg-transparent hover:text-[#865fe5] inline-block">
                Public Intelligence Whitepaper
              </button>
              <button className="text-white font-medium text-xl bg-[#865fe5] py-1 px-4 rounded-full border-2 border-[#865fe5] m-2 hover:bg-transparent hover:text-[#865fe5] inline-block">
                Donate and support the cause
              </button>
              <button className="text-white font-medium text-xl bg-[#865fe5] py-1 px-4 rounded-full border-2 border-[#865fe5] m-2 hover:bg-transparent hover:text-[#865fe5] inline-block">
                Download Right to Intelligence Proposal Paper
              </button>
            </div>
          </div>
        </div>
        <div className="hidden md:block"></div>
      </div>
    </section>
  );
}
