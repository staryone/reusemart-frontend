"use client";

import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { HiChartPie, HiBriefcase, HiUser, HiOfficeBuilding, HiGift } from "react-icons/hi";

export default function SideBar() {
  return (
      <Sidebar aria-label="Default sidebar example" className="fixed top-0 left-0 h-screen w-64">
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="#" icon={HiChartPie}>
            Dashboard
          </SidebarItem>
          <SidebarItem href="#" icon={HiUser}>
            Pegawai
          </SidebarItem>
          <SidebarItem href="/pages/admin/pegawai-master" icon={HiBriefcase}>
            Jabatan
          </SidebarItem>
          <SidebarItem href="#" icon={HiOfficeBuilding}>
            Organisasi
          </SidebarItem>
          <SidebarItem href="#" icon={HiGift}>
            Merchandise
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
