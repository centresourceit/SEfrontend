
import { LoaderArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Fa6SolidHeart } from "~/components/icons/Icons";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";


import Stripe from "stripe";

export async function loader(params: LoaderArgs) {
  const id = params.params.id;

  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);

  const data = await ApiCall({
    query: `
    query getUserResult($searchResultInput:SearchResultInput!){
      getUserResult(searchResultInput:$searchResultInput){
        id,
        certificatedId,
        resultStatus,
        totalScore,
        certified,
        projectId,
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
      },
    }
  `,
    veriables: {
      searchResultInput: {
        projectId: parseInt(id!),
        userId: parseInt(cookie.id)
      }
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });




  const principle = await ApiCall({
    query: `
    query getPrinciple{
        getPrinciple{
          name
        }
      }
      `,
    veriables: {
      id: Number(cookie.id)
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });




  return json({
    result: data.data.getUserResult,
    isResult: data.status,
    token: cookie.token,
    userId: cookie.id,
    strip_key: process.env.STRIP_KEY,
    principle: principle.data.getPrinciple,
    projectid: id
  });
}

const UserDashboard = () => {
  const loader = useLoaderData();
  const userId = loader.userId;
  const isResult = loader.isResult;
  const result = loader.result;
  const projectid = loader.projectid;


  const isFirst = isResult ? result.length >= 1 : false;
  const isSecond = isResult ? result.length >= 2 : false;
  const isThird = isResult ? result.length >= 3 : false;


  const questiondata = isResult ? result[0] : null;
  const principle = loader.principle;

  const totalscoreone = isFirst ? result[0].totalScore : 0;
  const totalscoretwo = isSecond ? result[1].totalScore : 0;
  const totalscorethree = isThird ? result[2].totalScore : 0;

  const quelenone = isFirst ? result[0].assesement.result.length : 0
  const quelentwo = isSecond ? result[1].assesement.result.length : 0
  const quelenthird = isThird ? result[2].assesement.result.length : 0

  const stripkey = useLoaderData().strip_key;

  const stripe = new Stripe(
    stripkey,
    { apiVersion: "2022-11-15" }
  );

  const getMark = (valuepass: any): number[] => {
    const groupedData: Array<{ principleid: number, principlename: string, totalMark: number, questions: Array<any> }> = Object.values(valuepass.assesement.result.reduce((result: any, obj: any) => {
      const { principleid, principlename, mark, ...questionData } = obj;
      if (!result[principleid]) {
        result[principleid] = {
          principleid,
          principlename,
          totalMark: 0,
          questions: []
        };
      }
      result[principleid].totalMark += mark;
      result[principleid].questions.push(obj);
      return result;
    }, {}));
    return groupedData.map((val: any) => val.totalMark);
  }

  const getPrincipleLength = (valuepass: any, index: number): number => {
    const groupedData: number[] = Object.values(valuepass.assesement.result.reduce((result: any, obj: any) => {
      const { principleid, principlename, mark, ...questionData } = obj;
      if (!result[principleid]) {
        result[principleid] = {
          questions: []
        };
      }
      result[principleid].questions.push(obj);
      return result;
    }, {}));

    const principle: any = groupedData[index];
    if (principle && principle.questions) {
      return principle.questions.length;
    }
    return 0;
  }

  const getresult = (val: number): string => {
    if (2.5 > val) return "Not Met";
    if (2.6 <= val && 5 >= val) return "Needs Improvement";
    if (5.1 <= val && 7 >= val) return "Demonstrated";
    if (7.1 <= val && 9 >= val) return "Met";
    if (9.1 <= val) return "Excellent";
    return "Not Met"
  }
  const handlepayment = async () => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Example Product",
              images: [
                "https://plus.unsplash.com/premium_photo-1684952849219-5a0d76012ed2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80",
              ],
            },
            unit_amount: 50000, // Amount in cents
          },
          quantity: 1,
        },
      ],
      success_url: "https://your-website.com/success",
      cancel_url: "https://your-website.com/cancel",
    });
    window.location.assign(session.url == null ? "" : session.url);
  };


  return (
    <>
      <div className="grow  p-4 w-full">
        <h1 className="text-secondary font-medium text-3xl">
          Assessment History and Management Portal for the last Three
          assessments here
        </h1>
        <div className="w-full bg-secondary h-[1px] my-2"></div>
        {isResult == null || !isResult ?
          <div className=" my-4 rounded-md border-l-4 px-2 py-2 bg-rose-500 bg-opacity-20 border-rose-500 w-full">
            <p className="text-rose-500 font-semibold text-2xl">
              You haven't completed any test yet.
            </p>
          </div> :
          <>
            <div className="flex items-center gap-6 my-6">
              <div className="grow">
                <p className="text-green-500 font-semibold text-xl rounded-md border-l-4 border-r-4 px-2 py-2 bg-green-500 bg-opacity-20 border-green-500 text-center">
                  <span className="text-white px-2">
                    Status Of Assessment:
                  </span>
                  {questiondata == null ? "-" : questiondata.resultStatus.toString().toUpperCase()}
                  {/* / Unaproved/ Approved verified */}
                </p>
              </div>
              <h1 className="text-white font-medium text-lg">
                Application id: {questiondata.certificatedId.toString().toUpperCase()}
              </h1>
              <Link to={`/home/taketest/${projectid}`} className="inline-block text-center text-xl py-2 px-4 text-white bg-cyan-500 font-semibold rounded">
                Start Again
              </Link>
            </div>
            {/* <div className="flex gap-6 flex-wrap items-center justify-evenly my-8">
              {
                principle.map((val: any, index: number) => {
                  return (
                    <div key={index} className="bg-white bg-opacity-10 rounded-md p-4">
                      <h1 className="text-white font-medium text-xl">Principle {index + 1}</h1>
                      <p className="text-secondary font-medium text-2xl">
                        {val.name}
                      </p>
                    </div>
                  );
                })
              }
            </div> */}
            <div className="w-full flex gap-6 my-6">
              <div className="grow bg-gray-500 h-[2px]"></div>
              <div className="w-10 bg-gray-300 h-[4px]"></div>
              <div className="grow bg-gray-500 h-[2px]"></div>
            </div>
            <div className="flex flex-col overflow-x-auto border-spacing-10">
              <table className="table-fixed min-w-full">
                <thead>
                  <tr>
                    <th className="w-60 text-secondary font-normal text-3xl">
                      Principles
                    </th>
                    <th className="w-60">
                      <p className="text-secondary font-normal text-2xl">
                        1<sup>st</sup> Attempt
                      </p>
                    </th>
                    <th className="w-60">
                      <p className="text-secondary font-normal  text-2xl">
                        2<sup>st</sup> Attempt
                      </p>
                    </th>
                    <th className="w-60">
                      <p className="text-secondary font-normal  text-2xl">
                        3<sup>st</sup> Attempt
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p className="text-blue-500 font-semibold text-2xl  text-center">
                        {principle[0].name}
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isFirst ? result[0].totalScore == 0 ? "-" : getresult(getMark(result[0])[0] / getPrincipleLength(result[0], 0)) : "-"}
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isSecond ? getresult(getMark(result[1])[0] / getPrincipleLength(result[1], 0)) : "-"}
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isThird ? getresult(getMark(result[2])[0] / getPrincipleLength(result[2], 0)) : "-"}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="text-blue-500 font-semibold text-2xl text-center">
                        {principle[1].name}
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isFirst ? result[0].totalScore == 0 ? "-" : getresult(getMark(result[0])[1] / getPrincipleLength(result[0], 1)) : "-"}
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isSecond ? getresult(getMark(result[1])[1] / getPrincipleLength(result[1], 1)) : "-"}
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isThird ? getresult(getMark(result[2])[1] / getPrincipleLength(result[2], 1)) : "-"}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="text-blue-500 font-semibold text-2xl  text-center">
                        {principle[2].name}
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isFirst ? result[0].totalScore == 0 ? "-" : getresult(getMark(result[0])[2] / getPrincipleLength(result[0], 2)) : "-"}

                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isSecond ? getresult(getMark(result[1])[2] / getPrincipleLength(result[1], 2)) : "-"}
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isThird ? getresult(getMark(result[2])[2] / getPrincipleLength(result[2], 2)) : "-"}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="text-blue-500 font-semibold text-2xl  text-center">
                        {principle[3].name}
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isFirst ? result[0].totalScore == 0 ? "-" : getresult(getMark(result[0])[3] / getPrincipleLength(result[0], 3)) : "-"}
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isSecond ? getresult(getMark(result[1])[3] / getPrincipleLength(result[1], 3)) : "-"}
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isThird ? getresult(getMark(result[2])[3] / getPrincipleLength(result[2], 3)) : "-"}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="text-blue-500 font-semibold text-2xl  text-center">
                        {principle[4].name}
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isFirst ? result[0].totalScore == 0 ? "-" : getresult(getMark(result[0])[4] / getPrincipleLength(result[0], 4)) : "-"}
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isSecond ? getresult(getMark(result[1])[4] / getPrincipleLength(result[1], 4)) : "-"}
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isThird ? getresult(getMark(result[2])[4] / getPrincipleLength(result[2], 4)) : "-"}
                      </p>
                    </td>
                  </tr>
                  <tr className="pt-10">
                    <td>
                      <p className="text-secondary font-semibold text-3xl  text-center">Score:</p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isFirst ? result[0].totalScore == 0 ? 0 : (totalscoreone / quelenone).toFixed(2) : "-"}/10
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isSecond ? (totalscoretwo / quelentwo).toFixed(2) : "-"}/10
                      </p>
                    </td>
                    <td>
                      <p className="text-green-500 font-semibold text-2xl text-center">
                        {isThird ? (totalscorethree / quelenthird).toFixed(2) : "-"}/10
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                    </td>
                    <td className="text-center py-4">
                      {isFirst ?
                        result[0].totalScore == 0 ?
                          <Link to={`/home/taketest/${result[0].projectId}`} className="text-center text-xl py-2 px-4 text-white bg-cyan-500 font-semibold rounded">
                            Complete test
                          </Link>
                          :
                          <Link to={`/home/resultstatus/${result[0].id}`} className="text-center text-xl py-2 px-4 text-white bg-cyan-500 font-semibold rounded">
                            View Result
                          </Link>
                        :
                        null
                      }
                    </td>
                    <td className="text-center py-4">
                      {isSecond ?
                        <Link to={`/home/resultstatus/${result[1].id}`} className="text-center text-xl py-2 px-4 text-white bg-cyan-500 font-semibold rounded">
                          View Result
                        </Link>
                        : null}
                    </td>
                    <td className="text-center py-4">
                      {isThird ?
                        <Link to={`/home/resultstatus/${result[2].projectId}`} className="text-center text-xl py-2 px-4 text-white bg-cyan-500 font-semibold rounded">
                          View Result
                        </Link>
                        : null}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>


            <div className="w-full flex gap-6 my-6">
              <div className="grow bg-gray-500 h-[2px]"></div>
              <div className="w-10 bg-gray-300 h-[4px]"></div>
              <div className="grow bg-gray-500 h-[2px]"></div>
            </div>

            <div className="flex my-8 flex-wrap justify-around gap-8">
              <Link to={"/home/userlicense"} className="bg-primary-800 rounded-md p-4 w-80 cursor-pointer">
                <h1 className="text-secondary font-medium text-3xl text-center">
                  Get your Verified Certificate
                </h1>
                <p className="text-center text-secondary mt-2">
                  (Recommended for Commercial usage)
                </p>
              </Link>
              <Link to={"/home/userlicense"} className="bg-primary-800 rounded-md p-4 w-80 cursor-pointer">
                <h1 className="text-secondary font-medium text-3xl text-center">
                  Get Recommendation
                </h1>
                <p className="text-center text-secondary mt-2">
                  (Recommended for Commercial usage)
                </p>
              </Link>
              <Link to={"/home/userlicense"} className="bg-primary-800 rounded-md p-4 w-80 cursor-pointer">
                <h1 className="text-secondary font-medium text-3xl text-center">
                  Publish Free
                </h1>
                <p className="text-center text-secondary mt-2">
                  (For research and design conceptualisation)
                </p>
              </Link>
            </div>

            <div className="w-full flex gap-6 my-6">
              <div className="grow bg-gray-500 h-[2px]"></div>
              <div className="w-10 bg-gray-300 h-[4px]"></div>
              <div className="grow bg-gray-500 h-[2px]"></div>
            </div>

            <p className="text-green-500 font-semibold text-2xl my-4 rounded-md border-l-4 border-r-4 px-2 py-2 bg-green-500 bg-opacity-20 border-green-500 text-center">
              <span className="text-white">Certificate Status :</span>   {questiondata.certified.toString().toUpperCase()}
              {/* /Commercial if Confidence / Confidential */}
            </p>

            <div className="flex gap-6 items-center">
              <div className="text-rose-500 text-4xl">
                <Fa6SolidHeart></Fa6SolidHeart>
              </div>
              <h1 className="text-white font-medium text-xl">
                "Let's Collaborate, Contribute, & Create Ethical Innovation Together."
              </h1>
              <div>
                <Link
                  to={`/home/feedback/`}
                  className="text-center py-2 px-4 text0 text-white text-xl bg-cyan-500 font-semibold rounded"
                >
                  Feedback
                </Link>
              </div>
            </div>
          </>
        }
      </div>
    </>
  );
};

export default UserDashboard;
