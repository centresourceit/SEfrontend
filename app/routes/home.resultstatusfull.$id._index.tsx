import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { toast } from "react-toastify";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export async function loader(params: LoaderArgs) {
  const id = params.params.id;
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const data = await ApiCall({
    query: `
    query searchResult($searchResultInput:SearchResultInput!){
      searchResult(searchResultInput:$searchResultInput){
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
        id: parseInt(id!),
      }
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });


  return json({
    result: data.data.searchResult,
    token: cookie.token,
    id: id
  });
}

const ResultStatus = () => {

  const loader = useLoaderData();
  const result = loader.result[0];
  const id = loader.id;
  const token = loader.token;


  const options: any = {
    scales: {
      x: {
        barThickness: 10,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
        ticks: {
          font: {
            size: 18,
          },
          precision: 0,
          color: 'white',
        },
      },
      y: {
        ticks: {
          font: {
            size: 18,
          },
          color: 'white',
        },
      },
    },
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      labels: {
        color: "white",
      },
      title: {
        display: false,
      },
    },
  };

  const groupedData: Array<{ principleid: number, principlename: string, totalMark: number, questions: Array<any> }> = Object.values(result.assesement.result.reduce((result: any, obj: any) => {

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


  let titles: string[] = [];
  let labels: string[][] = [];
  let mark: number[][] = [];


  groupedData.forEach((val: any, index: number) => {
    titles[index] = val.principlename;
    labels[index] = val.questions.map((val: any) => val.questioncode);
    mark[index] = val.questions.map((val: any) => val.mark);
  });




  const data = titles.map((val: any, index: number) => ({
    labels: labels[index].map((value: any) => value),
    datasets: [
      {
        data: mark[index].map((value: any) => value),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }));
  const navigator = useNavigate();

  const publish = async () => {
    const data = await ApiCall({
      query: `
      mutation publicCertificate($updateResultInput:UpdateResultInput!){
        publicCertificate(updateResultInput:$updateResultInput){
          id,
        }
      }
    `,
      veriables: {
        updateResultInput: {
          id: parseInt(id)
        },
      },
      headers: { authorization: `Bearer ${token}` },
    });
    if (data.status) {
      toast.success("Your certificate published successfully.", { theme: "light" });
    } else {
      toast.error(data.message, { theme: "light" });
    }
  }

  return (
    <div className="grow  p-4 w-full">
      <div className="flex gap-4 flex-wrap">
        <h1 className="text-secondary font-medium text-2xl">Result Status</h1>
        <div className="grow"></div>
        <button onClick={() => { navigator(-1); }} className="text-white text-center font-medium text-xl rounded-full px-4 py-1 bg-cyan-500">Back To Result</button>
      </div>
      <div className="w-full bg-secondary h-[1px] my-2"></div>
      <div className="flex w-full flex-col md:flex-row justify-between my-5 gap-y-8 flex-wrap">
        <div className="grow  flex flex-col lg:flex-row gap-6">
          <div className="grow shrink-0">
            <div className="rounded-full bg-[#865fe5] grid place-items-center w-80 h-80">
              <p className="text-white font-bold text-7xl">
                {(result.totalScore / result.assesement.result.length).toFixed(1)}/10
              </p>
            </div>
            <Link to={"/home/userlicense/"} className="inline-block text-white text-center font-medium text-md rounded-full px-4 my-4 py-2 bg-[#865fe5]">
              Improve with custom Recommendation
            </Link>
          </div>
          <div className="grow px-4 py-2">
            <p className="text-white text-md font-bold">
              Thank you for submitting your assessment.
            </p>
            <p className="text-[#865fe5] font-medium text-2xl">
              Here is your Ethics Alignment Score
            </p>
            <p className="text-white text-md my-6">
              Here is your Unique ID. Use your unique to see your result again
            </p>
            <p className="text-[#865fe5] font-medium text-3xl">{result.certificatedId.toString().toUpperCase()}</p>
            <div className="flex gap-4 my-4">
              <Link to={`/home/taketest/${id}`} className="text-white text-center font-medium text-md rounded-full w-40 py-2 bg-[#865fe5]">
                Start Again
              </Link>
              <a target="_blank" href={`/certificatepdf/${id}`} className="text-white text-center font-medium text-md rounded-full w-40 py-2 bg-[#865fe5]">
                Certificate
              </a>
            </div>
            <p className="text-gray-300 font-medium text-xs">
              For a detailed review from our expert team
            </p>
            <div className="flex gap-4 my-4">
              <Link to={"/contact"} className="text-white text-center font-medium text-md rounded-full w-40 py-2 bg-[#865fe5]">
                Contact us
              </Link>
              <button onClick={publish} className="text-white text-center font-medium text-md rounded-full w-40 py-2 bg-[#865fe5]">
                Publish
              </button>
            </div>
          </div>
        </div>
        {labels.map((val: any, index: number) => (
          <div className="grid place-items-center" key={index}>
            <div className="bg-primary-800 rounded-lg p-4 w-[28rem]">
              <div className="flex gap-x-2">
                <img src="/images/brand/task.png" alt="task" className="w-14" />
                <div>
                  <h2 className="text-white font-medium text-sm">
                    Principle {index + 1}
                  </h2>
                  <h2 className="text-secondary font-medium text-xl">
                    {titles[index]}
                  </h2>
                </div>
              </div>
              <Bar data={data[index]} options={options} />
            </div>
          </div>
        ))}
        {/* <div className="grow">
          <Bar options={options} data={data} />
        </div> */}
      </div>
    </div>
  );
};

export default ResultStatus;
