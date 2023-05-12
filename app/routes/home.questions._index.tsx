import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

import { ToastContainer, toast } from "react-toastify";

import styles from "react-toastify/dist/ReactToastify.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader(params: LoaderArgs) {
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const data = await ApiCall({
    query: `
    query getAllQuestion{
      getAllQuestion{
        id,
        question,
        description,
        questionType,
        questionPlan,
        status,
        answer{
          mark,
          rec,
          answer,
        },
        principle{
          name,
          description,
        }
      }
    }
  `,
    veriables: {},
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  return json({ questions: data.data.getAllQuestion, token: cookie.token });
}

const Compliance = () => {
  const loaderquestions = useLoaderData().questions;
  const token = useLoaderData().token;
  const [questions, setQuestions] = useState<any[]>(loaderquestions);

  const updateStatus = async (id: number, status: string) => {
    const data = await ApiCall({
      query: `
      mutation updateQuestionById($updateQuestionbankInput:UpdateQuestionbankInput!){
        updateQuestionById(updateQuestionbankInput:$updateQuestionbankInput){
          id
        }
      }
      `,
      veriables: {
        updateQuestionbankInput: {
          id: id,
          status: status,
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });

    if (data.status) {
      await updateQuestions();
      toast.success("Status updated successfully", { theme: "light" });
    } else {
      toast.error(data.message, { theme: "light" });
    }
  };

  const updateQuestions = async () => {
    const data = await ApiCall({
      query: `
      query getAllQuestion{
        getAllQuestion{
          id,
          question,
          description,
          questionType,
          questionPlan,
          status,
          answer{
            mark,
            rec,
            answer,
          },
          principle{
            name,
            description,
          }
        }
      }
    `,
      veriables: {},
      headers: { authorization: `Bearer ${token}` },
    });
    setQuestions((val) => data.data.getAllQuestion);
  };

  return (
    <>
      <div className="grow bg-[#272934] p-4 w-full overflow-x-hidden">
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
                <div key={index} className="bg-[#31353f] p-4 my-4">
                  <div className="flex gap-6">
                    <p className="text-white font-semibold text-lg">{val.id}</p>
                    <p className="text-white font-semibold text-xl">
                      {val.question}
                    </p>
                    <div className="grow"></div>
                    <div className="cursor-pointer">
                      {val.status == "ACTIVE" ? (
                        <div
                          onClick={() => updateStatus(val.id, "INACTIVE")}
                          className="w-16 py-1 text-white text-xs bg-green-500 text-center rounded-md font-medium"
                        >
                          ACTIVE
                        </div>
                      ) : (
                        <div
                          onClick={() => updateStatus(val.id, "ACTIVE")}
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
                  <p className="text-white font-semibold text-xl">Answers:</p>
                  {val.answer.map((value: any, ind: number) => {
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
                  })}
                  <div className="w-full h-[2px] bg-gray-300 my-2"></div>

                  <p className="text-gray-200 font-semibold text-2lx mt-2">
                    {val.principle.name}
                  </p>
                  <p className="text-gray-200 font-normal text-lg">
                    {val.principle.description}
                  </p>
                  <div className="w-full h-[2px] bg-gray-300 my-2"></div>
                  <p className="text-gray-200 text-2lx mt-2">
                    Question Plan: {val.questionPlan}
                  </p>
                  <p className="text-gray-200 text-2lx mt-2">
                    Question Type: {val.questionType}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default Compliance;
