import { create } from "zustand";

enum SideBarTabs {
  None,
  Home,
  EditProfile,
  TakeTesk,
  RresultStatus,
  User,
  UserLicense,
  Company,
  Project,
  Principle,
  License,
  Compliance,
  Questions,
  LicenseSlave,
  UserCompany,
  UserProject,
  Gallery,
  Result,
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
