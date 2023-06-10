import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import styles from "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export async function loader({ params, request }: LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);

    const data = await ApiCall({
        query: `
        query getPrinciple{
          getPrinciple{
            id,
            name,
            description,
            status
          },
        }
      `,
        veriables: {},
        headers: { authorization: `Bearer ${cookie.token}` },
    });

    return json({ principle: data.data.getPrinciple, token: cookie.token, userId: cookie.id });
}


const AddQuestion: React.FC = (): JSX.Element => {
    const userId = useLoaderData().userId;
    const token = useLoaderData().token;
    const navigator = useNavigate();
    const principels = useLoaderData().principle;

    const question = useRef<HTMLInputElement>(null);
    const qDescription = useRef<HTMLTextAreaElement>(null);

    const qPrinciple = useRef<HTMLSelectElement>(null);
    const qType = useRef<HTMLSelectElement>(null);
    const qPlan = useRef<HTMLSelectElement>(null);

    type answer = {
        answer: string;
        mark: string;
        rec: string;
    }

    const [answers, setAnswers] = useState<{ answer: string; mark: number; rec: string; }[]>([
        {
            answer: "",
            mark: 0,
            rec: "",
        }
    ]);
    const addAnserField = () => {

        if (qType.current?.value == "0") return toast.error("First select the question type.", { theme: "light" });
        if (answers.length > 10) toast.error("You already created max now on answer.", { theme: "light" });
        if (qType.current?.value == "TANDF") {
            if (answers.length < 2) {
                setAnswers(val => [...val, {
                    answer: "",
                    mark: 0,
                    rec: "",
                }]);
            } else {
                toast.error("True and false only create two answer.", { theme: "light" });
            }
        } else {
            setAnswers(val => [...val, {
                answer: "",
                mark: 0,
                rec: "",
            }]);
        }

    }

    const handleAnswerChange = (index: number, value: string) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[index].answer = value;
            return updatedAnswers;
        });
    };
    const handleMarkChange = (index: number, value: string) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[index].mark = parseInt(value.replace(/\D/g, ""));
            return updatedAnswers;
        });
    };
    const handleRecChange = (index: number, value: string) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[index].rec = value;
            return updatedAnswers;
        });
    };

    const handelTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value == "TANDF") {
            if (answers.length > 2) {
                setAnswers(val => val.slice(0, 2))
            }
        }
    };

    const addQuestion = async () => {

        const AnswerScheme = z.object({
            answer: z
                .string()
                .nonempty("Enter Answer in all fields"),
            mark: z
                .number({
                    required_error: "Enter Mark in all fields",
                    invalid_type_error: "Select valid the mark"
                }),
            rec: z
                .string()
                .nonempty("Enter recommendation in all fields"),
        }).strict();

        type AnswerScheme = z.infer<typeof AnswerScheme>;

        const QuestionScheme = z
            .object({
                principleId: z
                    .number({
                        required_error: "Select the principle",
                        invalid_type_error: "Select valid the principle"
                    })
                    .refine(val => val != 0, { message: "Select the principle" }),
                questionType: z
                    .string()
                    .nonempty("Select the question type")
                    .refine(val => val != "0", { message: "Select the question type" }),
                questionPlan: z
                    .string()
                    .nonempty("Select the question plan")
                    .refine(val => val != "0", { message: "Select the question plan" }),
                question: z
                    .string()
                    .nonempty("Question is required."),
                description: z
                    .string()
                    .nonempty("Question Description is required"),
                answer: z.array(AnswerScheme)
            })
            .strict();


        type QuestionScheme = z.infer<typeof QuestionScheme>;

        const answerScheme: QuestionScheme = {
            question: question!.current!.value,
            description: qDescription!.current!.value,
            principleId: parseInt(qPrinciple!.current!.value),
            questionType: qType!.current!.value,
            questionPlan: qPlan!.current!.value,
            answer: answers
        };

        const parsed = QuestionScheme.safeParse(answerScheme);

        if (parsed.success) {
            const data = await ApiCall({
                query: `
                    mutation createQuestion($createQuestionbankInput:CreateQuestionbankInput!){
                        createQuestion(createQuestionbankInput:$createQuestionbankInput){
                          id
                        }
                      }
                  `,
                veriables: {
                    createQuestionbankInput: answerScheme
                },
                headers: { authorization: `Bearer ${token}` },
            });

            if (!data.status) {
                toast.error(data.message, { theme: "light" });
            } else {
                navigator("/home/questions/");
            }
        }
        else { toast.error(parsed.error.errors[0].message, { theme: "light" }); }
    };

    return (<>
        <div className="grow w-full bg-[#272934] p-4  ">
            <h1 className="text-white font-medium text-2xl">Add New Question</h1>
            <div className="bg-gray-400 w-full h-[2px] my-2"></div>

            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Selete Principle
            </h2>
            <select ref={qPrinciple} defaultValue={"0"} className="px-4 bg-transparent fill-none outline-none border-2 border-white text-white py-2 w-96 my-2">
                <option value="0" className="bg-[#272934] text-white text-lg " disabled>Select Principle</option>
                {principels.map((val: any, index: number) => {
                    return (
                        <option key={index} className="bg-[#272934] text-white text-lg" value={val.id}>{val.name}</option>
                    );
                })}
            </select>

            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Question Type
            </h2>

            <select ref={qType} onChange={(e) => handelTypeChange(e)} defaultValue={"0"} className="px-4 bg-transparent fill-none outline-none border-2 border-white text-white py-2 w-96 my-2">
                <option value="0" className="bg-[#272934] text-white text-lg " disabled>Select Question Type</option>
                <option className="bg-[#272934] text-white text-lg" value="MCQ">MCQ</option>
                <option className="bg-[#272934] text-white text-lg" value="SLIDER">SLIDER</option>
                <option className="bg-[#272934] text-white text-lg" value="TANDF">TANDF</option>
                <option className="bg-[#272934] text-white text-lg" value="PERCENTAGE">PERCENTAGE</option>
            </select>

            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Question Plan
            </h2>

            <select ref={qPlan} defaultValue={"0"} className="px-4 bg-transparent fill-none outline-none border-2 border-white text-white py-2 w-96 my-2">
                <option value="0" className="bg-[#272934] text-white text-lg " disabled>Select Question Plan</option>
                <option className="bg-[#272934] text-white text-lg" value="FREE">FREE</option>
                <option className="bg-[#272934] text-white text-lg" value="BUSINESS">BUSINESS</option>
                <option className="bg-[#272934] text-white text-lg" value="PREMIUM">PREMIUM</option>
                <option className="bg-[#272934] text-white text-lg" value="PLATINUM">PLATINUM</option>
            </select>
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Question
            </h2>
            <input
                ref={question}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter Question"
            />
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Question Description
            </h2>
            <textarea
                ref={qDescription}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300 resize-none h-28"
                placeholder="Enter Question Description"
            ></textarea>

            <div>
                <button
                    onClick={addAnserField}
                    className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded mt-4"
                >
                    Add New Answer Field
                </button>
            </div>

            {answers.map((val: { answer: string; mark: number | string; rec: string; }, index: number) => <div key={index} className="p-4 bg-[#1f2129] my-4 bg-opacity-80 rounded-mds">
                <h2 className="text-white font-semibold text-md">
                    <span className="text-green-500 pr-2">&#x2666;</span>
                    Answer {index + 1}
                </h2>
                <div>
                    <input
                        value={val.answer}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                        placeholder="Enter Answer"
                    />
                </div>
                <div>
                    <input
                        value={val.mark}
                        onChange={(e) => handleMarkChange(index, e.target.value)}
                        className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                        placeholder="Enter Mark"
                    />
                </div>
                <div>
                    <input
                        value={val.rec}
                        onChange={(e) => handleRecChange(index, e.target.value)}
                        className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                        placeholder="Enter recommendation"
                    />
                </div>
            </div>)}





            <div>
                <button
                    onClick={addQuestion}
                    className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded mt-4"
                >
                    SUBMIT
                </button>
            </div>
        </div>
        <ToastContainer></ToastContainer>
    </>);
}

export default AddQuestion;