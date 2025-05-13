"use client";

import { getToken, removeToken } from "@/lib/auth/auth";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { HiClipboardList, HiUser, HiOutlineLogout } from "react-icons/hi";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SideBar() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const token = getToken();

      const response = await fetch("http://localhost:3001/api/penitip/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        removeToken();
        toast.success("Gagal logout berhasil!");
        router.push("/penitip/login");
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
      <Image
        src="/logo.png"
        alt="Logo"
        width={1000}
        height={258}
        className="h-12 w-auto mb-10"
      />
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="/penitip/profil" icon={HiUser}>
            Profil
          </SidebarItem>
          <SidebarItem href="/penitip/history-penjualan" icon={HiClipboardList}>
            History Penjualan
          </SidebarItem>
          <SidebarItem onClick={handleLogout} icon={HiOutlineLogout}>
            Logout
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
