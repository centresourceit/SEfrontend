import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
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
        questioncode,
        status,
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

  const navigator = useNavigate();


  const [delBox, setDelBox] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);

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
          questioncode,
          status,
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
          }
        }
      }
    `,
      veriables: {},
      headers: { authorization: `Bearer ${token}` },
    });
    setQuestions((val) => data.data.getAllQuestion);
  };


  const deleteQuestion = async () => {
    const data = await ApiCall({
      query: `
      mutation deleteQuestionById($updateQuestionbankInput:UpdateQuestionbankInput!){
        deleteQuestionById(updateQuestionbankInput:$updateQuestionbankInput){
          id
        }
      }
      `,
      veriables: {
        updateQuestionbankInput: {
          id: id,
          deletedAt: Date.now(),
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });

    if (data.status) {
      await updateQuestions();
      toast.success("Question deleted successfully", { theme: "light" });
      setDelBox(val => false);
    } else {
      toast.error(data.message, { theme: "light" });
    }
  };


  return (
    <>
      <div className={`w-full bg-black bg-opacity-40 h-screen fixed z-50 top-0 left-0 ${delBox ? "grid" : "hidden"} place-content-center`}>
        <div className="bg-white rounded-md p-4">
          <h1 className="text-center text-2xl font-semibold">Delete</h1>
          <h3 className="text-lg font-semibold">Are you sure you want to delete?</h3>
          <div className="flex w-full gap-4 mt-2">
            <button
              onClick={() => deleteQuestion()}
              className="py-1 text-white text-lg grow bg-green-500 text-center rounded-md font-medium"
            >
              Delete
            </button>
            <button
              onClick={() => setDelBox(val => false)}
              className="py-1 text-white text-lg grow bg-rose-500 text-center rounded-md font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="grow  p-4 w-full overflow-x-hidden">
        <div className="flex w-full justify-between">
          <h1 className="text-white font-medium text-2xl">Questions</h1>
          <Link to={"/home/addquestion/"} className="text-center py-1 text-white font-semibold text-md px-4 bg-green-500 rounded-md">Add New Questions</Link>
        </div>
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
                    Question Type: {val.questionType}
                  </p>
                  <p className="text-gray-200 text-2lx mt-2">
                    Question code: {val.questioncode.toString().toUpperCase()}
                  </p>
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
                  <div className="w-full bg-gray-400 h-[2px] my-2"></div>
                  <p className="text-gray-200 font-semibold text-md text-center w-96">
                    Action
                  </p>
                  <div className="flex gap-4 mt-2 w-96">
                    <button
                      onClick={() => { setId(val.id); setDelBox(val => true); }}
                      className="py-1 text-white text-lg grow bg-rose-500 text-center rounded-md font-medium"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigator(`/home/editquestion/${val.id}`)}
                      className="py-1 text-white text-lg grow bg-cyan-500 text-center rounded-md font-medium"
                    >
                      Update
                    </button>
                  </div>
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
