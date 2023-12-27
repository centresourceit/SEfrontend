import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";
import answersStore from "~/state/taketest";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import {
  MCQQuestions,
  PercentQuestions,
  SliderQuestions,
} from "~/components/questions";

export async function loader(params: LoaderArgs) {
  const projectid = params.params.id;
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);

  const data = await ApiCall({
    query: `
    query getPrinciple{
      getPrinciple{
        id,
        name,
        question_bank{
          id,
          questionType,
          question,
          description,
          version,
          questioncode,
          licensesId,
          questionPlan{
            licenseType
          },
          complince{
            name,
            description,
            LearnMoreLink
          },
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

  const getresult = await ApiCall({
    query: `
    query taketest($searchTakeTestInput:SearchTakeTestInput!){
      taketest(searchTakeTestInput:$searchTakeTestInput){
        id,
        userId,
        projectId,
        licenseId,
        totalScore,
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
        }
      }
    }
  `,
    veriables: {
      searchTakeTestInput: {
        userId: parseInt(cookie.id),
        projectId: parseInt(projectid!),
      },
    },
    headers: {
      authorization: `Bearer ${cookie.token}`,
    },
  });

  const license = await ApiCall({
    query: `
    query getUserLicenseSlave($id:Int!){
        getUserLicenseSlave(id:$id){
        licenseTypeId,
        paymentStatus,
        licenseValidity,
        paymentReference,
        paymentAmount,
        createdAt,
            licenseType{
            name,
            paymentAmount,
          licenseType,
          questionAllowed,
          projectPerLicense,
          discountValidTill,          
          }
        }
    }
        `,
    veriables: {
      id: Number(cookie.id),
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  return json({
    questions: data.data.getPrinciple,
    userId: cookie.id,
    token: cookie.token,
    projectid: projectid,
    result: getresult.status ? getresult.data.taketest : null,
    license: license.data.getUserLicenseSlave,
  });
}

const TakeTest = () => {
  const loader = useLoaderData();
  const questions = loader.questions;
  const token = loader.token;
  const userId: number = Number(loader.userId);
  const result = loader.result;
  const projectid = loader.projectid;
  const license = loader.license;

  const cacheAnswer = answersStore((state) => state.cacheAnswer);
  const addCacheAnswer = answersStore((state) => state.addCacheAnswer);
  const clearCache = answersStore((state) => state.clearCache);

  const [quecount, setQuecount] = useState<number>(0);
  let count = 0;

  const navigator = useNavigate();
  const init = async () => {
    let quenum = 0;
    for (let i: number = 0; i < questions.length; i++) {
      for (let j: number = 0; j < questions[i].question_bank.length; j++) {
        if (
          questions[i].question_bank[j].questionPlan.licenseType == "FREE" &&
          license.licenseType.name == "FREE"
        ) {
          quenum++;
        }
        if (
          questions[i].question_bank[j].questionPlan.licenseType == "FREE" &&
          license.licenseType.name == "BUSINESS"
        ) {
          quenum++;
        }
        if (
          questions[i].question_bank[j].questionPlan.licenseType == "FREE" &&
          license.licenseType.name == "PREMIUM"
        ) {
          quenum++;
        }
        if (
          questions[i].question_bank[j].questionPlan.licenseType == "FREE" &&
          license.licenseType.name == "PLATINUM"
        ) {
          quenum++;
        }
        if (
          questions[i].question_bank[j].questionPlan.licenseType ==
            "BUSINESS" &&
          license.licenseType.name == "BUSINESS"
        ) {
          quenum++;
        }
        if (
          questions[i].question_bank[j].questionPlan.licenseType ==
            "BUSINESS" &&
          license.licenseType.name == "PREMIUM"
        ) {
          quenum++;
        }
        if (
          questions[i].question_bank[j].questionPlan.licenseType ==
            "BUSINESS" &&
          license.licenseType.name == "PLATINUM"
        ) {
          quenum++;
        }
        if (
          questions[i].question_bank[j].questionPlan.licenseType == "PREMIUM" &&
          license.licenseType.name == "PREMIUM"
        ) {
          quenum++;
        }
        if (
          questions[i].question_bank[j].questionPlan.licenseType == "PREMIUM" &&
          license.licenseType.name == "PLATINUM"
        ) {
          quenum++;
        }
        if (
          questions[i].question_bank[j].questionPlan.licenseType ==
            "PLATINUM" &&
          license.licenseType.name == "PLATINUM"
        ) {
          quenum++;
        }
      }

      // quenum += questions[i].question_bank.length;
    }

    setQuecount((val) => quenum);
    if (!(result == null || result == undefined)) {
      if (result.totalScore == 0) {
        for (let i = 0; i < result.assesement.result.length; i++) {
          addCacheAnswer({
            id: result.assesement.result[i].id,
            principleid: result.assesement.result[i].principleid,
            principlename: result.assesement.result[i].principlename,
            question: result.assesement.result[i].question,
            answer: result.assesement.result[i].answer,
            mark: result.assesement.result[i].mark,
            rec: result.assesement.result[i].rec,
            version: result.assesement.result[i].version,
            license: result.assesement.result[i].license,
            questioncode: result.assesement.result[i].questioncode,
            questiontype: result.assesement.result[i].questiontype,
            page: 5,
          });
        }
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  const saveAndExit = async () => {
    const sendanswer = [
      ...cacheAnswer[0],
      ...cacheAnswer[1],
      ...cacheAnswer[2],
      ...cacheAnswer[3],
      ...cacheAnswer[4],
      ...cacheAnswer[5],
    ];

    //if user don't done any exam then it's create new save exist
    if (result == null || result == undefined) {
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
            answers: sendanswer,
          },
          createResultInput: {
            userId: userId,
            projectId: Number(projectid),
            licenseId: 1,
            totalScore: 0,
            certificatedId: "0",
          },
        },
        headers: { authorization: `Bearer ${token}` },
      });
      if (data.status) {
        clearCache();
        navigator("/home");
      } else {
        toast.error(data.message, { theme: "light" });
      }
      return;
    }

    // total score data conditons
    if (result.totalScore == 0) {
      const data = await ApiCall({
        query: `
        mutation updateResults($updateAnswerInput:UpdateAnswerInput!,$updateResultInput:UpdateResultInput!){
          updateResults(updateAnswerInput:$updateAnswerInput,updateResultInput:$updateResultInput){
            id,
          }
        }
      `,
        veriables: {
          updateAnswerInput: {
            answers: sendanswer,
          },
          updateResultInput: {
            userId: userId,
            projectId: Number(projectid),
            licenseId: 1,
            totalScore: 0,
            certificatedId: "0",
          },
        },
        headers: { authorization: `Bearer ${token}` },
      });
      if (data.status) {
        clearCache();
        navigator("/home");
      } else {
        toast.error(data.message, { theme: "light" });
      }
      return;
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
            answers: sendanswer,
          },
          createResultInput: {
            userId: userId,
            projectId: Number(projectid),
            licenseId: 1,
            totalScore: 0,
            certificatedId: "0",
          },
        },
        headers: { authorization: `Bearer ${token}` },
      });
      if (data.status) {
        clearCache();
        navigator("/home");
      } else {
        toast.error(data.message, { theme: "light" });
      }
      return;
    }
  };

  const submit = async () => {
    const sendanswer = [
      ...cacheAnswer[0],
      ...cacheAnswer[1],
      ...cacheAnswer[2],
      ...cacheAnswer[3],
      ...cacheAnswer[4],
      ...cacheAnswer[5],
    ];

    let totalScore = 0;
    sendanswer.forEach((ans) => {
      totalScore += Number(ans.mark) || 0;
    });

    //if user don't done any exam then it's create new save exist
    if (result == null || result == undefined) {
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
            answers: sendanswer,
          },
          createResultInput: {
            userId: userId,
            projectId: Number(projectid),
            licenseId: 1,
            totalScore: totalScore,
            certificatedId: nanoid(10),
          },
        },
        headers: { authorization: `Bearer ${token}` },
      });
      if (data.status) {
        clearCache();
        navigator(`/home/quefeedback/${data.data.createResults.id}`);
      } else {
        toast.error(data.message, { theme: "light" });
      }
      return;
    }

    // total score data conditions

    if (result.totalScore == 0) {
      const data = await ApiCall({
        query: `
        mutation updateResults($updateAnswerInput:UpdateAnswerInput!,$updateResultInput:UpdateResultInput!){
          updateResults(updateAnswerInput:$updateAnswerInput,updateResultInput:$updateResultInput){
            id,
          }
        }
      `,
        veriables: {
          updateAnswerInput: {
            answers: sendanswer,
          },
          updateResultInput: {
            userId: userId,
            projectId: Number(projectid),
            licenseId: 1,
            totalScore: totalScore,
            certificatedId: nanoid(10),
          },
        },
        headers: { authorization: `Bearer ${token}` },
      });

      if (data.status) {
        clearCache();
        navigator(`/home/quefeedback/${data.data.updateResults.id}`);
      } else {
        toast.error(data.message, { theme: "light" });
      }
      return;
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
            answers: sendanswer,
          },
          createResultInput: {
            userId: userId,
            projectId: Number(projectid),
            licenseId: 1,
            totalScore: totalScore,
            certificatedId: nanoid(10),
          },
        },
        headers: { authorization: `Bearer ${token}` },
      });
      if (data.status) {
        clearCache();
        navigator(`/home/quefeedback/${data.data.createResults.id}`);
      } else {
        toast.error(data.message, { theme: "light" });
      }
      return;
    }
  };

  const [page, setPage] = useState<number>(0);
  const nextpage = () => {
    if (page < 4) {
      setPage((val) => val + 1);
    }
    window.scrollTo(0, 0);
  };
  const prevpage = () => {
    if (page > 0) {
      setPage((val) => val - 1);
    }
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="fixed bottom-14 left-0 w-full grid place-items-center z-50">
        <div className="flex justify-center gap-2 mx-auto bg-primary-800 p-3 rounded-full">
          {page != 0 ? (
            <button
              onClick={prevpage}
              className="text-center py-2 px-4 text-white bg-cyan-500 font-semibold rounded-full hover:scale-105 transition-all"
            >
              Back
            </button>
          ) : null}

          {page != 4 ? (
            <button
              onClick={nextpage}
              className="text-center py-2 px-4 text-white bg-cyan-500 font-semibold rounded-full hover:scale-105 transition-all"
            >
              Next
            </button>
          ) : null}
          <button
            onClick={saveAndExit}
            className="text-center py-2 px-4 text-white bg-cyan-500 font-semibold rounded-full hover:scale-105 transition-all"
          >
            COMMIT AND EXIT
          </button>

          {page == 4 && cacheAnswer.flat().length == quecount ? (
            <button
              onClick={submit}
              className="text-center py-2 px-4 text-white bg-cyan-500 font-semibold rounded-full hover:scale-105 transition-all"
            >
              SUBMIT
            </button>
          ) : null}

          <Link
            to={`/home/feedback/`}
            className="text-center py-2 px-4 text0 text-white text-xl bg-cyan-500 font-semibold rounded-full"
          >
            Feedback
          </Link>
        </div>
      </div>
      <div className="grow  p-4 w-full">
        <h1 className="text-white font-medium text-4xl">Take Test</h1>
        <div className="w-full bg-slate-400 h-[1px] my-2"></div>
        <div className="flex flex-wrap items-center mt-4">
          <h1 className="text-white font-medium text-3xl">
            Answer the question.
          </h1>
          <div className="grow"></div>
          <p className="text-cyan-500 font-semibold text-2xl rounded-md border-l-4 px-2 py-2 bg-cyan-500 bg-opacity-20 border-cyan-500">
            Approx time to complete: {quecount} Minutes
          </p>
        </div>
        <div className="text-cyan-500 font-semibold text-2xl rounded-md border-l-4 px-2 py-2 bg-cyan-500 bg-opacity-20 border-cyan-500 my-4 flex">
          <p className="">
            Attempted : {cacheAnswer.flat().length}/{quecount}
          </p>
          <div className="grow"></div>{" "}
          <p>
            {Number(100 * (cacheAnswer.flat().length / quecount)).toFixed(0)} %
            Completed
          </p>
        </div>
        {questions == null || questions == undefined ? (
          <>
            <p className="text-rose-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500">
              There is no principle.
            </p>
          </>
        ) : (
          <div>
            <p className="text-green-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-green-500 bg-opacity-20 border-green-500">
              {questions[page].name}
            </p>
            {questions[page].question_bank == null ||
            questions[page].question_bank == undefined ? (
              <>
                <p className="text-rose-500 font-semibold text-2xl my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500">
                  There are no questions.
                </p>
              </>
            ) : (
              questions[page].question_bank.map((que: any, ind: number) => {
                // if(que.questionPlan.licenseType == "FREE" && license.licenseType.name != "FREE") return <></>;
                // if(que.questionPlan.licenseType == "FREE" && license.licenseType.name != "BUSINESS") return <></>;
                // if(que.questionPlan.licenseType == "FREE" && license.licenseType.name != "PREMIUM") return <></>;
                // if(que.questionPlan.licenseType == "FREE" && license.licenseType.name != "PLATINUM") return <></>;
                // if(que.questionPlan.licenseType == "BUSINESS" && license.licenseType.name != "BUSINESS") return <></>;
                // if(que.questionPlan.licenseType == "BUSINESS" && license.licenseType.name != "PREMIUM") return <></>;
                // if(que.questionPlan.licenseType == "BUSINESS" && license.licenseType.name != "PLATINUM") return <></>;
                // if(que.questionPlan.licenseType == "PREMIUM" && license.licenseType.name != "PREMIUM") return <></>;
                // if(que.questionPlan.licenseType == "PREMIUM" && license.licenseType.name != "PLATINUM") return <></>;
                // if(que.questionPlan.licenseType == "PLATINUM" && license.licenseType.name != "PLATINUM") return <></>;

                if (
                  que.questionPlan.licenseType == "BUSINESS" &&
                  license.licenseType.name == "FREE"
                )
                  return <></>;
                if (
                  que.questionPlan.licenseType == "PREMIUM" &&
                  license.licenseType.name == "FREE"
                )
                  return <></>;
                if (
                  que.questionPlan.licenseType == "PREMIUM" &&
                  license.licenseType.name == "BUSINESS"
                )
                  return <></>;
                if (
                  que.questionPlan.licenseType == "PLATINUM" &&
                  license.licenseType.name == "FREE"
                )
                  return <></>;
                if (
                  que.questionPlan.licenseType == "PLATINUM" &&
                  license.licenseType.name == "BUSINESS"
                )
                  return <></>;
                if (
                  que.questionPlan.licenseType == "PLATINUM" &&
                  license.licenseType.name == "PREMIUM"
                )
                  return <></>;

                count++;
                const question = cacheAnswer[page].filter(
                  (val: any) => val.id == que.id
                );
                const selectedquestion = cacheAnswer[5].filter(
                  (val: any) => val.id == que.id
                );
                const data =
                  result == null || result == undefined
                    ? null
                    : result.assesement.result.findIndex(
                        (val: any) => val.id == que.id
                      );
                if (!(result == null || result == undefined)) {
                  if (result.totalScore != 0) {
                    return (
                      <div key={ind}>
                        {que.questionType == "MCQ" ||
                        que.questionType == "TANDF" ? (
                          <MCQQuestions
                            queNumber={count}
                            question={que}
                            pagenumber={page}
                            selected={question[0]}
                            principleid={questions[page].id}
                            principlename={questions[page].name}
                          ></MCQQuestions>
                        ) : (
                          ""
                        )}
                        {que.questionType == "SLIDER" ? (
                          <SliderQuestions
                            queNumber={count}
                            question={que}
                            maxnumber={100}
                            step={10}
                            pagenumber={page}
                            selected={question[0]}
                            principleid={questions[page].id}
                            principlename={questions[page].name}
                          ></SliderQuestions>
                        ) : (
                          ""
                        )}
                        {que.questionType == "PERCENTAGE" ? (
                          <PercentQuestions
                            queNumber={count}
                            question={que}
                            pagenumber={page}
                            selected={question[0]}
                            principleid={questions[page].id}
                            principlename={questions[page].name}
                          ></PercentQuestions>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  } else {
                    if (data == null || data == undefined) {
                      return (
                        <div key={ind}>
                          {que.questionType == "MCQ" ||
                          que.questionType == "TANDF" ? (
                            <MCQQuestions
                              queNumber={count}
                              question={que}
                              pagenumber={page}
                              selected={question[0]}
                              principleid={questions[page].id}
                              principlename={questions[page].name}
                            ></MCQQuestions>
                          ) : (
                            ""
                          )}
                          {que.questionType == "SLIDER" ? (
                            <SliderQuestions
                              queNumber={count}
                              question={que}
                              maxnumber={100}
                              step={10}
                              pagenumber={page}
                              selected={question[0]}
                              principleid={questions[page].id}
                              principlename={questions[page].name}
                            ></SliderQuestions>
                          ) : (
                            ""
                          )}
                          {que.questionType == "PERCENTAGE" ? (
                            <PercentQuestions
                              queNumber={count}
                              question={que}
                              pagenumber={page}
                              selected={question[0]}
                              principleid={questions[page].id}
                              principlename={questions[page].name}
                            ></PercentQuestions>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    } else if (data !== -1) {
                      if (
                        selectedquestion[0] == undefined ||
                        selectedquestion[0] == undefined
                      ) {
                        return <></>;
                      } else {
                        return (
                          <AnswerBox
                            key={ind}
                            question={selectedquestion[0].question}
                            answer={selectedquestion[0].answer}
                            index={count}
                          ></AnswerBox>
                        );
                      }
                    } else {
                      return (
                        <div key={ind}>
                          {que.questionType == "MCQ" ||
                          que.questionType == "TANDF" ? (
                            <MCQQuestions
                              queNumber={count}
                              question={que}
                              pagenumber={page}
                              selected={question[0]}
                              principleid={questions[page].id}
                              principlename={questions[page].name}
                            ></MCQQuestions>
                          ) : (
                            ""
                          )}
                          {que.questionType == "SLIDER" ? (
                            <SliderQuestions
                              queNumber={count}
                              question={que}
                              maxnumber={100}
                              step={10}
                              pagenumber={page}
                              selected={question[0]}
                              principleid={questions[page].id}
                              principlename={questions[page].name}
                            ></SliderQuestions>
                          ) : (
                            ""
                          )}
                          {que.questionType == "PERCENTAGE" ? (
                            <PercentQuestions
                              queNumber={count}
                              question={que}
                              pagenumber={page}
                              selected={question[0]}
                              principleid={questions[page].id}
                              principlename={questions[page].name}
                            ></PercentQuestions>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    }
                  }
                } else {
                  return (
                    <div key={ind}>
                      {que.questionType == "MCQ" ||
                      que.questionType == "TANDF" ? (
                        <MCQQuestions
                          queNumber={count}
                          question={que}
                          pagenumber={page}
                          selected={question[0]}
                          principleid={questions[page].id}
                          principlename={questions[page].name}
                        ></MCQQuestions>
                      ) : (
                        ""
                      )}
                      {que.questionType == "SLIDER" ? (
                        <SliderQuestions
                          queNumber={count}
                          question={que}
                          maxnumber={100}
                          step={10}
                          pagenumber={page}
                          selected={question[0]}
                          principleid={questions[page].id}
                          principlename={questions[page].name}
                        ></SliderQuestions>
                      ) : (
                        ""
                      )}
                      {que.questionType == "PERCENTAGE" ? (
                        <PercentQuestions
                          queNumber={count}
                          question={que}
                          pagenumber={page}
                          selected={question[0]}
                          principleid={questions[page].id}
                          principlename={questions[page].name}
                        ></PercentQuestions>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                }
              })
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TakeTest;

interface AnswerBoxProps {
  index: number;
  question: string;
  answer: string;
}

const AnswerBox: React.FC<AnswerBoxProps> = (
  props: AnswerBoxProps
): JSX.Element => {
  return (
    <>
      <div className="bg-secondary px-8 py-6 rounded-lg my-6 backdrop-filter backdrop-blur-lg bg-opacity-20 border-2 border-secondary">
        <h2 className="text-secondary font-medium text-3xl mb-2">
          {props.index}. {props.question}
        </h2>
        <h4 className="text-white font-normal text-2xl mb-2">
          Answer: {props.answer}
        </h4>
      </div>
    </>
  );
};
