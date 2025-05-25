"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import {
  HiChartPie,
  HiUser,
  HiChat,
  HiOutlineLogout,
  HiGift,
  HiCreditCard,
  HiMenu,
  HiX,
} from "react-icons/hi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CSSideBar() {
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 sm:hidden p-2 bg-white rounded-md shadow-md text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8cd279]"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <Sidebar
        aria-label="Default sidebar example"
        className={`fixed top-0 left-0 h-screen w-64 bg-white transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 sm:w-64`}
      >
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
            <SidebarItem href="/cs/klaim-merchandise" icon={HiGift} as={Link}>
              Klaim Merchandise
            </SidebarItem>
            <SidebarItem
              href="/cs/verif-pembayaran"
              icon={HiCreditCard}
              as={Link}
            >
              Verif Pembayaran
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

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}
