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
        adminComments,
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


  const compliance = await ApiCall({
    query: `
    query getAllCompliance{
      getAllCompliances{
        logo,
      }
    }
      `,
    veriables: {
      id: Number(cookie.id)
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });
  return json({
    result: data.data.searchResult,
    token: cookie.token,
    compliance: compliance.data.getAllCompliances,
    id: id
  });
}

const ResultStatus = () => {
  const loader = useLoaderData();
  const id = loader.id;
  const result = loader.result[0];
  const compliance = loader.compliance;


  return (
    <div className="grow  p-4 w-full">
      <div className="flex gap-4 flex-wrap">

        <h1 className="text-secondary font-medium text-3xl">Result Status</h1>
        <div className="grow"></div>
        <Link to={`/home/userresult/${result.projectId}`} className="text-white text-center font-medium text-xl rounded-full px-4 py-1 bg-cyan-500">Back To Result</Link>
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
                    {(result.totalScore / result.assesement.result.length).toFixed(1)}/10
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
                  <a target="_blank" href={`/certificatepdf/${id}`} className="text-white text-center font-medium text-md rounded-full w-28 py-2 bg-[#865fe5]">
                    Share
                  </a>
                </div>
                <p className="text-gray-300 font-medium text-xs">
                  For a detailed review from our expert team
                </p>
                <div className="flex gap-4 my-4">
                  <Link to={"/contact"} className="text-white text-center font-medium text-md rounded-full w-28 py-2 bg-[#865fe5]">
                    Contact us
                  </Link>
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
          {result.adminComments == null || result.adminComments == undefined || result.adminComments == "" ? null :
            <p className="text-xl text-white font-semibold">
              Admin Comment : <span className="text-secondary">{result.adminComments}</span>
            </p>
          }
          <div className="w-full flex gap-6 my-6">
            <div className="grow bg-gray-500 h-[2px]"></div>
            <div className="w-10 bg-gray-300 h-[4px]"></div>
            <div className="grow bg-gray-500 h-[2px]"></div>
          </div>
          <p className="text-3xl text-white font-semibold">
            “Congratulations, great start! Try the full version to explore which alignment matters the most to you.”
          </p>
          <div className="flex gap-8 my-6 flex-wrap ">
            {
              compliance.map((val: any, index: number) => (
                <img key={index}
                  src={val.logo}
                  alt="logo1"
                  className="shrink-0 w-40 h-24 object-cover object-top bg-white"
                />
              ))
            }
          </div>
        </>}
    </div>
  );
};

export default ResultStatus;
