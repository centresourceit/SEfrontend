import Login from "~/components/login";
import styles from 'react-toastify/dist/ReactToastify.css';
import type { ActionArgs, LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { userPrefs } from "~/cookies";


export function links() {
  return [{ rel: "stylesheet", href: styles }];
}


export async function loader(params: LoaderArgs) {
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  if (!(cookie == null || cookie == undefined || Object.keys(cookie).length == 0)) {
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
