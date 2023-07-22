import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export async function loader(params: LoaderArgs) {
  const id = params.params.id;
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const data = await ApiCall({
    query: `
      query getQuestionHistory($id:Int!){
        getQuestionHistory(id:$id){
          id,
          question,
          description,
          questionType,
          questioncode,
          status,
          version,
          answer{
            mark,
            rec,
            answer,
          },
          principle{
            name,
            description,
          },
          questionPlan{
            licenseType,
            paymentAmount,
            discountAmount,
            questionAllowed,
            projectPerLicense,
            discountValidTill,
          },
          complince{
            name,
            description
          }
        }
      }
    `,
    veriables: {
      id: parseInt(id!)
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  return json({ questions: data.data.getQuestionHistory, token: cookie.token });
}
const Questionhistory: React.FC = (): JSX.Element => {
  const loader = useLoaderData()
  const loaderquestions = loader.questions;
  const token = loader.token;
  const [questions, setQuestions] = useState<any[]>(loaderquestions);
  const [quelen, setQuelen] = useState<boolean[]>([])


  useEffect(() => {
    setQuelen(Array.from({ length: questions.length }, () => false));
  }, [questions]);


  return (
    <>
      <div className="grow  p-4 w-full overflow-x-hidden">
        <h1 className="text-white font-medium text-2xl">Questions</h1>
        <div className="w-full bg-slate-400 h-[1px] my-2"></div>
        <div className="my-6">
          {questions == null || questions == undefined ? (
            <>
              <p className="text-rose-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
                There is no questions.
              </p>
            </>
          ) : (
            questions.map((val: any, index: number) => {
              return (
                <div key={index} className="bg-primary-800 p-4 my-4">
                  <div className="flex gap-6">
                    <p className="text-white font-semibold text-lg">{index + 1}</p>
                    <p className="text-white font-semibold text-xl">
                      {val.question} <span className="text-lg text-secondary"> [ ID: {val.id}, VERSION: {val.version} ] </span>
                    </p>
                    <div className="grow"></div>
                    <div className="cursor-pointer">
                      {val.status == "ACTIVE" ? (
                        <div
                          className="w-16 py-1 text-white text-xs bg-green-500 text-center rounded-md font-medium"
                        >
                          ACTIVE
                        </div>
                      ) : (
                        <div
                          className="w-16 py-1 text-white text-xs bg-rose-500 text-center rounded-md font-medium"
                        >
                          INACTIVE
                        </div>
                      )}
                    </div>
                  </div>
                  {val.description ? (
                    <p className="text-gray-200 font-normal text-lg my-2">
                      Description : {val.description}
                    </p>
                  ) : null}
                  <div className="flex items-center">
                    <p className="text-white font-semibold text-xl">Answers:</p>
                    <div className="grow"></div>
                    <button onClick={() => {
                      setQuelen(prevQuelen => {
                        const updatedQuelen = [...prevQuelen];
                        updatedQuelen[index] = !updatedQuelen[index];
                        return updatedQuelen;
                      });
                    }} className="text-white rounded-md font-semibold bg-cyan-500 py-1 px-4">{quelen[index] ? "HIDE" : "SHOW"}</button>
                  </div>

                  {quelen[index] ? val.answer.map((value: any, ind: number) => {
                    return (
                      <div
                        key={ind}
                        className="border-l-4 bg-green-500 border-green-500 bg-opacity-10 rounded-md my-4 p-2"
                      >
                        <p className="text-gray-200 font-normal text-lg">
                          Answer: {value.answer}
                        </p>
                        <p className="text-gray-200 font-normal text-lg">
                          Mark: {value.mark}
                        </p>
                        <p className="text-gray-200 font-normal text-lg">
                          Recommendation: {value.rec}
                        </p>
                      </div>
                    );
                  }) : null}
                  <div className="w-full h-[2px] bg-gray-300 my-2"></div>
                  <p className="text-gray-200 font-semibold text-2lx mt-2">
                    {val.principle.name}
                  </p>
                  <p className="text-gray-200 font-normal text-lg">
                    {val.principle.description}
                  </p>

                  <div className="w-full h-[2px] bg-gray-300 my-2"></div>
                  <p className="text-gray-200 text-2lx mt-2">
                    Question Type: {val.questionType}
                  </p>
                  <p className="text-gray-200 text-2lx mt-2">
                    Question code: {val.questioncode.toString().toUpperCase()}
                  </p>
                  {quelen[index] ? <>
                    <div className="w-full bg-gray-400 h-[2px] my-2"></div>
                    <p className="text-gray-200 text-2lx mt-2">
                      License Type: {val.questionPlan.licenseType}
                    </p>
                    <p className="text-gray-200 text-2lx mt-2">
                      License Payment Amount: {val.questionPlan.paymentAmount}
                    </p>
                    <p className="text-gray-200 text-2lx mt-2">
                      Discount Amount: {val.questionPlan.discountAmount}
                    </p>
                    <p className="text-gray-200 text-2lx mt-2">
                      Question Allowed: {val.questionPlan.questionAllowed}
                    </p>
                    <p className="text-gray-200 text-2lx mt-2">
                      Project/License: {val.questionPlan.projectPerLicense}
                    </p>
                    <p className="text-gray-200 text-2lx mt-2">
                      Discount Valid Till: {new Date(val.questionPlan.discountValidTill).toDateString()}
                    </p>
                    <div className="w-full h-[2px] bg-gray-300 my-2"></div>
                    <p className="text-gray-200 font-semibold text-2lx mt-2">
                      {val.complince.name}
                    </p>
                    <p className="text-gray-200 font-normal text-lg">
                      {val.complince.description}
                    </p>
                  </> : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default Questionhistory;