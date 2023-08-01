import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const id = props.params.id;
  console.log(id);
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
              id,
              principleid,
              principlename,
              question,
              answer,
              mark,
              rec,
              version,
              license,
              questioncode,
              questiontype
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
  return json({ data: data, token: cookie.token });
}





const userResult: React.FC = (): JSX.Element => {
  const data = useLoaderData().data;
  return (
    <>
      <div className="grow  p-4 w-full">
        <div className="flex">
          <h1 className="text-white font-medium text-2xl">Custom Recommendations</h1>
          <div className="grow"></div>
          <div className="flex gap-2">
            <Link to={`/home/userresult/${data.data.searchResult[0].projectId}`}
              className="bg-primary-500 mt-4 py-1 text-white text-xl font-normal px-4 rounded-md text-center grid place-items-center">Back</Link>
          </div>

        </div>
        <div className="w-full bg-slate-400 h-[1px] my-2"></div>

        {data.status ?
          <>
            {
              data.data.searchResult[0].assesement.result.map((val: any, index: number) =>
                <div className="bg-secondary px-6 py-3 rounded-lg my-6 backdrop-filter backdrop-blur-lg bg-opacity-20 border-2 border-secondary">
                  <h4 className="text-white font-normal text-2xl">
                    Recommendation: {val.rec}
                  </h4>
                </div>
              )
            }
          </>
          :
          <div className=" my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
            <p className="text-rose-500 font-semibold text-2xl">
              Result not exist.
            </p>
          </div>
        }
      </div>
    </>
  );
}

export default userResult;