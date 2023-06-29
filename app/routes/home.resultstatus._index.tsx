import { LinksFunction, LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";


export async function loader(params: LoaderArgs) {
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const data = await ApiCall({
    query: `
    query getAllResults{
      getAllResults{
        id,
        certificatedId,
        totalScore,
        assesement{
          result{
            question,
            status
          }
        }
      },
    }
  `,
    veriables: {},
    headers: { authorization: `Bearer ${cookie.token}` },
  });
  return json({ question: data.data.getAllResults, token: cookie.token });
}

const ResultStatus = () => {

  const questiondata = useLoaderData().question != undefined ? useLoaderData().question.length > 0 ? useLoaderData().question.pop() : null : null;

  return (
    <div className="grow  p-4 w-full">
      <h1 className="text-secondary font-medium text-3xl">Result Status</h1>
      <div className="w-full bg-secondary h-[1px] my-2"></div>

      {questiondata == null ?
        <h1 className="text-white font-medium text-2xl my-4">
          You haven't given any test yet.
        </h1>
        : <>
          <h1 className="text-white font-medium text-4xl">
            You have successfully completed the design assessment
          </h1>
          <div className="flex w-full flex-col md:flex-row justify-between my-5 gap-y-8">
            <div className="grow  flex flex-col lg:flex-row gap-6">
              <div className="rounded-full bg-[#865fe5] grid place-items-center shrink-0 w-80 h-80">
                <div>
                  <p className="text-white font-bold text-7xl text-center">
                    {((Number(questiondata.totalScore) / 10) / questiondata.assesement.result.length).toFixed(2)}/10
                  </p>
                  <p className="text-white font-bold text-3xl text-center">
                    Your Score
                  </p>
                </div>
              </div>
              <div className="grow px-4 py-2">
                <p className="text-white text-md font-bold">
                  Thank you for submitting your assessment.
                </p>
                <p className="text-secondary font-medium text-2xl">
                  Here is your trust Score
                </p>
                <p className="text-white text-md my-6">
                  Here is your Unique ID. Use your unique to see your result again
                </p>
                <p className="text-secondary font-medium text-3xl">{questiondata.certificatedId.toString().toUpperCase()}</p>
                <div className="flex gap-4 my-4">
                  <Link to={"/home/taketest/"} className="text-white text-center font-medium text-md rounded-full w-28 py-2 bg-[#865fe5]">
                    Start Again
                  </Link>
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
                <Link to={"/home/taketest/"} className="bg-[#865fe5] text-2xl font-semibold py-2 px-4 text-white">
                  Start Again
                </Link>
                <h1 className="text-secondary font-medium text-2xl my-4">
                  Want to improve your Score?
                </h1>
                <div className="bg-white bg-opacity-10 py-2 px-4 pb-6">
                  <h1 className="text-secondary font-medium text-2xl my-2 text-center">
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
          <div className="w-full flex gap-6 my-6">
            <div className="grow bg-gray-500 h-[2px]"></div>
            <div className="w-10 bg-gray-300 h-[4px]"></div>
            <div className="grow bg-gray-500 h-[2px]"></div>
          </div>
          <p className="text-3xl text-white font-semibold">
            Congratulations! Great Start! Try the full version to see if are aligned
            to the following requirements
          </p>
          <div className="flex gap-8 my-6 flex-wrap justify-evenly">
            <img
              src="/images/brand/logo11.jpeg"
              alt="logo1"
              className="shrink-0 w-40 h-24 object-fill object-center bg-white"
            />
            <img
              src="/images/brand/logo12.jpg"
              alt="logo1"
              className="shrink-0 w-40 h-24 object-fill object-center bg-white"
            />
            <img
              src="/images/brand/logo13.png"
              alt="logo1"
              className="shrink-0 w-40 h-24 object-fill object-center bg-white"
            />
            <img
              src="/images/brand/logo14.png"
              alt="logo1"
              className="shrink-0 w-40 h-24 object-fill object-center bg-white"
            />
            <img
              src="/images/brand/logo15.jpg"
              alt="logo1"
              className="shrink-0 w-40 h-24 object-fill object-center bg-white"
            />
            <img
              src="/images/brand/logo16.png"
              alt="logo1"
              className="shrink-0 w-40 h-24 object-fill object-center bg-white"
            />
            <img
              src="/images/brand/logo17.png"
              alt="logo1"
              className="shrink-0 w-40 h-24 object-fill object-center bg-white"
            />
            <img
              src="/images/brand/logo18.png"
              alt="logo1"
              className="shrink-0 w-40 h-24 object-fill object-center bg-white"
            />
          </div>
        </>}
    </div>
  );
};

export default ResultStatus;
