import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";

const AdminDashboard = () => {
  return (
    <div className="grow bg-[#272934] p-4 w-full">
      <h1 className="text-white font-medium text-4xl">Take Test</h1>
      <div className="w-full bg-slate-400 h-[1px] my-2"></div>
      <h1 className="text-white font-medium text-3xl">Answer the question.</h1>

      <p className="text-green-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-green-500 bg-opacity-20 border-green-500">
        Section 1
      </p>
      <MCQQuestions
        queNumber={1}
        question="MCQ"
        Options={[
          "Option 1",
          "Option 2",
          "Option 3",
          "Option 4",
          "Option 5",
          "Option 6",
          "Option 7",
          "Option 8",
          "Option 9",
          "Option 10",
        ]}
      ></MCQQuestions>
      <TFQuestions queNumber={2} question="True and False"></TFQuestions>
      <SliderQuestions
        queNumber={3}
        question="Slider"
        maxnumber={100}
        step={10}
      ></SliderQuestions>
      <PercentQuestions
        queNumber={4}
        question="Percentage"
      ></PercentQuestions>
      <p className="text-green-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-green-500 bg-opacity-20 border-green-500">
        Section 2
      </p>
      <MCQQuestions
        queNumber={5}
        question="MCQ"
        Options={[
          "Option 1",
          "Option 2",
          "Option 3",
          "Option 4",
          "Option 5",
          "Option 6",
          "Option 7",
          "Option 8",
          "Option 9",
          "Option 10",
        ]}
      ></MCQQuestions>
      <TFQuestions queNumber={6} question="True and False"></TFQuestions>
      <SliderQuestions
        queNumber={7}
        question="Slider"
        maxnumber={100}
        step={10}
      ></SliderQuestions>
      <PercentQuestions
        queNumber={8}
        question="Percentage"
      ></PercentQuestions>

      <div className="flex gap-4">
        <Link to={"/home/result"} className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded">
          SUBMIT
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;


interface MCQQuestionsProps {
  question: string;
  Options: string[];
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
          {props.Options.map((value: string, index: number) => {
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
                  {props.Options[index]}
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
}

const SliderQuestions: React.FC<SliderQuestionsProps> = (
  props: SliderQuestionsProps
): JSX.Element => {
  let sliderRef = useRef<HTMLInputElement>();
  const [value, setValue] = useState<number>(0);
  const handleChange = (value: number) => {
    setValue((val) => value);
  };
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
            max={props.maxnumber}
            step={props.step}
            className="accent-emerald-500 w-full h-10"
            defaultValue={0}
            onChange={(val) => handleChange(parseInt(val.target.value))}
          />
          <p className="text-white text-3xl font-semibold">{value}</p>
        </div>
      </div>
    </>
  );
};

// interface PercentQuestionsProps {
//   question: string;
//   queNumber: number;
//   maxnumber: number;
//   step: number;
// }

// const PercentQuestions: React.FC<PercentQuestionsProps> = (
//   props: PercentQuestionsProps
// ): JSX.Element => {
//   let sliderRef = useRef<HTMLInputElement>();
//   const [value, setValue] = useState<number>(0);
//   const handleChange = (value: number) => {
//     setValue((val) => value);
//   };
//   return (
//     <>
//       <div className="bg-white px-8 py-6 rounded-lg my-6 backdrop-filter backdrop-blur-lg bg-opacity-10">
//         <h2 className="text-white font-medium text-3xl mb-2">
//           {props.queNumber}. {props.question}
//         </h2>
//         <div className=" mt-6 w-full flex gap-4 items-center">
//           <input
//             ref={sliderRef.current?.value}
//             type="range"
//             name=""
//             id=""
//             min={0}
//             max={props.maxnumber}
//             step={props.step}
//             className="accent-emerald-500 w-full h-10"
//             defaultValue={0}
//             onChange={(val) => handleChange(parseInt(val.target.value))}
//           />
//           <p className="text-white text-3xl font-semibold">{value}%</p>
//         </div>
//       </div>
//     </>
//   );
// };

interface PercentQuestionsProps {
  question: string;
  queNumber: number;
}

const PercentQuestions: React.FC<PercentQuestionsProps> = (
  props: PercentQuestionsProps
): JSX.Element => {
  const data: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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
        <div className="flex items-center mt-6 justify-center">
          <p className="text-white font-normal text-lg">NOT AT ALL LIKELY</p>
          <div className="w-28 sm:w-60"></div>
          <p className="text-white font-normal text-lg">EXTREMELY LIKELY</p>
        </div>
        <div className="flex items-center justify-center">
          {data.map((value: number, index: number) => (
            <div
              key={index}
              onClick={() => handleIndex(index)}
              className={`grid place-items-center w-14 h-14 text-white font-medium text-lg border-2 ${
                index == selected ? "bg-green-500 bg-opacity-50" : "bg-transparent"
              }`}
            >
              {value * 10}%
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
