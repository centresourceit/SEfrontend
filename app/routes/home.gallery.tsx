import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export async function loader(params: LoaderArgs) {
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
          },
          user{
            id,
            name,
          },
          project{
            name,
            description
          }
        },
      }
    `,
        veriables: {
            searchResultInput: {
                certificatePrivacy: "ACTIVE",
            }
        },
        headers: { authorization: `Bearer ${cookie.token}` },
    });

    return json({
        gallery: data.data.searchResult,
    });

}
const Gallery: React.FC = (): JSX.Element => {
    const loader = useLoaderData();
    const gallery = loader.gallery;
    return (
        <div className="grow  p-4 w-full overflow-x-hidden">
            <h1 className="text-white font-medium text-2xl">Certificate Gallery</h1>
            <div className="w-full bg-slate-400 h-[1px] my-2"></div>

            <div className="flex gap-6 flex-wrap my-6">
                {gallery == null || gallery == undefined ? (
                    <>
                        <p className="text-rose-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
                            There is no gallery.
                        </p>
                    </>
                ) : (
                    gallery.map((val: any, index: number) => {
                        return (
                            <div key={index} className="bg-primary-800 w-80 p-4 flex flex-col">
                                <div className="flex gap-6">
                                    <p className="text-white font-semibold text-lg">{index + 1}</p>
                                    <p className="text-white font-semibold text-xl">
                                        {val.user.name} <span className="text-md">[ID: {val.certificatedId}]</span>
                                    </p>
                                </div>
                                <p className="text-gray-200 font-semibold text-md">
                                    Project Name : {val.project.name}
                                </p>
                                <p className="text-gray-200 font-normal text-md my-1">
                                    {val.project.description}
                                </p>
                                <div className="w-full h-[2px] bg-white my-2"></div>
                                <Link to={`/certificatepdf/${val.id}`} className="bg-primary-500 mt-4 py-1 text-white text-xl font-normal flex-1 rounded-md text-center">VIEW</Link>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
}

export default Gallery;