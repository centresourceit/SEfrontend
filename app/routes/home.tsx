// // import AsideBarStore, { AdminSideBarTabs } from "~/state/siderbar";
// import { LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
// import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
// import { useEffect, useState } from "react";
// import sideBarStore, { SideBarTabs } from "~/state/sidebar";
// import { userPrefs } from "~/cookies";
// import { Fa6RegularStarHalfStroke, Fa6SolidBars, Fa6SolidBook, Fa6SolidBookTanakh, Fa6SolidBuilding, Fa6SolidChartArea, Fa6SolidCircleQuestion, Fa6SolidCodeBranch, Fa6SolidDiagramProject, Fa6SolidEye, Fa6SolidHouse, Fa6SolidImages, Fa6SolidObjectUngroup, Fa6SolidPaintbrush, Fa6SolidRulerCombined, Fa6SolidStar, Fa6SolidUser, Fa6SolidUserLarge, Fa6SolidXmark, MaterialSymbolsBoltOutline, MaterialSymbolsDiamondOutline, MaterialSymbolsLogoutRounded } from "~/components/icons/Icons";
// import { ApiCall } from "~/services/api";

// export const loader: LoaderFunction = async (props: LoaderArgs) => {
//   const cookieHeader = props.request.headers.get("Cookie");
//   const cookie: any = await userPrefs.parse(cookieHeader);
//   if (
//     cookie == null ||
//     cookie == undefined ||
//     Object.keys(cookie).length == 0
//   ) {
//     return redirect("/login");
//   }
//   const data = await ApiCall({
//     query: `
//     query getUserById($id:Int!){
//       getUserById(id:$id){
//         id,
//         name,
//   		  email,
//         status
//       },
//     }
//   `,
//     veriables: { id: parseInt(cookie.id) },
//     headers: { authorization: `Bearer ${cookie.token}` },
//   });

//   if (data.data.getUserById.status == "INACTIVE") {
//     return redirect(`/inactiveuser`);
//   };

//   if (data.data.getUserById.status == "ACTIVE") {
//     return redirect(`/inactiveadmin`);
//   };
//   return json({
//     username: data.data.getUserById.name,
//     user: cookie,
//     isAdmin: cookie.role == "ADMIN" ? true : false,
//   });
// };

// const DashBoard = () => {
//   const isMobile = sideBarStore((state) => state.isOpen);
//   const changeMobile = sideBarStore((state) => state.change);
//   const asideindex = sideBarStore((state) => state.currentIndex);
//   const achangeindex = sideBarStore((state) => state.changeTab);
//   const user = useLoaderData().user;
//   const isAdmin = useLoaderData().isAdmin;
//   const username = useLoaderData().username;

//   const navigator = useNavigate();

