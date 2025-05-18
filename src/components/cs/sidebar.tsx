"use client";

import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { HiChartPie, HiUser, HiChat, HiOutlineLogout } from "react-icons/hi";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    } catch {
      toast.error("Internal server error");
    }
  };
  return (
    <Sidebar
      aria-label="Default sidebar example"
      className="fixed top-0 left-0 h-screen w-64 z-10"
    >
      <Toaster />
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="#" icon={HiChartPie} as={Link}>
            Dashboard
          </SidebarItem>
          <SidebarItem href="/cs/diskusi" icon={HiChat} as={Link}>
            Diskusi
          </SidebarItem>
          <SidebarItem href="/cs/penitip-master" icon={HiUser} as={Link}>
            Penitip
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
