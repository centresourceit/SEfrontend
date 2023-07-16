import { LoaderArgs, json } from "@remix-run/node";
import { RefObject, useEffect, useRef, useState } from "react";
import { userPrefs } from "~/cookies";
import { z } from "zod";
import { toast } from "react-toastify";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { ApiCall } from "~/services/api";



export async function loader({ params, request }: LoaderArgs) {
  const project = params.id;
  const cookieHeader = request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  return json({
    project: project,
    token: cookie.token,
    userId: cookie.id
  });
}

const feedback = () => {
  const loader = useLoaderData();
  const userId = loader.userId;
  const token = loader.token;
  const project = loader.project;
  const feedbackType = useRef<HTMLSelectElement>(null);
  const experienceRate = useRef<HTMLSelectElement>(null);

  const dashboardComment = useRef<HTMLTextAreaElement>(null);
  const toolComment = useRef<HTMLTextAreaElement>(null);
  const generalComments = useRef<HTMLTextAreaElement>(null);

  const navigator = useNavigate();
  const email = useRef<HTMLInputElement>(null);

  const submit = async () => {
    const CommentScheme = z.object({
      principleId: z.number({
        required_error: "Principle ID is required",
        invalid_type_error: "Principle ID must be a number",
      }),
      principle: z.string().nonempty("Principle is required"),
      comment: z.string().optional(),
      status: z.boolean({ required_error: "status is required" }),
      updatedAt: z.date({ required_error: "Date is required" }),
    });
    const FeedbackScheme = z
      .object({
        userId: z.number({
          required_error: "User Id is required",
          invalid_type_error: "User Id must be a number",
        }),
        feedbackType: z
          .string()
          .nonempty("Feedback Type is required")
          .refine((value) => value !== "0", {
            message: "Feedback Type is required",
            path: ["feedbackType"],
          }),
        resultComment: z.string().nonempty("Result Comment is required"),
        experienceRate: z
          .string()
          .nonempty("Experience Rate is required")
          .refine((value) => value !== "0", {
            message: "Experience Rate is required",
            path: ["feedbackType"],
          }),
        toolComment: z.string().nonempty("Tool Comment is required"),
        generalComment: z.string().optional(),
        email: z.string().optional(),
        comments: z
          .array(CommentScheme)
          .optional(),
      })
      .strict();

    type FeedbackScheme = z.infer<typeof FeedbackScheme>;

    const feedback: FeedbackScheme = {
      userId: Number(userId),
      email: email!.current!.value,
      toolComment: toolComment!.current!.value,
      feedbackType: feedbackType!.current!.value,
      experienceRate: experienceRate!.current!.value,
      resultComment: dashboardComment!.current!.value,
      generalComment: generalComments!.current!.value,
      comments: []
    };

    const parsed = FeedbackScheme.safeParse(feedback);
    if (parsed.success) {
      const data = await ApiCall({
        query: `
        mutation createFeedback($createFeedbackInput:CreateFeedbackInput!){
          createFeedback(createFeedbackInput:$createFeedbackInput){
            id,
          }
        }
      `,
        veriables: { createFeedbackInput: feedback },
        headers: { authorization: `Bearer ${token}` },
      });

      if (!data.status) {
        toast.error(data.message, { theme: "light" });
      } else {
        feedbackType!.current!.value = "0";
        experienceRate!.current!.value = "0";

        dashboardComment!.current!.value = "";
        toolComment!.current!.value = "";

        generalComments!.current!.value = "";
        email!.current!.value = "";
        navigator(`/home/resultstatus/${project}`)
      }
    } else {
      toast.error(parsed.error.errors[0].message, { theme: "light" });
    }
  };

  return (
    <>
      <div className="grow  p-4 w-full">
        <h1 className="text-white font-medium text-2xl">Smart Ethics Feedback</h1>
        <div className="bg-gray-400 w-full h-[2px] my-2"></div>
        <div>
          <h2 className="text-white font-semibold text-md">
            <span className="text-green-500 pr-2">&#x2666;</span>
            Select Feedback Type.
          </h2>
          <select
            ref={feedbackType}
            name="feedbackType"
            id="feedbackType"
            defaultValue={"0"}
            className="w-96 fill-none outline-none bg-primary-700 my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300 block"
          >
            <option
              value="0"
              className=" rounded-t-md mt-4 py-2 text-md hidden"
              disabled
            >
              Select Your Feedback Type
            </option>
            <option
              value="General_Feedback"
              className=" rounded-t-md mt-4 py-2 text-md"
            >
              General Feedback
            </option>
            <option
              value="Suggestions"
              className=" rounded-t-md mt-4 py-2  text-md"
            >
              Suggestions
            </option>
            <option
              value="Bug_Report"
              className=" rounded-t-md mt-4 py-2  text-md"
            >
              Bug Report
            </option>
            <option
              value="New_Question_Request"
              className=" rounded-t-md mt-4 py-2 text-md"
            >
              New Question Request
            </option>
            <option
              value="New_Feature_Request"
              className=" rounded-t-md mt-4 py-2  text-md"
            >
              New Feature Request
            </option>
          </select>
          <h2 className="text-white font-semibold text-md">
            <span className="text-green-500 pr-2">&#x2666;</span>
            Provide comments on the Results and Dashboard.
          </h2>
          <textarea
            ref={dashboardComment}
            className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300 resize-none h-28"
            placeholder="Comment on the result and dashborad."
          ></textarea>
          <h2 className="text-white font-semibold text-md">
            <span className="text-green-500 pr-2">&#x2666;</span>
            Select Experience Rating.
          </h2>
          <select
            ref={experienceRate}
            name="experience"
            id="experience"
            defaultValue={"0"}
            className="w-96 fill-none outline-none bg-primary-700 my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300 block"
          >
            <option
              value="0"
              className=" rounded-t-md mt-4 py-2 text-md hidden"
              disabled
            >
              Rate Your Experience
            </option>
            <option
              value="POOR"
              className=" rounded-t-md mt-4 py-2 text-md"
            >
              POOR
            </option>
            <option
              value="SATISFACTORY"
              className=" rounded-t-md mt-4 py-2  text-md"
            >
              SATISFACTORY
            </option>
            <option
              value="GOOD"
              className=" rounded-t-md mt-4 py-2  text-md"
            >
              GOOD
            </option>
            <option
              value="VERY_GOOD"
              className=" rounded-t-md mt-4 py-2 text-md"
            >
              VERY_GOOD
            </option>
            <option
              value="EXCELLENT"
              className=" rounded-t-md mt-4 py-2  text-md"
            >
              EXCELLENT
            </option>
          </select>
          <h2 className="text-white font-semibold text-md">
            <span className="text-green-500 pr-2">&#x2666;</span>
            Provide comments on using the tool.
          </h2>
          <textarea
            ref={toolComment}
            className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300 resize-none h-28"
            placeholder="Write a comment on using the tool."
          ></textarea>
          <h2 className="text-white font-semibold text-md">
            <span className="text-green-500 pr-2">&#x2666;</span>
            Provide any general comments. (optional)
          </h2>
          <textarea
            ref={generalComments}
            className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300 resize-none h-28"
            placeholder="Write a general comments."
          ></textarea>
          <h2 className="text-white font-semibold text-md">
            <span className="text-green-500 pr-2">&#x2666;</span>
            Please provide an e-mail address if you happy to <br />discuss your
            feedback further. (optional)
          </h2>
          <input
            ref={email}
            className="w-96 fill-none outline-none bg-transparent my-2 border-2 border-gray-200 py-2 px-4 text-white placeholder:text-gray-300"
            placeholder="Enter your email address."
          />
          <div></div>
          <button
            onClick={submit}
            className="text-center py-2 px-4 text-white bg-emerald-500 font-semibold rounded mt-4"
          >
            SUBMIT
          </button>
        </div>
      </div>
    </>
  );
};
export default feedback;
