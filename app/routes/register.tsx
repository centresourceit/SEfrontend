import Register from "~/components/register";
import styles from "react-toastify/dist/ReactToastify.css";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { userPrefs } from "~/cookies";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}


export async function loader(params: LoaderArgs) {
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  if (cookie != null || cookie != undefined) {
    return redirect("/home");
  }
  return null;
}
export default function register() {
  return <Register></Register>;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const value = Object.fromEntries(formData);

  return redirect("/license", {
    headers: {
      "Set-Cookie": await userPrefs.serialize(value),
    },
  });
}
