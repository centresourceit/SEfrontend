import axios from "axios";
import { BaseUrl } from "~/const";

type ApiRespose = {
  status: boolean;
  data: any;
  message: string;
};
export const ApiCall = async (args: {
  query: string;
  veriables: {
    [key: string]: unknown;
  };
}): Promise<ApiRespose> => {
  try {
    const req = await axios.post(BaseUrl, {
      query: args.query,
      variables: args.veriables,
    });
    if (
      req.data.data == null ||
      req.data.data == undefined ||
      req.data.data == ""
    )
      return { status: false, data: [], message: req.data.errors[0].message };
    return { status: true, data: req.data.data, message: "" };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { status: false, data: [], message: e.toString() };
    } else {
      return { status: false, data: [], message: "Unknown error" };
    }
  }
};
