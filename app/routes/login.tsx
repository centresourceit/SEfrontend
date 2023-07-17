import Login from "~/components/login";
import styles from 'react-toastify/dist/ReactToastify.css';
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

export default function login() {
  return (
    <Login></Login>
  );
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
