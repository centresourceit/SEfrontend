import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const cookieHeader = props.request.headers.get("Cookie");
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
                email
              },
              project{
                name,
                description
              },
              license{
                id,
                licenseTypeId,
                paymentStatus,
                licenseValidity,
                paymentReference,
                licenseType{
                  id,
                  licenseType,
                  paymentAmount,
                  questionAllowed,
                  projectPerLicense,
                  name
                }
              }
            },
          }`,
        veriables: {
            searchResultInput: {
            }
        },
        headers: { authorization: `Bearer ${cookie.token}` },
    });

    return json({
        result: data.data.searchResult,
        token: cookie.token,
    });

}
const AdminResult: React.FC = (): JSX.Element => {
    const loader = useLoaderData();
    const result = loader.result;
    const token = loader.token;

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
                    resultStatus: status
                },
            },
            headers: { authorization: `Bearer ${token}` },
        });

        if (data.status) {
            toast.success("Your certificate status successfully changes.", { theme: "light" });
        } else {
            toast.error(data.message, { theme: "light" });
        }
    }
    const adminComment = useRef<HTMLTextAreaElement>(null);
    const addcomment = async () => {
        if (adminComment!.current!.value == null || adminComment!.current!.value == undefined || adminComment!.current!.value == "") {
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
                    adminComments: adminComment!.current!.value.toString()
                },
            },
            headers: { authorization: `Bearer ${token}` },
        });
        if (data.status) {
            toast.success("Your comment was submitted successfully.", { theme: "light" });
        } else {
            toast.error(data.message, { theme: "light" });
        }
        setAdminComment((val: boolean) => false);
    }

    return (
        <>
            <div className={`fixed top-0 left-0 bg-black bg-opacity-50 min-h-screen w-full z-50 ${addminComment ? "grid place-items-center" : "hidden"}`}>
                <div className="bg-primary-800 p-4 rounded-md w-80">
                    <h3 className="text-2xl text-center font-semibold text-secondary">Add your comment here.</h3>
                    <div className="w-full h-[2px] bg-gray-800 my-4"></div>
                    <textarea
                        ref={adminComment}
                        className="fill-none outline-none bg-transparent my-2 border-2 border-gray-200 p-2 text-white placeholder:text-gray-300 w-full h-28"
                        placeholder="Enter Your Comment"
                    >
                    </textarea>
                    <div className="flex flex-wrap gap-6 mt-4">
                        <button
                            onClick={addcomment}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
                        >
                            Submit
                        </button>
                        <button
                            onClick={() => setAdminComment(val => false)}
                            className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
                        >
                            Close
                        </button>

                    </div>
                </div>
            </div>

            <div className="grow  p-4 w-full">
                <h1 className="text-white font-medium text-2xl">User Results</h1>
                <div className="w-full bg-slate-400 h-[1px] my-2"></div>
                <div className="flex gap-6 flex-wrap my-6">
                    {result == null || result == undefined ? (
                        <>
                            <p className="text-rose-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
                                There is no results.
                            </p>
                        </>
                    ) : (
                        result.map((val: any, index: number) => {
                            if (val.totalScore == 0) return null;
                            return (
                                <div key={index} className="bg-primary-800 p-4 w-96 flex flex-col">
                                    <div className="flex gap-6 items-center">
                                        <p className="text-white font-semibold text-lg">{index + 1}</p>
                                        <p className="text-white font-semibold text-xl">
                                            {val.user.name} <span className="text-md">[ID: {val.certificatedId}]</span>
                                        </p>
                                        <div className="grow"></div>
                                        <Link to={`/home/adminresultdata/${val.id}`} className="bg-primary-500 py-1 text-white text-md font-normal rounded-md text-center w-16">View</Link>
                                    </div>
                                    <p className="text-gray-200 font-semibold text-md">
                                        Total Score : {val.totalScore}
                                    </p>
                                    <p className="text-gray-200 font-semibold text-md">
                                        Eamil : {val.user.email}
                                    </p>
                                    <div className="w-full h-[2px] bg-white my-2"></div>
                                    <p className="text-gray-200 font-semibold text-md">
                                        Project Name : {val.project.name}
                                    </p>
                                    <p className="text-gray-200 font-normal text-md my-1">
                                        {val.project.description}
                                    </p>
                                    <div className="w-full h-[2px] bg-white my-2"></div>
                                    <p className="text-gray-200 font-semibold text-md">
                                        Licenase Type : {val.license.licenseType.licenseType}
                                    </p>
                                    <p className="text-gray-200 font-normal text-md my-1">
                                        Licenase Name : {val.license.licenseType.name}
                                    </p>
                                    <p className="text-gray-200 font-normal text-md my-1">
                                        Project Per License : {val.license.licenseType.projectPerLicense}
                                    </p>
                                    <p className="text-gray-200 font-normal text-md my-1">
                                        Questions Per License : {val.license.licenseType.questionAllowed}
                                    </p>
                                    <div className="grow"></div>
                                    <div className="w-full h-[2px] bg-white my-2"></div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => changeStatus(val.id, "MET")}
                                            className="bg-primary-500 mt-4 py-1 text-white text-xl font-normal flex-1 rounded-md text-center">Status</button>
                                        <button
                                            onClick={(e) => { setId(val.id); setAdminComment((val: boolean) => true) }}
                                            className="bg-primary-500 mt-4 py-1 text-white text-xl font-normal flex-1 rounded-md text-center">Comment</button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </>
    );
}
export default AdminResult;