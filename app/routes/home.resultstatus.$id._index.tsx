import { LinksFunction, LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";


export async function loader(params: LoaderArgs) {
  const id = params.params.id;
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const data = await ApiCall({
    query: `
    query searchResult($searchResultInput:SearchResultInput!){
      searchResult(searchResultInput:$searchResultInput){
        id,
        certificatedId,
        resultStatus,
        totalScore,
        certified,
        projectId,
        assesement{
          result{
            question,
            status
          }
        }
      },
    }
  `,
    veriables: {
      searchResultInput: {
        id: parseInt(id!),
      }
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  return json({ result: data.data.searchResult, token: cookie.token, project: id });
}

const ResultStatus = () => {
  const loader = useLoaderData();
  const result = loader.result[0];
  const project = loader.project;
  const navigator = useNavigate();


  return (
    <div className="grow  p-4 w-full">
      <div className="flex gap-4 flex-wrap">

        <h1 className="text-secondary font-medium text-3xl">Result Status</h1>
        <div className="grow"></div>
        <Link to={`/userresult/${project}`} className="text-white text-center font-medium text-xl rounded-full px-4 py-1 bg-cyan-500">Back To Result</Link>
      </div>

      <div className="w-full bg-secondary h-[1px] my-2"></div>
      {result == null || result == undefined ?
        <h1 className="text-white font-medium text-2xl my-4">
          You haven't Completed any test yet.
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
                    {((Number(result.totalScore) / 10) / result.assesement.result.length).toFixed(1)}/10
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
                <p className="text-secondary font-medium text-3xl">{result.certificatedId.toString().toUpperCase()}</p>
                <div className="flex gap-4 my-4">
                  <Link to={`/home/taketest/${result.projectId}`} className="text-white text-center font-medium text-md rounded-full w-28 py-2 bg-[#865fe5]">
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
                    to={`/home/resultstatusfull/${result.id}`}
                    className="text-white text-center font-medium text-md rounded-full w-28 py-2 bg-[#865fe5]"
                  >
                    Full Cert
                  </Link>
                </div>
              </div>
            </div>
            <div className="grow">
              <div className="grid place-items-center">
                <h1 className="text-secondary font-medium text-2xl my-4">
                  Want to improve your Score?
                </h1>
                <div className="bg-white bg-opacity-10 py-2 px-4 pb-6">
                  <h1 className="text-secondary font-medium text-2xl my-2 text-center">
                    Improve with Recommendations &
                    <br />
                    Get a Certified Badge
                  </h1>
                  <p className="text-gray-200 text-md text-center">
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
