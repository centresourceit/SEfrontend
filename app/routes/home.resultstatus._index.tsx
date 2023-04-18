import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

const ResultStatus = () => {
  return (
    <div className="grow bg-[#272934] p-4 w-full">
      <h1 className="text-white font-medium text-xl">Result Stauts</h1>
      <div className="w-full bg-slate-400 h-[1px] my-2"></div>
      <h1 className="text-white font-medium text-4xl">
        You have successfully completed the design assessment
      </h1>
      <div className="flex w-full flex-col md:flex-row justify-between my-5 gap-y-8">
        <div className="grow  flex flex-col lg:flex-row gap-6">
          <div className="rounded-full bg-[#865fe5] grid place-items-center shrink-0 w-80 h-80">
            <p className="text-white font-bold text-7xl">
              3.1<span className="text-3xl font-normal">/5</span>
            </p>
          </div>
          <div className="grow px-4 py-2">
            <p className="text-white text-md font-bold">
              Thank you for submitting your assessment.
            </p>
            <p className="text-[#865fe5] font-medium text-2xl">
              Here is your Public Intelligence Target trust Score
            </p>
            <p className="text-white text-md my-6">
              Here is your Unique ID. Use your unique to see your result again
            </p>
            <p className="text-[#865fe5] font-medium text-3xl">4DF674</p>
            <div className="flex gap-4 my-4">
              <button className="text-white text-center font-medium text-md rounded-full w-28 py-2 bg-[#865fe5]">
                Start Again
              </button>
              <button className="text-white text-center font-medium text-md rounded-full w-28 py-2 bg-[#865fe5]">
                Share
              </button>
            </div>
            <p className="text-gray-300 font-medium text-xs">
              For a detailed review from our expert team
            </p>
            <div className="flex gap-4 my-4">
              <button className="text-white text-center font-medium text-md rounded-full w-28 py-2 bg-[#865fe5]">
                Contact us
              </button>
              <Link
                to={"/home/resultstatusfull/"}
                className="text-white text-center font-medium text-md rounded-full w-28 py-2 bg-[#865fe5]"
              >
                Full Cert
              </Link>
            </div>
          </div>
        </div>
        <div className="grow">
          <div className="grid place-items-center">
            <button className="bg-[#865fe5] text-2xl font-semibold py-2 px-4 text-white">
              Start Again
            </button>
            <h1 className="text-[#865fe5] font-medium text-2xl my-4">
              Want to imporove your Score?
            </h1>
            <div className="bg-white bg-opacity-10 py-2 px-4 pb-6">
              <h1 className="text-[#865fe5] font-medium text-2xl my-2 text-center">
                Get your (Paid)
                <br />
                Recommendation
              </h1>
              <p className="text-gray-200 text-md">
                (Recommended for Commercial usage)
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-3xl text-white font-semibold">
        Congratulations! Great Start! Try the full version to see if are aligned
        to the following requirements
      </p>
      <div className="flex gap-4 my-6">
        <img
          src="/images/brand/logo1.png"
          alt="logo1"
          className="shrink-0 w-20 object-cover object-center"
        />
        <img
          src="/images/brand/logo2.png"
          alt="logo1"
          className="shrink-0 w-20 object-cover object-center"
        />
        <img
          src="/images/brand/logo3.png"
          alt="logo1"
          className="shrink-0 w-20 object-cover object-center"
        />
        <img
          src="/images/brand/logo4.png"
          alt="logo1"
          className="shrink-0 w-20 object-cover object-center"
        />
      </div>
    </div>
  );
};

export default ResultStatus;
