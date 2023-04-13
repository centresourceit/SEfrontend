import {
  IconDefinition,
  faBarChart,
  faBars,
  faBlog,
  faChartPie,
  faCity,
  faDollarSign,
  faFlag,
  faHome,
  faLanguage,
  faLocationPin,
  faMap,
  faPeopleGroup,
  faRightToBracket,
  faShop,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBandcamp,
  faDeploydog,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
// import AsideBarStore, { AdminSideBarTabs } from "~/state/siderbar";
import { LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import sideBarStore, { SideBarTabs } from "~/state/sidebar";

const DashBoard = () => {
  const isMobile = sideBarStore((state) => state.isOpen);
  const changeMobile = sideBarStore((state) => state.change);
  const asideindex = sideBarStore((state) => state.currentIndex);
  const achangeindex = sideBarStore((state) => state.changeTab);
  const navigator = useNavigate();
  useEffect(() => {
    if (asideindex === SideBarTabs.None) {
      navigator("/home/");
    }
  }, []);
  return (
    <>
      <section className="h-screen w-full relative">
        <div className="h-screen w-screen bg-[#181136] fixed top-0 left-0"></div>
        <div className="flex w-full min-h-screen relative">
          <div
            className={`z-50 w-full md:w-60 bg-[#1f2129] p-2 md:flex flex-col fixed top-0 left-0 min-h-screen md:min-h-full md:h-auto md:relative  ${
              isMobile ? "grid place-items-center" : "hidden"
            }`}
          >
            <div className="md:flex flex-col md:h-full">
              <div className="text-white text-center mb-4">
                <h4 className="text-xl">Smart Ethics</h4>
                <p className="text-md font-bold">USER PANEL</p>
              </div>
              <div className="flex flex-col grow">
                <Link
                  to={"/home"}
                  onClick={() => achangeindex(SideBarTabs.None)}
                >
                  <SidebarTab
                    icon={faBarChart}
                    title="DASHBOARD"
                    active={asideindex === SideBarTabs.None}
                  ></SidebarTab>
                </Link>

                <Link
                  to={"/home/taketest/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.TakeTesk);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faBandcamp}
                    title="Take Test"
                    active={asideindex === SideBarTabs.TakeTesk}
                  ></SidebarTab>
                </Link>

                {/* status change */}
                {/* <Link
                  to={"/home/brand/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.BRAND);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faBandcamp}
                    title="BRAND"
                    active={asideindex === SideBarTabs.BRAND}
                  ></SidebarTab>
                </Link>
                <Link
                  to={"/admin/home/campaign/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.CAMPAIGN);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faFlag}
                    title="CAMPAIGN"
                    active={asideindex === SideBarTabs.CAMPAIGN}
                  ></SidebarTab>
                </Link>
                <Link
                  to={"/admin/home/user/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.USER);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faUser}
                    title="USER"
                    active={asideindex === SideBarTabs.USER}
                  ></SidebarTab>
                </Link>

                <Link
                  to={"/admin/home/category/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.CATEGORY);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faChartPie}
                    title="CATEGORY"
                    active={asideindex === SideBarTabs.CATEGORY}
                  ></SidebarTab>
                </Link>
                <Link
                  to={"/admin/home/market/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.MARKET);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faShop}
                    title="MARKET"
                    active={asideindex === SideBarTabs.MARKET}
                  ></SidebarTab>
                </Link>

                <Link
                  to={"/admin/home/team/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.TEAM);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faPeopleGroup}
                    title="TEAM"
                    active={asideindex === SideBarTabs.TEAM}
                  ></SidebarTab>
                </Link>

                <Link
                  to={"/admin/home/blognews/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.BLOGNEWS);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faBlog}
                    title="BLOG NEWS EVENT"
                    active={asideindex === SideBarTabs.BLOGNEWS}
                  ></SidebarTab>
                </Link>

                <Link
                  to={"/admin/home/country/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.COUNTRY);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faMap}
                    title="COUNTRY"
                    active={asideindex === SideBarTabs.COUNTRY}
                  ></SidebarTab>
                </Link>
                <Link
                  to={"/admin/home/state/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.STATE);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faLocationPin}
                    title="STATE"
                    active={asideindex === SideBarTabs.STATE}
                  ></SidebarTab>
                </Link>
                <Link
                  to={"/admin/home/city/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.CITY);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faCity}
                    title="CITY"
                    active={asideindex === SideBarTabs.CITY}
                  ></SidebarTab>
                </Link>
                <Link
                  to={"/admin/home/language/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.LANGUAGES);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faLanguage}
                    title="LANGUAGES"
                    active={asideindex === SideBarTabs.LANGUAGES}
                  ></SidebarTab>
                </Link>
                <Link
                  to={"/admin/home/currency/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.CURRENCY);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faDollarSign}
                    title="CURRENCY"
                    active={asideindex === SideBarTabs.CURRENCY}
                  ></SidebarTab>
                </Link>
                <Link
                  to={"/admin/home/platforms/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.PLATFORMS);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faFacebook}
                    title="PLATFORMS"
                    active={asideindex === SideBarTabs.PLATFORMS}
                  ></SidebarTab>
                </Link>
                <Link
                  to={"/admin/home/campaigntype/"}
                  onClick={() => {
                    achangeindex(SideBarTabs.CAMPAIGNTYPE);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={faBars}
                    title="CAMPAIGN TYPE"
                    active={asideindex === SideBarTabs.CAMPAIGNTYPE}
                  ></SidebarTab>
                </Link> */}
                {/* <div className="grow"></div> */}
                <Link to={"/login"}>
                  <SidebarTab
                    icon={faRightToBracket}
                    title="LOGOUT"
                    active={false}
                  ></SidebarTab>
                </Link>
                <div
                  onClick={() => changeMobile(false)}
                  className={`md:hidden flex gap-2 items-center my-1 b  py-1 px-2 rounded-md hover:bg-rose-500 hover:bg-opacity-10 hover:text-rose-500 text-gray-300 cursor-pointer`}
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="w-6"
                  ></FontAwesomeIcon>
                  <p>CLOSE</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full grow">
            <TopNavBar
              name={"karan"}
              pic={"/images/avatar/user.jpg"}
            ></TopNavBar>
            <Outlet></Outlet>
            <Footer></Footer>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashBoard;

type SideBarTabProps = {
  title: string;
  icon: IconDefinition;
  active: boolean;
};
const SidebarTab = (props: SideBarTabProps) => {
  return (
    <div
      className={`w-60 md:w-auto font-semibold flex gap-2 items-center my-1 b  py-1 px-2 rounded-md text-sm cursor-pointer ${
        props.active
          ? "border border-green-400 g-green-500 bg-opacity-10 text-green-500 "
          : "text-gray-300 hover:bg-white hover:bg-opacity-10"
      }`}
    >
      <FontAwesomeIcon icon={props.icon} className="w-6"></FontAwesomeIcon>
      <p>{props.title}</p>
    </div>
  );
};

type TopNavBarProps = {
  name: string;
  pic: string;
};

const TopNavBar = (props: TopNavBarProps) => {
  const isMobile = sideBarStore((state) => state.isOpen);
  const changeMobile = sideBarStore((state) => state.change);
  return (
    <div className="bg-[#1f2129]  text-xl w-full text-center text-white py-2 font-medium flex px-2 gap-4">
      <div className="px md:hidden" onClick={() => changeMobile(!isMobile)}>
        {/* on change will be here */}
        <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
      </div>
      <div className="px hidden md:block">
        <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>
      </div>
      <div className="text-center hidden md:block">Home</div>
      <div className="grow"></div>
      {/* <div className="bg-[#31353f] hidden sm:flex rounded-md px-2 gap-2 content-center align-middle items-center text-sm ">
                <FontAwesomeIcon
                    className="text-gray-300"
                    icon={faSearch}
                ></FontAwesomeIcon>
                <input
                    type="text"
                    className="bg-transparent outline-none placeholder:text-gray-300"
                    placeholder="Start typing to search.."
                />
            </div>
            <div className="grow"></div> */}
      <div className="flex gap-2 relative group">
        {/* <div className="absolute w-40 h-60 bg-white z-[23423] right-0 top-8 rounded-md scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all origin-top-right">
          <button>Change</button>
        </div> */}
        <div className="cursor-pointer">
          <img
            src={props.pic}
            alt="avatar"
            className="w-6 h-6 rounded-md object-cover object-center"
          />
        </div>
        <div className="text-white font-medium text-lg text-center cursor-pointer">
          {props.name}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className="w-full h-10 bg-[#1f2129] text-center grid place-items-center text-white font-light text-lg">
      &copy; {year} Smart Ethics - All rights reserved.
    </div>
  );
};