//   const logoutHandle = () => {
//     navigator("/logout");
//   };
//   return (
//     <>
//       <section className="h-screen w-full relative">
//         <div className="flex min-h-screen gap-x-4 relative flex-nowrap w-full p-4 bg-white">
//           <div
//             className={`shrink-0 z-50 w-full md:w-52 bg-[#2a255f] p-2 md:flex flex-col md:relative fixed top-0 left-0 min-h-screen md:min-h-full md:h-auto  md:rounded-3xl ${isMobile ? "grid place-items-center" : "hidden"
//               }`}
//           >
//             <div className="md:flex flex-col md:h-full">
//               <div className="h-4"></div>
//               <Link to={'/home'} className="text-white text-center mb-4">
//                 <img
//                   src="/images/logo.png"
//                   alt="logo"
//                   className="w-80 md:w-40 inline-block"
//                 />
//               </Link>
//               <div className="md:h-2"></div>
//               <div className="flex flex-col grow">
//                 <Link
//                   to={"/home/"}
//                   onClick={() => {
//                     achangeindex(SideBarTabs.Home);
//                     changeMobile(false);
//                   }}
//                 >
//                   <SidebarTab
//                     icon={Fa6SolidHouse}
//                     title="Home"
//                     active={asideindex === SideBarTabs.Home}
//                   ></SidebarTab>
//                 </Link>
//                 {isAdmin ? (
//                   <>
//                     <Link
//                       to={"/home/user/"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.User);
//                         changeMobile(false);
//                       }}
//                     >
//                       <SidebarTab
//                         icon={Fa6SolidUser}
//                         title="User"
//                         active={asideindex === SideBarTabs.User}
//                       ></SidebarTab>
//                     </Link>
//                     <Link
//                       to={"/home/company/"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.Company);
//                         changeMobile(false);
//                       }}
//                     >
//                       <SidebarTab
//                         icon={Fa6SolidBuilding}
//                         title="Company"
//                         active={asideindex === SideBarTabs.Company}
//                       ></SidebarTab>
//                     </Link>
//                     <Link
//                       to={"/home/project/"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.Project);
//                         changeMobile(false);
//                       }}
//                     >
//                       <SidebarTab
//                         icon={Fa6SolidBook}
//                         title="Project"
//                         active={asideindex === SideBarTabs.Project}
//                       ></SidebarTab>
//                     </Link>
//                     <Link
//                       to={"/home/principle/"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.Principle);
//                         changeMobile(false);
//                       }}
//                     >
//                       <SidebarTab
//                         icon={Fa6SolidStar}
//                         title="Principle"
//                         active={asideindex === SideBarTabs.Principle}
//                       ></SidebarTab>
//                     </Link>
//                     <Link
//                       to={"/home/license/"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.License);
//                         changeMobile(false);
//                       }}
//                     >
//                       <SidebarTab
//                         icon={Fa6SolidPaintbrush}
//                         title="License"
//                         active={asideindex === SideBarTabs.License}
//                       ></SidebarTab>
//                     </Link>
//                     <Link
//                       to={"/home/licenseslave/"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.LicenseSlave);
//                         changeMobile(false);
//                       }}
//                     >
//                       <SidebarTab
//                         icon={Fa6RegularStarHalfStroke}
//                         title="License Purchased"
//                         active={asideindex === SideBarTabs.LicenseSlave}
//                       ></SidebarTab>
//                     </Link>
//                     <Link
//                       to={"/home/compliance/"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.Compliance);
//                         changeMobile(false);
//                       }}
//                     >
//                       <SidebarTab
//                         icon={Fa6SolidObjectUngroup}
//                         title="Compliance"
//                         active={asideindex === SideBarTabs.Compliance}
//                       ></SidebarTab>
//                     </Link>
//                     <Link
//                       to={"/home/questions/"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.Questions);
//                         changeMobile(false);
//                       }}
//                     >
//                       <SidebarTab
//                         icon={Fa6SolidCircleQuestion}
//                         title="Questions"
//                         active={asideindex === SideBarTabs.Questions}
//                       ></SidebarTab>
//                     </Link>
//                     <Link
//                       to={"/home/adminresult/"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.Result);
//                         changeMobile(false);
//                       }}
//                     >
//                       <SidebarTab
//                         icon={MaterialSymbolsBoltOutline}
//                         title="Results"
//                         active={asideindex === SideBarTabs.Result}
//                       ></SidebarTab>
//                     </Link>
//                   </>
//                 ) : (
//                   <>
//                     <Link
//                       to={"/home"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.None);
//                         changeMobile(false);
//                       }}
//                     >
//                       <SidebarTab
//                         icon={Fa6SolidChartArea}
//                         title="DASHBOARD"
//                         active={asideindex === SideBarTabs.None}
//                       ></SidebarTab>
//                     </Link>
//                     <Link
//                       to={"/home/userlicense"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.UserLicense);
//                         changeMobile(false)
//                       }}
//                     >
//                       <SidebarTab
//                         icon={MaterialSymbolsDiamondOutline}
//                         title="LICENSE"
//                         active={asideindex === SideBarTabs.UserLicense}
//                       ></SidebarTab>
//                     </Link>
//                     {/* <Link
//                       to={"/home/gallery"}
//                       onClick={() => achangeindex(SideBarTabs.Gallery)}
//                     >
//                       <SidebarTab
//                         icon={Fa6SolidImages}
//                         title="GALLERY"
//                         active={asideindex === SideBarTabs.Gallery}
//                       ></SidebarTab>
//                     </Link> */}
//                     {/* <Link
//                       to={"/home/taketest/"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.TakeTesk);
//                         changeMobile(false);
//                       }}
//                     >
//                       <SidebarTab
//                         icon={Fa6SolidCodeBranch}
//                         title="Take Test"
//                         active={asideindex === SideBarTabs.TakeTesk}
//                       ></SidebarTab>
//                     </Link>
//                     <Link
//                       to={"/home/resultstatus/"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.RresultStatus);
//                         changeMobile(false);
//                       }}
//                     >
//                       <SidebarTab
//                         icon={Fa6SolidBookTanakh}
//                         title="Result"
//                         active={asideindex === SideBarTabs.RresultStatus}
//                       ></SidebarTab>
//                     </Link> */}
//                     {/* <Link
//                       to={"/home/usercompany/"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.UserCompany);
//                         changeMobile(false);
//                       }}
//                     >
//                       <SidebarTab
//                         icon={Fa6SolidRulerCombined}
//                         title="Company"
//                         active={asideindex === SideBarTabs.UserCompany}
//                       ></SidebarTab>
//                     </Link> */}
//                     {/* <Link
//                       to={"/home/userproject/"}
//                       onClick={() => {
//                         achangeindex(SideBarTabs.UserProject);
//                         changeMobile(false);
//                       }}
//                     >
//                       <SidebarTab
//                         icon={Fa6SolidDiagramProject}
//                         title="Project"
//                         active={asideindex === SideBarTabs.UserProject}
//                       ></SidebarTab>
//                     </Link> */}
//                   </>
//                 )}
//                 <div className="md:grow"></div>
//                 <Link
//                   to={`/home/editprofile/`}
//                   onClick={() => {
//                     achangeindex(SideBarTabs.EditProfile);
//                     changeMobile(false);
//                   }}
//                 >
//                   <SidebarTab
//                     icon={Fa6SolidUserLarge}
//                     title="Profile"
//                     active={asideindex === SideBarTabs.EditProfile}
//                   ></SidebarTab>
//                 </Link>
//                 {/* <div className="grow"></div> */}
//                 <button onClick={logoutHandle}>
//                   <SidebarTab
//                     icon={MaterialSymbolsLogoutRounded}
//                     title="LOGOUT"
//                     active={false}
//                   ></SidebarTab>
//                 </button>
//                 <div
//                   onClick={() => changeMobile(false)}
//                   className={`md:hidden flex gap-2 items-center my-1 b  py-1 px-2 rounded-md hover:bg-rose-500 hover:bg-opacity-10 hover:text-rose-500 text-gray-300 cursor-pointer`}
//                 >
//                   <Fa6SolidXmark></Fa6SolidXmark>
//                   <p>CLOSE</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col grow">
//             <div className="p-2">
//               <TopNavBar
//                 name={username}
//                 pic={"/images/avatar/user.jpg"}
//               ></TopNavBar>
//             </div>
//             <Outlet></Outlet>
//             <div className="p-2">
//               <Footer></Footer>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default DashBoard;

