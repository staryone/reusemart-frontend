"use client";

import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { HiChartPie, HiUser, HiChat } from "react-icons/hi";

export default function SideBar() {
  return (
    <Sidebar
      aria-label="Default sidebar example"
      className="fixed top-0 left-0 h-screen w-64"
    >
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="#" icon={HiChartPie}>
            Dashboard
          </SidebarItem>
          <SidebarItem href="/cs/diskusi" icon={HiChat}>
            Diskusi
          </SidebarItem>
          <SidebarItem href="/cs/penitip-master" icon={HiUser}>
            Penitip
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
