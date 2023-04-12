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
import Principles from "~/components/principles";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Public Intelligence" }];
};

export default function principles() {
  return (
    <div>
      <Navbar></Navbar>
      <Principles
        images="/images/ps/ps1.png"
        left={true}
        principle="PRINCIPLE 01"
        title1="Right to"
        title2="Intelligence"
        discriptioin="To protect intellectual capabilities from being displaced by intelligent innovative systems."
        link="/"
      />
      <Principles
        images="/images/ps/ps2.png"
        left={false}
        principle="PRINCIPLE 02"
        title1="Purpose"
        title2="Driven"
        discriptioin="To augment peoples current capabilities and to innovate to solve unexplored and unaddressed problems thereby ensuring innovations add value."
        link="/"
      />
      <Principles
        images="/images/ps/ps3.png"
        left={true}
        principle="PRINCIPLE 03"
        title1="Disruption"
        title2="Prevention"
        discriptioin="To minimise social disruption by taking measures to create seamless and sustainable innovations for existing ecosystems."
        link="/"
      />
      <Principles
        images="/images/ps/ps4.png"
        left={false}
        principle="PRINCIPLE 04"
        title1="Risk"
        title2="Evaluated"
        discriptioin="To reassure innovations are designed for safe, ethical, and inclusive adoption, and the risk are managed by the designer and the user equally."
        link="/"
      />
      <Principles
        images="/images/ps/ps5.png"
        left={true}
        principle="PRINCIPLE 05"
        title1="Accountable"
        title2="Redesign"
        discriptioin="To allow every innovation a fair opportunity to be people-centric, sustainable and accountable by design. Also, allowing existing innovations to embed accountability in their design thinking process and reverse the existing damage."
        link="/"
      />
      <Footer></Footer>
    </div>
  );
}
