import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitch,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";

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
        <FontAwesomeIcon
          icon={faFacebook}
          className="text-[#54edec] text-2xl"
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={faInstagram}
          className="text-[#54edec]  text-2xl"
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={faLinkedin}
          className="text-[#54edec]  text-2xl"
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={faYoutube}
          className="text-[#54edec]  text-2xl"
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={faTwitter}
          className="text-[#54edec]  text-2xl"
        ></FontAwesomeIcon>
      </div>
    </nav>
  );
}
