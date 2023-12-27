import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const id = props.params.id;
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
      },
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });
  return json({ data: data, token: cookie.token });
};

const UserResult: React.FC = (): JSX.Element => {
  const data = useLoaderData().data;
  const token = useLoaderData().token;

  const [addminComment, setAdminComment] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const changeStatus = async (value: number, status: string) => {
    const data = await ApiCall({
      query: `
        mutation updateResultStatus($updateResultInput:UpdateResultInput!){
            updateResultStatus(updateResultInput:$updateResultInput){
                id,
          }
        }
      `,
      veriables: {
        updateResultInput: {
          id: value,
          resultStatus: status,
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });

    if (data.status) {
      toast.success("Your certificate status successfully changes.", {
        theme: "light",
      });
    } else {
      toast.error(data.message, { theme: "light" });
    }
  };
  const adminComment = useRef<HTMLTextAreaElement>(null);
  const addcomment = async () => {
    if (
      adminComment!.current!.value == null ||
      adminComment!.current!.value == undefined ||
      adminComment!.current!.value == ""
    ) {
      setAdminComment((val: boolean) => false);
      return toast.error("Enter your Comment", { theme: "light" });
    }
    const data = await ApiCall({
      query: `
        mutation updateResultStatus($updateResultInput:UpdateResultInput!){
            updateResultStatus(updateResultInput:$updateResultInput){
                id,
          }
        }
      `,
      veriables: {
        updateResultInput: {
          id: id,
          adminComments: adminComment!.current!.value.toString(),
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });
    if (data.status) {
      toast.success("Your comment was submitted successfully.", {
        theme: "light",
      });
    } else {
      toast.error(data.message, { theme: "light" });
    }
    setAdminComment((val: boolean) => false);
  };
  return (
    <>
      <div
        className={`fixed top-0 left-0 bg-black bg-opacity-50 min-h-screen w-full z-50 ${
          addminComment ? "grid place-items-center" : "hidden"
        }`}
      >
        <div className="bg-primary-800 p-4 rounded-md w-80">
          <h3 className="text-2xl text-center font-semibold text-secondary">
            Add your comment here.
          </h3>
          <div className="w-full h-[2px] bg-gray-800 my-4"></div>
          <textarea
            ref={adminComment}
            className="fill-none outline-none bg-transparent my-2 border-2 border-gray-200 p-2 text-white placeholder:text-gray-300 w-full h-28"
            placeholder="Enter Your Comment"
          ></textarea>
          <div className="flex flex-wrap gap-6 mt-4">
            <button
              onClick={addcomment}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
            >
              Submit
            </button>
            <button
              onClick={() => setAdminComment((val: any) => false)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      <div className="grow  p-4 w-full">
        <div className="flex">
          <h1 className="text-white font-medium text-2xl">User Results</h1>
          <div className="grow"></div>
          <div className="flex gap-2">
            <button
              onClick={() => changeStatus(data.data.searchResult[0].id, "MET")}
              className="bg-primary-500 mt-4 py-1 text-white text-xl font-normal px-4 rounded-md text-center"
            >
              Status
            </button>
            <button
              onClick={(e) => {
                setId(data.data.searchResult[0].id);
                setAdminComment((val: boolean) => true);
              }}
              className="bg-primary-500 mt-4 py-1 text-white text-xl font-normal px-4 rounded-md text-center"
            >
              Comment
            </button>
            <Link
              to={"/home/adminresult/"}
              className="bg-primary-500 mt-4 py-1 text-white text-xl font-normal px-4 rounded-md text-center grid place-items-center"
            >
              Back
            </Link>
          </div>
        </div>
        <div className="w-full bg-slate-400 h-[1px] my-2"></div>

        {data.status ? (
          <>
            {data.data.searchResult[0].assesement.result.map(
              (val: any, index: number) => (
                <div
                  key={index}
                  className="bg-secondary px-8 py-6 rounded-lg my-6 backdrop-filter backdrop-blur-lg bg-opacity-20 border-2 border-secondary"
                >
                  <h2 className="text-secondary font-medium text-3xl mb-2">
                    {index + 1}. {val.question}
                  </h2>
                  <h4 className="text-white font-normal text-2xl mb-2">
                    Answer: {val.answer}
                  </h4>
                  <h4 className="text-white font-normal text-2xl mb-2">
                    Mark: {val.mark}
                  </h4>
                  <h4 className="text-white font-normal text-2xl mb-2">
                    Recommendation: {val.rec}
                  </h4>
                  <h4 className="text-white font-normal text-2xl mb-2">
                    Principle: {val.principlename}
                  </h4>
                  <h4 className="text-white font-normal text-2xl mb-2">
                    Question Type: {val.questiontype}
                  </h4>
                  <h4 className="text-white font-normal text-2xl mb-2">
                    Question Code: {val.questioncode}
                  </h4>
                </div>
              )
            )}
          </>
        ) : (
          <div className=" my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
            <p className="text-rose-500 font-semibold text-2xl">
              Result not exist.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default UserResult;
