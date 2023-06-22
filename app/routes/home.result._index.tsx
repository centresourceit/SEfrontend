
import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";
import { MCQQuestions, PercentQuestions, SliderQuestions } from "./home.taketest._index";

export async function loader(params: LoaderArgs) {
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);


  const data = await ApiCall({
    query: `
    query searchResult($searchResultInput:SearchResultInput!){
      searchResult(searchResultInput:$searchResultInput){
        id,
        userId,
        assesement{
          id,
          result{
            question,
            rec,
            answer,
          }
        }
      }
    }
  `,
    veriables: {
      searchResultInput: {
        userId: Number(cookie.id),
        projectId: 1
      }
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  const questions = await ApiCall({
    query: `
    query getPrinciple{
      getPrinciple{
        name,
        question_bank{
          id,
          questionType,
          question,
          description,
          answer{
            answer,
            mark,
            rec
          }
        }
      },
    }
  `,
    veriables: {},
    headers: {
      authorization: `Bearer ${cookie.token}`,
    },
  });

  return json({
    questions: questions.data.getPrinciple,
    result: data.data.searchResult[0],
    token: cookie.token,
    userId: cookie.id,
  });
}


const AdminDashboard = () => {
  const result = useLoaderData().result;
  const questions = useLoaderData().questions;

  let count = 0;

  return (
    <div className="grow bg-[#272934] p-4 w-full">
      <h1 className="text-white font-medium text-4xl">Your Result</h1>
      <div className="w-full bg-slate-400 h-[1px] my-2"></div>
      {questions == null || questions == undefined ? (
        <>
          <p className="text-rose-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500">
            There is no principle.
          </p>
        </>
      ) : (
        questions.map((val: any, index: number) => (
          <div key={index}>
            <p className="text-green-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-green-500 bg-opacity-20 border-green-500">
              {val.name}
            </p>
            {val.question_bank == null || val.question_bank == undefined ? (
              <>
                <p className="text-rose-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500">
                  There is no questions.
                </p>
              </>
            ) : (
              val.question_bank.map((que: any, ind: number) => {
                count++;
                return (
                  <div key={ind}>
                    {que.questionType == "MCQ" ||
                      que.questionType == "TANDF" ? (
                      <MCQQuestions
                        questionsId={que.id}
                        queNumber={count}
                        question={que.question}
                        description={que.description}
                        Options={que.answer}
                      ></MCQQuestions>
                    ) : (
                      ""
                    )}
                    {que.questionType == "SLIDER" ? (
                      <SliderQuestions
                        questionsId={que.id}
                        queNumber={count}
                        question={que.question}
                        description={que.description}
                        maxnumber={100}
                        step={10}
                        Options={que.answer}
                      ></SliderQuestions>
                    ) : (
                      ""
                    )}
                    {que.questionType == "PERCENTAGE" ? (
                      <PercentQuestions
                        questionsId={que.id}
                        queNumber={count}
                        question={que.question}
                        description={que.description}
                        option={que.answer}
                      ></PercentQuestions>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
