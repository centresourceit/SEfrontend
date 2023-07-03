// import AsideBarStore, { AdminSideBarTabs } from "~/state/siderbar";
import { LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import sideBarStore, { SideBarTabs } from "~/state/sidebar";
import { userPrefs } from "~/cookies";
import { Fa6RegularStarHalfStroke, Fa6SolidBars, Fa6SolidBook, Fa6SolidBookTanakh, Fa6SolidBuilding, Fa6SolidChartArea, Fa6SolidCircleQuestion, Fa6SolidCodeBranch, Fa6SolidDiagramProject, Fa6SolidEye, Fa6SolidHouse, Fa6SolidObjectUngroup, Fa6SolidPaintbrush, Fa6SolidRulerCombined, Fa6SolidStar, Fa6SolidUser, Fa6SolidXmark, MaterialSymbolsLogoutRounded } from "~/components/icons/Icons";
import { ApiCall } from "~/services/api";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  if (
    cookie == null ||
    cookie == undefined ||
    Object.keys(cookie).length == 0
  ) {
    return redirect("/login");
  }
  const data = await ApiCall({
    query: `
    query getUserById($id:Int!){
      getUserById(id:$id){
        id,
        name,
  		  email,
      },
    }
  `,
    veriables: { id: parseInt(cookie.id) },
    headers: { authorization: `Bearer ${cookie.token}` },
  });
  return json({
    username: data.data.getUserById.name,
    user: cookie,
    isAdmin: cookie.role == "ADMIN" ? true : false,
  });
};

