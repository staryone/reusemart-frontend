"use client";

import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import {
  HiChartPie,
  HiCalendar,
  HiGift,
  HiNewspaper,
  HiOutlineLogout,
} from "react-icons/hi";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth/auth";

export default function SideBar() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const token = getToken();

      const response = await fetch("http://localhost:3001/api/pegawai/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        removeToken();
        toast.success("Logout berhasil!");
        router.push("/pegawai/login");
      } else {
        toast.error("Gagal logout dari server");
      }
    } catch (error: any) {
      toast.error("Logout error: ", error);
    }
  };
  return (
    <Sidebar
      aria-label="Default sidebar example"
      className="fixed top-0 left-0 h-screen w-64"
    >
      <Toaster />
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
          <hr />
          <SidebarItem
            onClick={handleLogout}
            icon={HiOutlineLogout}
            className="cursor-pointer mt-2"
          >
            Logout
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
