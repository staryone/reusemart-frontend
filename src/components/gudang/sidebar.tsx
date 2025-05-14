"use client";

import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import {
  HiChartPie,
  HiBriefcase,
  HiUser,
  HiOfficeBuilding,
  HiGift,
  HiOutlineLogout,
} from "react-icons/hi";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SideBar() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Berhasil logout");
        router.push("/login");
        router.refresh();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Login failed");
      }
    } catch (error) {
      toast.error("Internal server error");
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
          {/* <SidebarItem href="/admin/pegawai-master" icon={HiUser}>
            Pegawai
          </SidebarItem> */}
          <SidebarItem href="/admin/jabatan-master" icon={HiBriefcase}>
            Penitipan
          </SidebarItem>
          {/* <SidebarItem href="/admin/organisasi-master" icon={HiOfficeBuilding}>
            Organisasi
          </SidebarItem>
          <SidebarItem href="/admin/merch-master" icon={HiGift}>
            Merchandise
          </SidebarItem> */}
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
