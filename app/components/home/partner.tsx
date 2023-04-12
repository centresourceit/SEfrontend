import { Link } from "@remix-run/react";

export default function Partner(): JSX.Element {
  return (
    <section className="h-screen w-full relative" id="contact">
      <img
        src="/images/bg/bg1.png"
        alt="error"
        className="absolute top-0 left-0 w-full h-screen object-cover object-center"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#865fe5] h-screen w-full place-items-center">
        <div className="hidden lg:block"></div>
        <div className="grid place-items-center">
          <div className="z-50 p-6">
            <h1 className="text-white text-4xl font-semibold">
              Become a partner, join the mission
            </h1>
            <p className="text-white text-sm font-medium mt-6">
              Join our people supported framework, unified and standardised in
              technology to become the tool of the century, providing a simple
              process to follow and ensuring accountability and ethics
              regulations are met when designing the next world changing
              innovation.
            </p>
            <p className="text-white text-sm font-medium mt-6">
              We do not want to impact the freedom of innovation; we want to
              ensure we do not adversely impact the world and the people in it
              when harnessing the power of technology.
            </p>
            <p className="text-white text-sm font-medium mt-6">
              Contact us for partnership and download our white paper for a
              clearer overview.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