const DashBoard = () => {

  const isMobile = sideBarStore((state) => state.isOpen);
  const changeMobile = sideBarStore((state) => state.change);
  const asideindex = sideBarStore((state) => state.currentIndex);
  const achangeindex = sideBarStore((state) => state.changeTab);
  const user = useLoaderData().user;
  const isAdmin = useLoaderData().isAdmin;
  const username = useLoaderData().username;

  const navigator = useNavigate();

  const init = () => {
    if (isAdmin) {
      achangeindex(SideBarTabs.User);
      navigator("/home/user");
    } else {
      if (asideindex === SideBarTabs.None) {
        navigator("/home");
      }
    }
  };
  useEffect(() => {
    init();
  }, []);

  const logoutHandle = () => {
    navigator("/logout");
  };
  return (
    <>
      <section className="h-screen w-full relative">
        <div className="flex min-h-screen relative flex-nowrap w-full">
          <div
            className={`z-50 w-full md:w-60 bg-primary-800 p-2 md:flex flex-col md:relative fixed top-0 left-0 min-h-screen md:min-h-full md:h-auto ${isMobile ? "grid place-items-center" : "hidden"
              }`}
          >
            <div className="md:flex flex-col md:h-full">
              <div className="text-white text-center mb-4">
                <img
                  src="/images/logo.png"
                  alt="logo"
                  className="w-80 md:w-40 inline-block"
                />
              </div>
              <div className="flex flex-col grow">
                {isAdmin ? (
                  <>
                    <Link
                      to={"/home/user/"}
                      onClick={() => {
                        achangeindex(SideBarTabs.User);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={Fa6SolidUser}
                        title="User"
                        active={asideindex === SideBarTabs.User}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/company/"}
                      onClick={() => {
                        achangeindex(SideBarTabs.Company);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={Fa6SolidBuilding}
                        title="Company"
                        active={asideindex === SideBarTabs.Company}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/project/"}
                      onClick={() => {
                        achangeindex(SideBarTabs.Project);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={Fa6SolidBook}
                        title="Project"
                        active={asideindex === SideBarTabs.Project}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/principle/"}
                      onClick={() => {
                        achangeindex(SideBarTabs.Principle);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={Fa6SolidStar}
                        title="Principle"
                        active={asideindex === SideBarTabs.Principle}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/license/"}
                      onClick={() => {
                        achangeindex(SideBarTabs.License);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={Fa6SolidPaintbrush}
                        title="License"
                        active={asideindex === SideBarTabs.License}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/licenseslave/"}
                      onClick={() => {
                        achangeindex(SideBarTabs.LicenseSlave);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={Fa6RegularStarHalfStroke}
                        title="License Purchased"
                        active={asideindex === SideBarTabs.LicenseSlave}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/compliance/"}
                      onClick={() => {
                        achangeindex(SideBarTabs.Compliance);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={Fa6SolidObjectUngroup}
                        title="Compliance"
                        active={asideindex === SideBarTabs.Compliance}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/questions/"}
                      onClick={() => {
                        achangeindex(SideBarTabs.Questions);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={Fa6SolidCircleQuestion}
                        title="Questions"
                        active={asideindex === SideBarTabs.Questions}
                      ></SidebarTab>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={"/home"}
                      onClick={() => achangeindex(SideBarTabs.None)}
                    >
                      <SidebarTab
                        icon={Fa6SolidChartArea}
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
                        icon={Fa6SolidCodeBranch}
                        title="Take Test"
                        active={asideindex === SideBarTabs.TakeTesk}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/resultstatus/"}
                      onClick={() => {
                        achangeindex(SideBarTabs.RresultStatus);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={Fa6SolidBookTanakh}
                        title="Result"
                        active={asideindex === SideBarTabs.RresultStatus}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/usercompany/"}
                      onClick={() => {
                        achangeindex(SideBarTabs.UserCompany);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={Fa6SolidRulerCombined}
                        title="Company"
                        active={asideindex === SideBarTabs.UserCompany}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/userproject/"}
                      onClick={() => {
                        achangeindex(SideBarTabs.UserProject);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={Fa6SolidDiagramProject}
                        title="Project"
                        active={asideindex === SideBarTabs.UserProject}
                      ></SidebarTab>
                    </Link>
                  </>
                )}

                {/* <div className="grow"></div> */}
                <button onClick={logoutHandle}>
                  <SidebarTab
                    icon={MaterialSymbolsLogoutRounded}
                    title="LOGOUT"
                    active={false}
                  ></SidebarTab>
                </button>
                <div
                  onClick={() => changeMobile(false)}
                  className={`md:hidden flex gap-2 items-center my-1 b  py-1 px-2 rounded-md hover:bg-rose-500 hover:bg-opacity-10 hover:text-rose-500 text-gray-300 cursor-pointer`}
                >
                  <Fa6SolidXmark></Fa6SolidXmark>
                  <p>CLOSE</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col grow bg-primary-700">
            <div className="p-2">
              <TopNavBar
                name={username}
                pic={"/images/avatar/user.jpg"}
              ></TopNavBar>
            </div>
            <Outlet></Outlet>
            <div className="p-2">
              <Footer></Footer>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashBoard;

type SideBarTabProps = {
  title: string;
  icon: React.FC;
  active: boolean;
};
const SidebarTab = (props: SideBarTabProps) => {
  return (
    <div
      className={`w-60 md:w-auto font-semibold flex gap-2 items-center my-1 b  py-1 px-2 rounded-md text-xl cursor-pointer ${props.active
        ? "border border-secondary bg-secondary bg-opacity-10 text-secondary"
        : "text-secondary hover:bg-secondary hover:text-white hover:bg-opacity-25"
        }`}
    >
      <props.icon></props.icon>
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
    <div className="bg-primary-800  text-2xl w-full text-center text-white p-4 font-medium flex gap-4 rounded-md">
      <div className="px md:hidden" onClick={() => changeMobile(!isMobile)}>
        <Fa6SolidBars></Fa6SolidBars>
      </div>
      <div className="px hidden md:block">
        <Fa6SolidHouse></Fa6SolidHouse>
      </div>
      <div className="text-center hidden md:block">Home</div>
      <div className="grow"></div>
      <div></div>
      <div className="flex gap-2 relative group  items-center">
        <div className="cursor-pointer">
          <img
            src={props.pic}
            alt="avatar"
            className="w-8 h-8 rounded-sm object-cover object-center"
          />
        </div>
        <div className="text-white font-medium text-2xl text-center cursor-pointer">
          {props.name}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className="w-full h-14 bg-primary-800 text-center grid place-items-center text-white font-light text-2xl rounded-md">
      &copy; {year} Smart Ethics - All rights reserved.
    </div>
  );
};
