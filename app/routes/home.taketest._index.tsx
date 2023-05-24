import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";
import answersStore from "~/state/taketest";
import { ToastContainer, toast } from "react-toastify";

import { nanoid } from "nanoid";

import styles from "react-toastify/dist/ReactToastify.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader(params: LoaderArgs) {
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const data = await ApiCall({
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
    questions: data.data.getPrinciple,
    userId: cookie.id,
    token: cookie.token,
  });
}
const TakeTest = () => {
  const questions = useLoaderData().questions;
  const token = useLoaderData().token;
  const userId: number = Number(useLoaderData().userId);

  const answers = answersStore((state) => state.answers);
  const addAnswer = answersStore((state) => state.addAnswer);
  const changeAnswerStatue = answersStore((state) => state.changeAnswerStatue);

  const [quecount, setQuecount] = useState<number>(0);
  let count = 0;

  const navigator = useNavigate();
  const init = async () => {
    let quenum = 0;
    for (let i: number = 0; i < questions.length; i++) {
      quenum += questions[i].question_bank.length;
    }
    setQuecount((val) => quenum);
  };

  useEffect(() => {
    init();
  }, []);

  const saveAndExit = async () => {
    const datau = await ApiCall({
      query: `
      mutation updateResults($updateAnswerInput:UpdateAnswerInput!,$updateResultInput:UpdateResultInput!){
        updateResults(updateAnswerInput:$updateAnswerInput,updateResultInput:$updateResultInput){
          id,
        }
      }
    `,
      veriables: {
        updateAnswerInput: {
          answers: answers,
        },
        updateResultInput: {
          userId: userId,
          projectId: 1,
          licenseId: 1,
          totalScore: 0,
          certificatedId: 0,
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });

    if (datau.status) {
      navigator("/home");
    } else {
      const data = await ApiCall({
        query: `
      mutation createResults($createAnswerInput:CreateAnswerInput!,$createResultInput:CreateResultInput!){
        createResults(createAnswerInput:$createAnswerInput,createResultInput:$createResultInput){
          id
        }
      }
    `,
        veriables: {
          createAnswerInput: {
            answers: answers,
          },
          createResultInput: {
            userId: userId,
            projectId: 1,
            licenseId: 1,
            totalScore: 0,
            certificatedId: 0,
          },
        },
        headers: { authorization: `Bearer ${token}` },
      });
      if (data.status) {
        navigator("/home");
      } else {
        toast.error(data.message, { theme: "light" });
      }
    }
  };

  const submit = async () => {
    changeAnswerStatue();

    let totalScore1 = 0;
    answers.forEach((ans) => {
      totalScore1 += Number(ans.mark) || 0;
    });

    const datau = await ApiCall({
      query: `
      mutation updateResults($updateAnswerInput:UpdateAnswerInput!,$updateResultInput:UpdateResultInput!){
        updateResults(updateAnswerInput:$updateAnswerInput,updateResultInput:$updateResultInput){
          id,
        }
      }
    `,
      veriables: {
        updateAnswerInput: {
          answers: answers,
        },
        updateResultInput: {
          userId: userId,
          projectId: 1,
          licenseId: 1,
          totalScore: totalScore1,
          certificatedId: nanoid(10),
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });

    if (datau.status) {
      navigator("/home/result");
    } else {
      let totalScore = 0;
      answers.forEach((ans) => {
        totalScore += Number(ans.mark) || 0;
      });

      const data = await ApiCall({
        query: `
      mutation createResults($createAnswerInput:CreateAnswerInput!,$createResultInput:CreateResultInput!){
        createResults(createAnswerInput:$createAnswerInput,createResultInput:$createResultInput){
          id
        }
      }
    `,
        veriables: {
          createAnswerInput: {
            answers: answers,
          },
          createResultInput: {
            userId: userId,
            projectId: 1,
            licenseId: 1,
            totalScore: totalScore,
            certificatedId: nanoid(10),
          },
        },
        headers: { authorization: `Bearer ${token}` },
      });
      if (data.status) {
        navigator("/home/result");
      } else {
        toast.error(data.message, { theme: "light" });
      }
    }
  };

  return (
    <>
      <div className="grow bg-[#272934] p-4 w-full">
        <h1 className="text-white font-medium text-4xl">Take Test</h1>
        <div className="w-full bg-slate-400 h-[1px] my-2"></div>
        <div className="flex flex-wrap items-center mt-4">
          <h1 className="text-white font-medium text-3xl">
            Answer the question.
          </h1>
          <div className="grow"></div>
          <p className="text-cyan-500 font-semibold text-2xl rounded-md border-l-4 px-2 py-2 bg-cyan-500 bg-opacity-20 border-cyan-500">
            Apprpx time to complete: {quecount * 2} Minutes
          </p>
        </div>
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

        <div className="flex gap-4">
          <button
            onClick={saveAndExit}
            className="text-center py-2 px-4 text-white bg-cyan-500 font-semibold rounded hover:scale-105 transition-all"
          >
            SAVE AND EXIT
          </button>

          {answers.length == quecount ? (
            <button
              onClick={submit}
              className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded hover:scale-105 transition-all"
            >
              SUBMIT
            </button>
          ) : null}
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
};

export default TakeTest;

interface MCQQuestionsProps {
  questionsId: number;
  question: string;
  description: string;
  Options: any[];
  queNumber: number;
}
const MCQQuestions: React.FC<MCQQuestionsProps> = (
  props: MCQQuestionsProps
): JSX.Element => {
  const answers = answersStore((state) => state.answers);
  const addAnswer = answersStore((state) => state.addAnswer);
  return (
    <>
      <div className="bg-white px-8 py-6 rounded-lg my-6 backdrop-filter backdrop-blur-lg bg-opacity-10">
        <h2 className="text-white font-medium text-3xl mb-2">
          {props.queNumber}. {props.question}
        </h2>
        <h4 className="text-white font-medium text-xl mb-2">
          {props.description}
        </h4>
        <div className="grid place-items-start grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {props.Options.map((value: any, index: number) => {
            return (
              <div
                onClick={() =>
                  addAnswer({
                    question: props.question,
                    answer: value.answer,
                    mark: value.mark,
                    rec: value.rec,
                    questionId: props.questionsId,
                  })
                }
                className="flex items-center gap-4 border-2 border-[#3d3f49] border-dashed hover:border-gray-300  w-full py-2 px-4"
                key={index}
              >
                <input
                  type="radio"
                  name={`question${props.queNumber}`}
                  id={`opt${index}${props.queNumber}`}
                  className="w-5 h-5 fill-none outline-none shrink-0 accent-emerald-500"
                />
                <label
                  htmlFor={`opt${index}${props.queNumber}`}
                  className="text-white text-2xl"
                >
                  {props.Options[index].answer}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

interface TFQuestionsProps {
  questionsId: number;
  question: string;
  description: string;
  queNumber: number;
}

const TFQuestions: React.FC<TFQuestionsProps> = (
  props: TFQuestionsProps
): JSX.Element => {
  return (
    <>
      <div className="bg-white px-8 py-6 rounded-lg my-6 backdrop-filter backdrop-blur-lg bg-opacity-10">
        <h2 className="text-white font-medium text-3xl mb-2">
          {props.queNumber}. {props.question}
        </h2>
        <h4 className="text-white font-medium text-xl mb-2">
          {props.description}
        </h4>
        <div className="grid place-items-start grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-4 border-2 border-[#3d3f49] border-dashed hover:border-gray-300  w-full py-2 px-4">
            <input
              type="radio"
              name={`question${props.queNumber}`}
              id={`opt${props.queNumber}true`}
              className="w-5 h-5 fill-none outline-none shrink-0 accent-emerald-500"
            />
            <label
              htmlFor={`opt${props.queNumber}true`}
              className="text-white text-2xl"
            >
              TRUE
            </label>
          </div>

          <div className="flex items-center gap-4 border-2 border-[#3d3f49] border-dashed hover:border-gray-300  w-full py-2 px-4">
            <input
              type="radio"
              name={`question${props.queNumber}`}
              id={`opt${props.queNumber}false`}
              className="w-5 h-5 fill-none outline-none shrink-0 accent-emerald-500"
            />
            <label
              htmlFor={`opt${props.queNumber}false`}
              className="text-white text-2xl"
            >
              FALSE
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

interface SliderQuestionsProps {
  questionsId: number;
  question: string;
  description: string;
  queNumber: number;
  maxnumber: number;
  step: number;
  Options: any[];
}

const SliderQuestions: React.FC<SliderQuestionsProps> = (
  props: SliderQuestionsProps
): JSX.Element => {
  let sliderRef = useRef<HTMLInputElement>();
  const [value, setValue] = useState<number>(0);
  const handleChange = (value: number) => {
    setValue((val) => value);
  };
  const addAnswer = answersStore((state) => state.addAnswer);
  return (
    <>
      <div className="bg-white px-8 py-6 rounded-lg my-6 backdrop-filter backdrop-blur-lg bg-opacity-10">
        <h2 className="text-white font-medium text-xl mb-2">
          {props.queNumber}. {props.question}
        </h2>
        <h4 className="text-white font-medium text-3xl mb-2">
          {props.description}
        </h4>
        <div className=" mt-6 w-full flex gap-4 items-center">
          <input
            ref={sliderRef.current?.value}
            type="range"
            name=""
            id=""
            min={0}
            max={props.Options.length - 1}
            step={1}
            className="accent-emerald-500 w-full h-10"
            defaultValue={0}
            onChange={(val) => {
              handleChange(parseInt(val.target.value));
              addAnswer({
                question: props.question,
                answer: props.Options[value].answer,
                mark: props.Options[value].mark,
                rec: props.Options[value].rec,
                questionId: props.questionsId,
              });
            }}
          />
          <p className="text-white text-3xl font-semibold">
            {props.Options[value].answer}
          </p>
        </div>
        <div className="flex gap-4 justify-between bg-[#272934] rounded-md px-4 py-2">
          {props.Options.map((val: any, index: number) => {
            return (
              <div key={index}>
                <p
                  className={`text-white font-semibold text-xl p-2 py-1 rounded-md  text-center ${
                    value == index ? "bg-green-500" : ""
                  }`}
                >
                  {props.Options[index].answer}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

interface PercentQuestionsProps {
  questionsId: number;
  question: string;
  description: string;
  queNumber: number;
  option: any[];
}

const PercentQuestions: React.FC<PercentQuestionsProps> = (
  props: PercentQuestionsProps
): JSX.Element => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleIndex = (index: number) => {
    setSelected((val) => index);
  };
  const addAnswer = answersStore((state) => state.addAnswer);
  return (
    <>
      <div className="bg-white px-8 py-6 rounded-lg my-6 backdrop-filter backdrop-blur-lg bg-opacity-10">
        <h2 className="text-white font-medium text-3xl mb-2">
          {props.queNumber}. {props.question}
        </h2>
        <h4 className="text-white font-medium text-xl mb-2">
          {props.description}
        </h4>
        {/* <div className="flex items-center mt-6 justify-center">
          <p className="text-white font-normal text-lg">NOT AT ALL LIKELY</p>
          <div className="w-28 sm:w-60"></div>
          <p className="text-white font-normal text-lg">EXTREMELY LIKELY</p>
        </div> */}
        <div className="flex items-center justify-center">
          {props.option.map((value: any, index: number) => (
            <div
              key={index}
              onClick={() => {
                handleIndex(index);
                addAnswer({
                  question: props.question,
                  answer: value.answer,
                  mark: value.mark,
                  rec: value.rec,
                  questionId: props.questionsId,
                });
              }}
              className={`grid place-items-center w-14 h-14 text-white font-medium text-lg border-2 ${
                index == selected
                  ? "bg-green-500 bg-opacity-50"
                  : "bg-transparent"
              }`}
            >
              {value.answer}%
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
