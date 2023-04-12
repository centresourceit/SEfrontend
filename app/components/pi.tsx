import { Link } from "@remix-run/react";

export default function Pi(): JSX.Element {
  return (
    <section className="h-screen w-full relative" id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#1f2748] h-screen w-full place-items-center">
        <div className="grid place-items-center">
          <div className="z-50 p-6">
            <h1 className="text-4xl font-semibold text-[#865fe5]">
              Public Intelligence <span className="text-[#54edec]">(PI)</span>
            </h1>
            <p className="text-white text-sm lg:text-md font-medium mt-6">
              Public Intelligence is an open and democratic ethics management
              platform to bring the right to intelligence, fairness,
              sustainability and accountability with technology. We collaborate
              and integrate regulations & standards to help apply ethics, manage
              disruption and certify innovations, seamlessly and practically.
            </p>
            <p className="text-white text-sm lg:text-md font-medium mt-6">
              Public Intelligence is a revolutionary new concept which aims to
              bring awareness of our human intelligence, alongside addressing
              the global and ethical challenges we face today.
            </p>
            <p className="text-white text-sm lg:text-md font-medium mt-6">
              Over centuries, we have acquired public knowledge through the
              development of skills, acquisition of tools, and practices to
              support survival as a human ecosystem. We refer to this system as
              our society. Our intelligence is a formation of these elements and
              has given rise to life as we know it, our economy, our education,
              our professions, our wealth, and our health. In industries such as
              agriculture, finance, manufacturing, and healthcare we use our
              intelligence, abilities, ideas, intuition, and experience to
              support every day decision making. The individual and collective
              power of ‘Public Intelligence’ is part of our DNA and an essential
              part of our human evolution.
            </p>
          </div>
        </div>
        <div className="w-full h-full grid place-items-center">
          <img src="/images/pi.png" alt="logo" className="w-96 lg:w-auto"/>
        </div>
      </div>
    </section>
  );
}