// type SideBarTabProps = {
//   title: string;
//   icon: React.FC;
//   active: boolean;
// };
// const SidebarTab = (props: SideBarTabProps) => {
//   return (
//     <div
//       className={`w-60 md:w-auto font-semibold flex gap-2 items-center my-1 py-1 px-2 rounded-md text-sm cursor-pointer ${props.active
//         ? "bg-secondary text-[#2a255f]"
//         : "text-gray-300 hover:bg-secondary hover:text-[#2a255f]"
//         }`}
//     >
//       <props.icon></props.icon>
//       <p>{props.title.toUpperCase()}</p>
//     </div>
//   );
// };

// type TopNavBarProps = {
//   name: string;
//   pic: string;
// };

// const TopNavBar = (props: TopNavBarProps) => {
//   const isMobile = sideBarStore((state) => state.isOpen);
//   const changeMobile = sideBarStore((state) => state.change);
//   return (
//     <div className="bg-primary-800  text-2xl w-full text-center text-white p-4 font-medium flex gap-4 rounded-md items-center">
//       <div className="px md:hidden" onClick={() => changeMobile(!isMobile)}>
//         <Fa6SolidBars></Fa6SolidBars>
//       </div>
//       <Link to={"/home"} className="px hidden md:block">
//         <Fa6SolidHouse></Fa6SolidHouse>
//       </Link>
//       <Link to={"/home"} className="text-center hidden md:block">Home</Link>
//       <div className="grow"></div>
//       <div className="h-8 w-[2px] bg-white"></div>
//       {/*
//       <div className="flex gap-2 relative group  items-center">
//         <div className="cursor-pointer">
//           <img
//             src={props.pic}
//             alt="avatar"
//             className="w-8 h-8 rounded-sm object-cover object-center"
//           />
//         </div>
//       </div>
//          */}
//       <div className="text-white font-medium text-2xl text-center cursor-pointer">
//         {props.name}
//       </div>
//     </div>
//   );
// };

