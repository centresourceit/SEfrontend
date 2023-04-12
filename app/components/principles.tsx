import { faArrowLeft, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";

interface PrinciplesProps {
  left: boolean;
  images: string;
  principle: string;
  title1: string;
  title2: string;
  discriptioin: string;
  link: string;
}

export default function Principles(props: PrinciplesProps): JSX.Element {
  return (
    <section className="h-screen w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#181136] h-screen w-full place-items-center">
        <div
          className={`w-full h-full grid place-items-center ${
            props.left ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <img
            src={props.images}
            alt={props.principle}
            className="w-96 lg:w-[35rem] lg:h-[35rem] h-96 object-center object-cover"
          />
        </div>
        <div
          className={`grid place-items-center ${
            props.left ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <div className="w-96 lg:w-[35rem] p-6">
            <p className="text-white text-sm font-medium">{props.principle}</p>
            <h1 className="text-white  text-3xl lg:text-5xl font-semibold">
              {props.title1}
              <span className="text-[#865fe5] mx-4">{props.title2}</span>
            </h1>
            <p className="text-white text-2xl lg:text-3xl font-medium mt-6 lg:mt-8">
              {props.discriptioin}
            </p>
            <div className="flex gap-4 items-center mt-6 mb-4 text-xl">
              <button className="text-white hover:text-[#181136] bg-[#5239b5] text-md font-medium rounded-full hover:bg-[#54edec] py-2 px-4 lg:py-3 lg:px-6">
                <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon> Read More
              </button>
              <div className="w-10"></div>
              <button className="text-[#181136] hover:text-white bg-[#54edec] text-md font-medium rounded-full hover:bg-[#5239b5] py-2 px-4 lg:py-3 lg:px-6">
                <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon> Vote
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
