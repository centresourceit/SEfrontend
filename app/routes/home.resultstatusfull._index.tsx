import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResultStatus = () => {
  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    scaleFontColor: "#FFFFFF",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      labels: {
        color: "red",
      },
      title: {
        display: false,
      },
    },
  };

  const labels = [
    ["Human First", "Automation level", "Displacement Protection"],
    ["Purpose", "Benefits", "Stakeholder Onboarding"],
    ["Disruption Management", "Measure of Displacement", "Skills Managment"],
    ["Socio Economic Balance", "Needs & wellbeing secured", "Skills Learning"],
    [
      "Trust in Data",
      "Transparently Build",
      "Real World Ready",
      "Seamless & Sustainable",
      "Secure by desing",
    ],
  ];

  // const data: ChartData<"line">[] = [

  // ];
  const data = [
    {
      labels: labels[0],
      datasets: [
        {
          data: [5, 6, 3],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    },
    {
      labels: labels[1],
      datasets: [
        {
          data: [5, 6, 3],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    },
    {
      labels: labels[2],
      datasets: [
        {
          data: [5, 6, 3],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    },
    {
      labels: labels[3],
      datasets: [
        {
          data: [5, 6, 3],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    },
    {
      labels: labels[4],
      datasets: [
        {
          data: [5, 6, 3, 6, 3],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    },
  ];

  const titles = [
    "Right to Intelligence",
    "Purpose Driven",
    "Disruption Prevention",
    "Risk Evaluated",
    "Accountable Re-design",
  ];
  return (
    <div className="grow bg-[#272934] p-4 w-full">
      <h1 className="text-white font-medium text-xl">Result Stauts</h1>
      <div className="w-full bg-slate-400 h-[1px] my-2"></div>
      <div className="flex w-full flex-col md:flex-row justify-between my-5 gap-y-8 flex-wrap">
        <div className="grow  flex flex-col lg:flex-row gap-6">
          <div className="grow shrink-0">
            <div className="rounded-full bg-[#865fe5] grid place-items-center w-80 h-80">
              <p className="text-white font-bold text-7xl">
                3.1<span className="text-3xl font-normal">/5</span>
              </p>
            </div>
            <button className="text-white text-center font-medium text-md rounded-full px-4 my-4 py-2 bg-[#865fe5]">
              Improve with custom Recommendation
            </button>
          </div>
          <div className="grow px-4 py-2">
            <p className="text-white text-md font-bold">
              Thank you for submitting your assessment.
            </p>
            <p className="text-[#865fe5] font-medium text-2xl">
              Here is your Public Intelligence Target trust Score
            </p>
            <p className="text-white text-md my-6">
              Here is your Unique ID. Use your unique to see your result again
            </p>
            <p className="text-[#865fe5] font-medium text-3xl">4DF674</p>
            <div className="flex gap-4 my-4">
              <button className="text-white text-center font-medium text-md rounded-full w-28 py-2 bg-[#865fe5]">
                Start Again
              </button>
              <button className="text-white text-center font-medium text-md rounded-full w-28 py-2 bg-[#865fe5]">
                Share
              </button>
            </div>
            <p className="text-gray-300 font-medium text-xs">
              For a detailed review from our expert team
            </p>
            <div className="flex gap-4 my-4">
              <button className="text-white text-center font-medium text-md rounded-full w-28 py-2 bg-[#865fe5]">
                Contact us
              </button>
              <button className="text-white text-center font-medium text-md rounded-full w-28 py-2 bg-[#865fe5]">
                Publish
              </button>
            </div>
          </div>
        </div>
        {labels.map((val: any, index: number) => (
          <div className="grid place-items-center" key={index}>
            <div className="bg-white rounded-lg p-4">
              <div className="flex gap-x-2">
                <img src="/images/brand/task.png" alt="task" className="w-14" />
                <div>
                  <h2 className="text-gray-600 font-medium text-sm">
                    Principle {index + 1}
                  </h2>
                  <h2 className="text-[#865fe5] font-medium text-xl">
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
