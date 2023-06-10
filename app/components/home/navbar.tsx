
import { Link } from "@remix-run/react";
import { Fa6BrandsFacebook, Fa6BrandsInstagram, Fa6BrandsLinkedin, Fa6BrandsTwitter, Fa6BrandsYoutube } from "../icons/Icons";

export default function Navbar(): JSX.Element {
  return (
    <nav className="bg-[#181136] flex py-4 px-6 flex-col md:flex-row">
      <div className="px-10 shrink-0 grid place-items-center">
        <img src="/images/logo.png" alt="logo" className="w-48" />
      </div>
      <div className="grow"></div>
      <div className="flex gap-4 items-center my-4 md:my-0 justify-center">
        <Link to={"/"} className="text-gray-200 hover:text-white font-medium">
          HOME
        </Link>
        <Link
          to={"/about"}
          className="text-gray-200 hover:text-white font-medium"
        >
          ABOUT
        </Link>
        <Link
          to={"/principles"}
          className="text-gray-200 hover:text-white font-medium"
        >
          PRINCIPLES
        </Link>
        <Link
          to={"/contact"}
          className="text-gray-200 hover:text-white font-medium"
        >
          CONTACT
        </Link>
      </div>
      <div className="w-20 hidden lg:flex"></div>
      <div className="lg:flex gap-4 items-center hidden">
        <div
          className="text-[#54edec] text-2xl"
        >
          <Fa6BrandsFacebook></Fa6BrandsFacebook>
        </div>
        <div
          className="text-[#54edec]  text-2xl"
        >
          <Fa6BrandsInstagram></Fa6BrandsInstagram>
        </div>
        <div
          className="text-[#54edec]  text-2xl"
        >
          <Fa6BrandsLinkedin></Fa6BrandsLinkedin>
        </div>
        <div
          className="text-[#54edec]  text-2xl"
        >
          <Fa6BrandsYoutube></Fa6BrandsYoutube>
        </div>
        <div
          className="text-[#54edec]  text-2xl"
        >
          <Fa6BrandsTwitter></Fa6BrandsTwitter>
        </div>
      </div>
    </nav>
  );
}
