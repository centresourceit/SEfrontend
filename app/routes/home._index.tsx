import {
  faEdit,
  faEye,
  faHeart,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { userPrefs } from "~/cookies";

export async function loader({ params, request }: LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  return json({ userId: cookie.id });
}

const UserDashboard = () => {
  const userId = useLoaderData().userId;

  return (
    <>
      <div className="grow bg-[#272934] p-4 w-full">
        <h1 className="text-white font-medium text-2xl">
          Assessment History and Management Portal for the last Three
          assessments here
        </h1>
        <div className="w-full bg-slate-400 h-[1px] my-2"></div>
        <div className="flex items-center gap-6 my-6">
          <div className="grow">
            <p className="text-green-500 font-semibold text-xl rounded-md border-l-4 border-r-4 px-2 py-2 bg-green-500 bg-opacity-20 border-green-500 text-center">
              <span className="text-white px-2">
                Show BOLD Status Of Assessment here:
              </span>
              Under Review
              {/* / Unaproved/ Approved verified */}
            </p>
          </div>
          <h1 className="text-white font-medium text-lg">
            Application id: 4Df674
          </h1>
        </div>
        <div className="flex gap-6 flex-wrap items-center justify-evenly my-8">
          <div className="bg-white bg-opacity-10 rounded-md p-4">
            <h1 className="text-white font-medium text-3xl">Principle 1</h1>
            <p className="text-[#865fe5] font-medium text-2xl">
              Human Rights & Privacy
            </p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-md p-4">
            <h1 className="text-white font-medium text-3xl">Principle 2</h1>
            <p className="text-[#865fe5] font-medium text-2xl">
              Purpose Realisation
            </p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-md p-4">
            <h1 className="text-white font-medium text-3xl">Principle 3</h1>
            <p className="text-[#865fe5] font-medium text-2xl">
              Sustainability Management
            </p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-md p-4">
            <h1 className="text-white font-medium text-3xl">Principle 4</h1>
            <p className="text-[#865fe5] font-medium text-2xl">
              Risk Evaluation
            </p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-md p-4">
            <h1 className="text-white font-medium text-3xl">Principle 5</h1>
            <p className="text-[#865fe5] font-medium text-2xl">
              Accountable Redesign
            </p>
          </div>
        </div>
        <div className="w-full flex gap-6 my-6">
          <div className="grow bg-gray-500 h-[2px]"></div>
          <div className="w-10 bg-gray-300 h-[4px]"></div>
          <div className="grow bg-gray-500 h-[2px]"></div>
        </div>
        <div className="flex flex-col overflow-x-auto">
          <table className="table-fixed min-w-full">
            <thead>
              <tr>
                <th className="w-60"></th>
                <th className="w-60">
                  <p className="text-white font-normal text-2xl">
                    1<sup>st</sup> Attempt
                  </p>
                </th>
                <th className="w-60">
                  <p className="text-white font-normal  text-2xl">
                    2<sup>st</sup> Attempt
                  </p>
                </th>
                <th className="w-60">
                  <p className="text-white font-normal  text-2xl">
                    3<sup>st</sup> Attempt
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p className="text-white font-semibold text-3xl">
                    Principle 1
                  </p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-3xl text-center">
                    Met
                  </p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-3xl text-center">
                    Met
                  </p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-3xl text-center">
                    Met
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className="text-white font-semibold text-3xl">
                    Principle 2
                  </p>
                </td>
                <td>
                  <p className="text-rose-500 font-semibold text-3xl text-center">
                    Not Met
                  </p>
                </td>
                <td>
                  <p className="text-yellow-500 font-semibold text-3xl text-center">
                    Review
                  </p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-3xl text-center">
                    Met
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className="text-white font-semibold text-3xl">
                    Principle 3
                  </p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-3xl text-center">
                    Met
                  </p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-3xl text-center">
                    Met
                  </p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-3xl text-center">
                    Met
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className="text-white font-semibold text-3xl">
                    Principle 4
                  </p>
                </td>
                <td>
                  <p className="text-yellow-500 font-semibold text-3xl text-center">
                    Review
                  </p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-3xl text-center">
                    Met
                  </p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-3xl text-center">
                    Met
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className="text-white font-semibold text-3xl">
                    Principle 5
                  </p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-3xl text-center">
                    Met
                  </p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-3xl text-center">
                    Met
                  </p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-3xl text-center">
                    Met
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className="text-white font-semibold text-3xl">Score:</p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-2xl text-center">
                    3.1/5
                  </p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-2xl text-center">
                    4.1/5
                  </p>
                </td>
                <td>
                  <p className="text-green-500 font-semibold text-2xl text-center">
                    4.6/5
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex my-4 flex-col sm:flex-row justify-around gap-8">
          <div>
            <button className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded">
              Try the full version (Paid)
            </button>
          </div>
          <div>
            <button className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded">
              Start Again
            </button>
          </div>
        </div>
        <div className="w-full flex gap-6 my-6">
          <div className="grow bg-gray-500 h-[2px]"></div>
          <div className="w-10 bg-gray-300 h-[4px]"></div>
          <div className="grow bg-gray-500 h-[2px]"></div>
        </div>

        <div className="flex my-8 flex-wrap justify-around gap-8">
          <div className="bg-indigo-500 rounded-md py-2 w-80 px-4">
            <h1 className="text-white font-medium text-3xl text-center">
              Get your (Paid) Verified Certificate
            </h1>
            <p className="text-center text-gray-200 mt-2">
              (Recommended for Commercial usage)
            </p>
          </div>
          <div className="bg-indigo-500 rounded-md py-2 w-80 px-4">
            <h1 className="text-white font-medium text-3xl text-center">
              Get your (Paid) Recommendation
            </h1>
            <p className="text-center text-gray-200 mt-2">
              (Recommended for Commercial usage)
            </p>
          </div>
          <div className="bg-indigo-500 rounded-md py-2 w-80 px-4">
            <h1 className="text-white font-medium text-3xl text-center">
              Publish Free
            </h1>
            <p className="text-center text-gray-200 mt-2">
              (for reserch and design conceptualisation)
            </p>
          </div>
        </div>

        <div className="w-full flex gap-6 my-6">
          <div className="grow bg-gray-500 h-[2px]"></div>
          <div className="w-10 bg-gray-300 h-[4px]"></div>
          <div className="grow bg-gray-500 h-[2px]"></div>
        </div>

        <p className="text-green-500 font-semibold text-2xl my-4 rounded-md border-l-4 border-r-4 px-2 py-2 bg-green-500 bg-opacity-20 border-green-500 text-center">
          Confidential
          {/* /Commercial if Confidence / Confidential */}
        </p>

        <div className="flex gap-6 items-center">
          <FontAwesomeIcon
            className="text-rose-500 text-4xl"
            icon={faHeart}
          ></FontAwesomeIcon>
          <h1 className="text-white font-medium text-xl">
            Please share our open framework, submit your feedback and contribute
            to help us improve – your feedback matters, lets change the world!
          </h1>
          <div>
            <Link
              to={`/home/feedback/${userId}/`}
              className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded"
            >
              Feedback
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
