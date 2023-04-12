import { Link } from "@remix-run/react";

export default function AboutPage(): JSX.Element {
  return (
    <section className="h-screen w-full relative">
      <img
        src="/images/bg/bg4.png"
        alt="home bg"
        className="scale-y-[-1] absolute top-0 left-0 w-full h-screen object-cover object-center"
      />
      <div className=" bg-gradient-to-tl from-[#1f2748] to-[#181136] h-screen w-full relative">
        <div className="z-50 w-4/5 mx-auto pt-10">
          <h3 className="text-center text-white text-4xl font-bold">
            About Us
          </h3>
          <p className="text-white text-xl font-medium my-4">
            Smart Ethics is an open and democratic ethics management platform to
            bring the right to intelligence, fairness, sustainability and
            accountability with technology. We collaborate and integrate
            regulations & standards to help apply ethics, manage disruption and
            certify innovations, seamlessly and practically.
          </p>
          <div className="mx-auto w-full  grid place-items-center mt-10">
            <img
              src="/images/videoimg.webp"
              alt="video"
              className="h-96 object-cover object-center"
            />

            <video src="https://www.youtube.com/180093f0-54c0-48bf-91af-7d4e48118153"></video>
          </div>
        </div>
      </div>
    </section>
  );
}
