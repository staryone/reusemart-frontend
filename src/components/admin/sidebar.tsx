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
import toast from "react-hot-toast";
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
        toast.error(errorData.errors || "Login failed");
      }
    } catch {
      toast.error("Internal server error");
    }
  };
  return (
    <Sidebar
      aria-label="Default sidebar example"
      className="fixed top-0 left-0 h-screen w-64"
    >
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="#" icon={HiChartPie} as={Link}>
            Dashboard
          </SidebarItem>
          <SidebarItem href="/admin/pegawai-master" icon={HiUser} as={Link}>
            Pegawai
          </SidebarItem>
          <SidebarItem
            href="/admin/jabatan-master"
            icon={HiBriefcase}
            as={Link}
          >
            Jabatan
          </SidebarItem>
          <SidebarItem
            href="/admin/organisasi-master"
            icon={HiOfficeBuilding}
            as={Link}
          >
            Organisasi
          </SidebarItem>
          <SidebarItem href="/admin/merch-master" icon={HiGift} as={Link}>
            Merchandise
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
