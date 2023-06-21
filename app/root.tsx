import { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useCatch,
  useRouteError,
} from "@remix-run/react";
import { ToastContainer } from "react-toastify";

import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "icon", type: "image/png", href: "/favicon.png" },
];

export const meta: V2_MetaFunction = () => {
  return [{ title: "Smart Ethics" }];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  let error: any = useRouteError();

  if (error.status == 404) {
    return (
      <html>
        <head>
          <title>Error</title>
          <Meta />
          <Links />
        </head>
        <body className="h-screen w-full bg-[#000614] grid place-content-center">
          <div className="grid place-items-center">
            <h2 className="text-white text-[100px] text-center font-bold">
              404
            </h2>
            <p className="text-white text-3xl text-center font-semibold">
              oops!! page not found.
            </p>
            <Link
              to={"/"}
              className={
                "text-white font-medium text-center bg-slate-800 py-2 px-4 mt-4"
              }
            >
              Go to HomePage
            </Link>
          </div>
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>This is an error</title>
      </head>
      <body>
        <main className="h-screen grid place-items-center w-full">
          <div className="bg-red-500 bg-opacity-10 w-96 rounded-md p-4">
            <h1 className="text-red-500 text-2xl font-medium  text-center">
              An Error occurred!
            </h1>
            <p className="text-red-500 text-lg  text-center">{error.data}</p>
            <p className="text-gray-500 text-lg text-center">
              Back to{" "}
              <Link to="/" className="text-blue-500 underline">
                safety!
              </Link>
            </p>
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

