import { create } from "zustand";

enum SideBarTabs {
  None,
  MyProfile,
  TakeTesk,
  RresultStatus,
  User,
  Company,
  Project,
  Principle,
  License,
  //   CATEGORY,
  //   COUNTRY,
  //   MARKET,
  //   STATE,
  //   LANGUAGES,
  //   CURRENCY,
  //   PLATFORMS,
  //   CAMPAIGNTYPE,
  //   TEAM,
  //   BLOGNEWS,
  //   BRAND,
  //   USER,
  //   CAMPAIGN,
}

interface SideBarState {
  isOpen: boolean;
  change: (value: boolean) => void;
  currentIndex: SideBarTabs;
  changeTab: (value: SideBarTabs) => void;
}

const sideBarStore = create<SideBarState>()((set) => ({
  isOpen: false,
  change: (value) => set((state) => ({ isOpen: value })),
  currentIndex: SideBarTabs.None,
  changeTab: (value) => set((state) => ({ currentIndex: value })),
}));

export default sideBarStore;

export { SideBarTabs };
