import Register from "~/components/register";
import styles from "react-toastify/dist/ReactToastify.css";
import { ActionArgs, redirect } from "@remix-run/node";
import { userPrefs } from "~/cookies";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
export default function register() {
  return <Register></Register>;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const value = Object.fromEntries(formData);

  return redirect("/home", {
    headers: {
      "Set-Cookie": await userPrefs.serialize(value),
    },
  });
}
