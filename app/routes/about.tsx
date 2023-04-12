import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import AboutPage from "~/components/about";
import CardSection from "~/components/home/cards";
import Card from "~/components/home/cards";
import Challenges from "~/components/home/challenges";
import ContactUs from "~/components/home/contactus";
import Footer from "~/components/home/footer";
import Home from "~/components/home/home";
import Managment from "~/components/home/managment";
import Navbar from "~/components/home/navbar";
import Partner from "~/components/home/partner";
import Pi from "~/components/pi";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Public Intelligence" }];
};

export default function Index() {
  return (
    <div>
      <Navbar></Navbar>
      <Pi></Pi>
      <AboutPage></AboutPage>
      <CardSection></CardSection>
      <Challenges></Challenges>
      <Partner></Partner>
      <Footer></Footer>
    </div>
  );
}
