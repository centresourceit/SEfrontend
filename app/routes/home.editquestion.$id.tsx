import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import { z } from "zod";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";


export async function loader({ params, request }: LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);

    const licenses = await ApiCall({
        query: `
        query getAllLicense{
            getAllLicense{
              id,
              licenseType
            },
          }
        `,
        veriables: {},
        headers: { authorization: `Bearer ${cookie.token}` },
    });

    const data = await ApiCall({
        query: `
        query getQuestionById($id: Int!){
            getQuestionById(id: $id){
                id,
                question,
                description,
                questionType,
                questioncode,
                status,
                version,
                questionRefId,
                principle{
                  id
                },
                complince{
                    id
                },
                answer{
                  mark,
                  rec,
                  answer,
                },
                questionPlan{
                  id,
                  licenseType,
                }
            },
        }
      `,
        veriables: {
            id: parseInt(params.id!)
        },
        headers: { authorization: `Bearer ${cookie.token}` },
    });
    return json({
        question: data.data.getQuestionById,
        token: cookie.token,
        userId: cookie.id,
        licenses: licenses.data.getAllLicense,
    });
}


const AddQuestion: React.FC = (): JSX.Element => {
    const loader = useLoaderData();
    const userId = loader.userId;
    const token = loader.token;

    const licenses = loader.licenses;
    const fatchquestion = loader.question;

    const navigator = useNavigate();

    const question = useRef<HTMLInputElement>(null);
    const questionCode = useRef<HTMLInputElement>(null);
    const qDescription = useRef<HTMLTextAreaElement>(null);
    const qPlan = useRef<HTMLSelectElement>(null);


    useEffect(() => {
        question!.current!.value = fatchquestion.question;
        questionCode!.current!.value = fatchquestion.questioncode;
        qDescription!.current!.value = fatchquestion.description;
        qPlan!.current!.value = fatchquestion.questionPlan.id;
        setAnswers(val => fatchquestion.answer);
    }, []);

    const [answers, setAnswers] = useState<{ answer: string; mark: number; rec: string; }[]>([
        {
            answer: "",
            mark: 0,
            rec: "",
        }
    ]);

    const addAnserField = () => {
        if (fatchquestion.questionType == "TANDF") {
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
                licensesId: z
                    .number({
                        required_error: "Select the Question License Plan",
                        invalid_type_error: "Select valid The Question License Plan"
                    })
                    .refine(val => val != 0, { message: "Select the Question License Plan" }),
                question: z
                    .string()
                    .nonempty("Question is required."),
                description: z
                    .string()
                    .nonempty("Question Description is required"),
                answer: z.array(AnswerScheme),
                questionType: z
                    .string()
                    .nonempty("Select the question type")
                    .refine(val => val != "0", { message: "Select the question type" }),
                principleId: z
                    .number({
                        required_error: "Select the principle",
                        invalid_type_error: "Select valid the principle"
                    })
                    .refine(val => val != 0, { message: "Select the principle" }),
                complianceId: z
                    .number({
                        required_error: "Select the compliance",
                        invalid_type_error: "Select valid the compliance"
                    })
                    .refine(val => val != 0, { message: "Select the compliance" }),
                version: z
                    .number({
                        required_error: "Question",
                        invalid_type_error: "Select valid the principle"
                    }),
                questionRefId: z
                    .number({
                        required_error: "Question",
                        invalid_type_error: "Select valid the principle"
                    }),
                questioncode: z
                    .string()
                    .nonempty("Question code is required"),
            })
            .strict();


        type QuestionScheme = z.infer<typeof QuestionScheme>;

        const answerScheme: QuestionScheme = {
            licensesId: parseInt(qPlan!.current!.value),
            question: question!.current!.value,
            description: qDescription!.current!.value,
            answer: answers,
            questionType: fatchquestion.questionType,
            principleId: fatchquestion.principle.id,
            version: fatchquestion.version + 1,
            questionRefId: fatchquestion.questionRefId,
            questioncode: questionCode!.current!.value,
            complianceId: fatchquestion.complince.id
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
        <div className="grow w-full  p-4  ">
            <h1 className="text-white font-medium text-2xl">Add New Question</h1>
            <div className="bg-gray-400 w-full h-[2px] my-2"></div>

            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Question Plan
            </h2>

            <select ref={qPlan} defaultValue={"0"} className="px-4 bg-primary-700 fill-none outline-none border-2 border-white text-white py-2 w-96 my-2">
                <option value="0" className=" text-white text-lg " disabled>Select Question Plan</option>
                {
                    licenses.map((val: any, index: number) => {
                        return (
                            <option key={index} className=" text-white text-lg" value={val.id}>{val.licenseType}</option>
                        );
                    })
                }
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
            <h2 className="text-white font-semibold text-md">
                <span className="text-green-500 pr-2">&#x2666;</span>
                Question Code
            </h2>
            <input
                ref={questionCode}
                className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
                placeholder="Enter Question"
            />

            <div>
                <button
                    onClick={addAnserField}
                    className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded mt-4"
                >
                    Add New Answer Field
                </button>
            </div>

            {answers.map((val: { answer: string; mark: number | string; rec: string; }, index: number) => <div key={index} className="p-4 bg-primary-800 my-4 bg-opacity-80 rounded-mds">
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
    </>);
}

export default AddQuestion;