// const Footer = () => {
//   const year = new Date().getFullYear();
//   return (
//     <div className="flex flex-wrap gap-2 h-14 rounded-2xl px-4 items-center bg-[#e8eae9]">
//       <div className=" text-center grid place-items-center text-primary-900 font-normal text-lg ">
//         &copy; {year} Smart Ethics - All rights reserved.
//       </div>
//       <div className="grow"></div>
//       <div className="flex gap-2 items-center">
//         <Link to="/cookies" className="text-primary-900 font-normal text-sm inline-block pt-1">COOKIES</Link>
//         <div className="text-primary-900 font-normal text-lg">|</div>
//         <Link to="/disclaimer" className="text-primary-900 font-normal text-sm  pt-1">DISCLAIMER</Link>
//         <div className="text-primary-900 font-normal text-lg">|</div>
//         <Link to="/privacypolicy" className="text-primary-900 font-normal text-sm  pt-1">PRIVACY POLICY</Link>
//         <div className="text-primary-900 font-normal text-lg">|</div>
//         <Link to="/usagesterms" className="text-primary-900 font-normal text-sm  pt-1">USAGES TERMS</Link>
//       </div>
//     </div>
//   );
// };

// import AsideBarStore, { AdminSideBarTabs } from "~/state/siderbar";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import sideBarStore, { SideBarTabs } from "~/state/sidebar";
import { userPrefs } from "~/cookies";
import {
  Fa6RegularStarHalfStroke,
  Fa6SolidBars,
  Fa6SolidBook,
  Fa6SolidBuilding,
  Fa6SolidChartArea,
  Fa6SolidCircleQuestion,
  Fa6SolidHouse,
  Fa6SolidObjectUngroup,
  Fa6SolidPaintbrush,
  Fa6SolidStar,
  Fa6SolidUser,
  Fa6SolidUserLarge,
  Fa6SolidXmark,
  MaterialSymbolsBoltOutline,
  MaterialSymbolsDiamondOutline,
  MaterialSymbolsLogoutRounded,
} from "~/components/icons/Icons";
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
        status
      },
    }
  `,
    veriables: { id: parseInt(cookie.id) },
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  if (!data.status) {
    return redirect("/logout");
  }

  // if (data.data.getUserById.status != "ACTIVE") {
  //   return redirect(`/inactiveuser`);
  // };
  // return json({
  //   username: data.data.getUserById.name,
  //   user: cookie,
  //   isAdmin: cookie.role == "ADMIN" ? true : false,
  // });

  if (data.data.getUserById.status == "INACTIVE") {
    return redirect(`/inactiveuser`);
  }

  if (data.data.getUserById.status == "ACTIVE") {
    return redirect(`/inactiveadmin`);
  }
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
  // const user = useLoaderData().user;
  const isAdmin = useLoaderData().isAdmin;
  const username = useLoaderData().username;

  const navigator = useNavigate();

  const logoutHandle = () => {
    navigator("/logout");
  };
  return (
    <>
      <section className="h-screen w-full relative">
        <div className="flex min-h-screen relative flex-nowrap w-full">
          <div
            className={`shrink-0 z-50 w-full md:w-60 bg-primary-800 p-2 md:flex flex-col md:relative fixed top-0 left-0 min-h-screen md:min-h-full md:h-auto ${
              isMobile ? "grid place-items-center" : "hidden"
            }`}
          >
            <div className="md:flex flex-col md:h-full">
              <Link to={"/home"} className="text-white text-center mb-4">
                <img
                  src="/images/logo.png"
                  alt="logo"
                  className="w-80 md:w-40 inline-block"
                />
              </Link>
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
                    <Link
                      to={"/home/adminresult/"}
                      onClick={() => {
                        achangeindex(SideBarTabs.Result);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={MaterialSymbolsBoltOutline}
                        title="Results"
                        active={asideindex === SideBarTabs.Result}
                      ></SidebarTab>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={"/home"}
                      onClick={() => {
                        achangeindex(SideBarTabs.None);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={Fa6SolidChartArea}
                        title="DASHBOARD"
                        active={asideindex === SideBarTabs.None}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/userlicense"}
                      onClick={() => {
                        achangeindex(SideBarTabs.UserLicense);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={MaterialSymbolsDiamondOutline}
                        title="LICENSE"
                        active={asideindex === SideBarTabs.UserLicense}
                      ></SidebarTab>
                    </Link>
                    {/* <Link
                      to={"/home/gallery"}
                      onClick={() => achangeindex(SideBarTabs.Gallery)}
                    >
                      <SidebarTab
                        icon={Fa6SolidImages}
                        title="GALLERY"
                        active={asideindex === SideBarTabs.Gallery}
                      ></SidebarTab>
                    </Link> */}
                    {/* <Link
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
                    </Link> */}
                    {/* <Link
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
                    </Link> */}
                    {/* <Link
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
                    </Link> */}
                  </>
                )}
                <Link
                  to={`/home/editprofile/`}
                  onClick={() => {
                    achangeindex(SideBarTabs.EditProfile);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={Fa6SolidUserLarge}
                    title="Profile"
                    active={asideindex === SideBarTabs.EditProfile}
                  ></SidebarTab>
                </Link>
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
      className={`w-60 md:w-auto font-semibold flex gap-2 items-center my-1 b  py-1 px-2 rounded-md text-xl cursor-pointer ${
        props.active
          ? "border border-secondary bg-secondary bg-opacity-10 text-secondary"
          : "text-secondary hover:bg-secondary hover:text-white hover:bg-opacity-25"
      }`}
    >
      <props.icon></props.icon>
      <p>{props.title.toUpperCase()}</p>
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
    <div className="bg-primary-800  text-2xl w-full text-center text-white p-4 font-medium flex gap-4 rounded-md items-center">
      <div className="px md:hidden" onClick={() => changeMobile(!isMobile)}>
        <Fa6SolidBars></Fa6SolidBars>
      </div>
      <Link to={"/home"} className="px hidden md:block">
        <Fa6SolidHouse></Fa6SolidHouse>
      </Link>
      <Link to={"/home"} className="text-center hidden md:block">
        Home
      </Link>
      <div className="grow"></div>
      <div className="h-8 w-[2px] bg-white"></div>
      {/* 
      <div className="flex gap-2 relative group  items-center">
        <div className="cursor-pointer">
          <img
            src={props.pic}
            alt="avatar"
            className="w-8 h-8 rounded-sm object-cover object-center"
          />
        </div>
      </div>
         */}
      <div className="text-white font-medium text-2xl text-center cursor-pointer">
        {props.name}
      </div>
    </div>
  );
};

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className="flex flex-wrap gap-2 h-14 bg-primary-800  rounded-md px-4 items-center">
      <div className=" text-center grid place-items-center text-white font-light text-sm lg:text-2xl">
        &copy; {year} Smart Ethics - All rights reserved.
      </div>
      <div className="grow"></div>
      <div className="flex gap-2">
        <Link to="/cookies" className="text-white font-semibold text-lg">
          COOKIES
        </Link>
        <div className="h-6 w-[2px] bg-gray-300"></div>
        <Link to="/disclaimer" className="text-white font-semibold text-lg">
          DISCLAIMER
        </Link>
        <div className="h-6 w-[2px] bg-gray-300"></div>
        <Link to="/privacypolicy" className="text-white font-semibold text-lg">
          PRIVACY POLICY
        </Link>
        <div className="h-6 w-[2px] bg-gray-300"></div>
        <Link to="/usagesterms" className="text-white font-semibold text-lg">
          USAGES TERMS
        </Link>
      </div>
    </div>
  );
};
