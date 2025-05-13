"use client";

import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { HiChartPie, HiCalendar, HiGift, HiNewspaper } from "react-icons/hi";

export default function SideBar() {
  return (
      <Sidebar aria-label="Default sidebar example" className="fixed top-0 left-0 h-screen w-64">
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="#" icon={HiChartPie}>
            Dashboard
          </SidebarItem>
          <SidebarItem href="/owner/request-donasi" icon={HiGift}>
            Request Donasi
          </SidebarItem>
          <SidebarItem href="/owner/riwayat-donasi" icon={HiCalendar}>
            Riwayat Donasi
          </SidebarItem>
          <SidebarItem href="/owner/laporan" icon={HiNewspaper}>
            Laporan
          </SidebarItem>
          {/* <SidebarItem href="/admin/organisasi-master" icon={HiOfficeBuilding}>
            Organisasi
          </SidebarItem>
          <SidebarItem href="/admin/merch-master" icon={HiGift}>
            Merchandise
          </SidebarItem> */}
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
