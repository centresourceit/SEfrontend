import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export async function loader(params: LoaderArgs) {
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const data = await ApiCall({
    query: `
    query getPrinciple{
      getPrinciple{
        name,
        QuestionBank{
          id,
          questionType,
          question
          answer{
            answer,
            mark
          }
        }
      },
    }
  `,
    veriables: {},
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  console.log(data.data);

  return json({ questions: data.data.getPrinciple });
}
const TakeTest = () => {
  const questions = useLoaderData().questions;

  let count = 0;

  return (
    <div className="grow bg-[#272934] p-4 w-full">
      <h1 className="text-white font-medium text-4xl">Take Test</h1>
      <div className="w-full bg-slate-400 h-[1px] my-2"></div>
      <h1 className="text-white font-medium text-3xl">Answer the question.</h1>
      {questions.map((val: any, index: number) => (
        <div key={index}>
          <p className="text-green-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-green-500 bg-opacity-20 border-green-500">
            {val.name}
          </p>
          {val.QuestionBank.map((que: any, ind: number) => {
            count++;
            return (
              <div key={ind}>
                {que.questionType == "MCQ" || que.questionType == "TANDF" ? (
                  <MCQQuestions
                    queNumber={count}
                    question={que.question}
                    Options={que.answer}
                  ></MCQQuestions>
                ) : (
                  ""
                )}
                {/* 
                {que.questionType == "TANDF" ? (
                  <TFQuestions
                    queNumber={count}
                    question={que.question}
                  ></TFQuestions>
                ) : (
                  ""
                )} */}
                {que.questionType == "SLIDER" ? (
                  <SliderQuestions
                    queNumber={count}
                    question={que.question}
                    maxnumber={100}
                    step={10}
                    Options={que.answer}
                  ></SliderQuestions>
                ) : (
                  ""
                )}
                {que.questionType == "PERCENTAGE" ? (
                  <PercentQuestions
                    queNumber={count}
                    question={que.question}
                    option={que.answer}
                  ></PercentQuestions>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div className="flex gap-4">
        <Link
          to={"/home/result"}
          className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded"
        >
          SUBMIT
        </Link>
      </div>
    </div>
  );
};

export default TakeTest;

interface MCQQuestionsProps {
  question: string;
  Options: any[];
  queNumber: number;
}
const MCQQuestions: React.FC<MCQQuestionsProps> = (
  props: MCQQuestionsProps
): JSX.Element => {
  return (
    <>
      <div className="bg-white px-8 py-6 rounded-lg my-6 backdrop-filter backdrop-blur-lg bg-opacity-10">
        <h2 className="text-white font-medium text-3xl mb-2">
          {props.queNumber}. {props.question}
        </h2>
        <div className="grid place-items-start grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {props.Options.map((value: any, index: number) => {
            return (
              <div
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
  question: string;
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
  question: string;
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
  console.log(props.Options);
  return (
    <>
      <div className="bg-white px-8 py-6 rounded-lg my-6 backdrop-filter backdrop-blur-lg bg-opacity-10">
        <h2 className="text-white font-medium text-3xl mb-2">
          {props.queNumber}. {props.question}
        </h2>
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
            onChange={(val) => handleChange(parseInt(val.target.value))}
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
  question: string;
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
  return (
    <>
      <div className="bg-white px-8 py-6 rounded-lg my-6 backdrop-filter backdrop-blur-lg bg-opacity-10">
        <h2 className="text-white font-medium text-3xl mb-2">
          {props.queNumber}. {props.question}
        </h2>
        {/* <div className="flex items-center mt-6 justify-center">
          <p className="text-white font-normal text-lg">NOT AT ALL LIKELY</p>
          <div className="w-28 sm:w-60"></div>
          <p className="text-white font-normal text-lg">EXTREMELY LIKELY</p>
        </div> */}
        <div className="flex items-center justify-center">
          {props.option.map((value: any, index: number) => (
            <div
              key={index}
              onClick={() => handleIndex(index)}
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
