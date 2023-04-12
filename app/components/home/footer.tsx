import { faFacebook, faInstagram, faLinkedin, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";

export default function Footer(): JSX.Element {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-[#54edec] py-10">
            <h1 className="text-3xl text-center font-medium text-[#181136]">Open-ethics.com</h1>
            <div className="flex gap-6 items-center mx-auto justify-center mt-8">
                <Link to={"/"} className="text-gray-700 hover:text-gray-900 font-medium">HOME</Link>
                <Link to={"/about"} className="text-gray-700 hover:text-gray-900 font-medium">ABOUT</Link>
                <Link to={"/principles"} className="text-gray-700 hover:text-gray-900 font-medium">PRINCIPLES</Link>
                <Link to={"/contact"} className="text-gray-700 hover:text-gray-900 font-medium">CONTACT</Link>
            </div>
            <div className="lg:flex gap-4 items-center hidden justify-center my-4">
                <FontAwesomeIcon icon={faFacebook} className="text-[#181136] text-2xl"></FontAwesomeIcon>
                <FontAwesomeIcon icon={faInstagram} className="text-[#181136]  text-2xl"></FontAwesomeIcon>
                <FontAwesomeIcon icon={faLinkedin} className="text-[#181136]  text-2xl"></FontAwesomeIcon>
                <FontAwesomeIcon icon={faYoutube} className="text-[#181136]  text-2xl"></FontAwesomeIcon>
                <FontAwesomeIcon icon={faTwitter} className="text-[#181136]  text-2xl"></FontAwesomeIcon>
            </div>
            <p className="text-center font-medium text[#181136]">Company number 14403815 address : 32 Park Cross Street, Leets, England, LS1 2QHaddress</p>
            <p className="text-center font-medium text[#181136]"> &copy; Copyrights Reserved {year} </p>
        </footer>
    );
}