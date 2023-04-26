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
  headers?: {
    [key: string]: string;
  };
}): Promise<ApiRespose> => {
  try {
    const req = await axios.post(
      BaseUrl,
      {
        query: args.query,
        variables: args.veriables,
      },
      { headers: args.headers }
    );
    if (
      req.data.data == null ||
      req.data.data == undefined ||
      req.data.data == ""
    ) {
      if (
        req.data.errors[0].originalError == undefined ||
        req.data.errors[0].originalError == null
      )
        return { status: false, data: [], message: req.data.errors[0].message };
      const errorMessage = Array.isArray(
        req.data.errors[0].originalError.message
      )
        ? req.data.errors[0].originalError.message[0]
        : req.data.errors[0].originalError.message;
      return { status: false, data: [], message: errorMessage };
    }

    return { status: true, data: req.data.data, message: "" };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { status: false, data: [], message: e.toString() };
    } else {
      return { status: false, data: [], message: "Unknown error" };
    }
  }
};
