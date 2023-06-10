
import { Link } from "@remix-run/react";
import { Fa6BrandsFacebook, Fa6BrandsInstagram, Fa6BrandsLinkedin, Fa6BrandsTwitter, Fa6BrandsYoutube } from "../icons/Icons";

export default function Footer(): JSX.Element {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-[#54edec] py-10">
            <h1 className="text-3xl text-center font-medium text-[#181136]">Smart-ethics.com</h1>
            <div className="flex gap-6 items-center mx-auto justify-center mt-8">
                <Link to={"/"} className="text-gray-700 hover:text-gray-900 font-medium">HOME</Link>
                <Link to={"/about"} className="text-gray-700 hover:text-gray-900 font-medium">ABOUT</Link>
                <Link to={"/principles"} className="text-gray-700 hover:text-gray-900 font-medium">PRINCIPLES</Link>
                <Link to={"/contact"} className="text-gray-700 hover:text-gray-900 font-medium">CONTACT</Link>
            </div>
            <div className="lg:flex gap-4 items-center hidden justify-center my-4">

                <div
                    className="text-[#181136] text-2xl"
                >
                    <Fa6BrandsFacebook></Fa6BrandsFacebook>
                </div>
                <div
                    className="text-[#181136]  text-2xl"
                >
                    <Fa6BrandsInstagram></Fa6BrandsInstagram>
                </div>
                <div
                    className="text-[#181136]  text-2xl"
                >
                    <Fa6BrandsLinkedin></Fa6BrandsLinkedin>
                </div>
                <div
                    className="text-[#181136]  text-2xl"
                >
                    <Fa6BrandsYoutube></Fa6BrandsYoutube>
                </div>
                <div
                    className="text-[#181136]  text-2xl"
                >
                    <Fa6BrandsTwitter></Fa6BrandsTwitter>
                </div>
            </div>
            <p className="text-center font-medium text[#181136]">Company number 14403815 address : 32 Park Cross Street, Leets, England, LS1 2QHaddress</p>
            <p className="text-center font-medium text[#181136]"> &copy; Copyrights Reserved {year} </p>
        </footer>
    );
}