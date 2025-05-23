"use client";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import {
  HiClipboardList,
  HiUser,
  HiOutlineLogout,
  HiCash,
} from "react-icons/hi";
import Image from "next/image";
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
        toast.error(errorData.error || "Login failed");
      }
    } catch {
      toast.error("Internal server error: ");
    }
  };

  return (
    <Sidebar
      aria-label="Default sidebar example"
      className="fixed top-0 left-0 h-screen w-64"
    >
      <Image
        src="/logo.png"
        alt="Logo"
        width={1000}
        height={258}
        className="h-12 w-auto mb-10"
      />
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="/penitip/profil" icon={HiUser} as={Link}>
            Profil
          </SidebarItem>
          <SidebarItem
            href="/penitip/transaksi"
            icon={HiClipboardList}
            as={Link}
          >
            Transaksi
          </SidebarItem>
          <SidebarItem href="/penitip/barang" icon={HiCash} as={Link}>
            Barang
          </SidebarItem>
          <SidebarItem onClick={handleLogout} icon={HiOutlineLogout}>
            Logout
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
