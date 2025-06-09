"use client";

import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarCollapse,
} from "flowbite-react";
import {
  HiChartPie,
  HiCalendar,
  HiGift,
  HiNewspaper,
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
        toast.error(errorData.error || "Login failed");
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
          <SidebarItem href="/owner/request-donasi" icon={HiGift} as={Link}>
            Request Donasi
          </SidebarItem>
          <SidebarItem href="/owner/riwayat-donasi" icon={HiCalendar} as={Link}>
            Riwayat Donasi
          </SidebarItem>
          <SidebarCollapse icon={HiNewspaper} label="Laporan">
            <SidebarItem
              className="text-sm"
              href="/owner/laporan/penjualan-bulanan"
              as={Link}
            >
              Laporan Penjualan
            </SidebarItem>
            <SidebarItem
              className="text-sm"
              href="/owner/laporan/komisi-bulanan"
              as={Link}
            >
              Laporan Komisi
            </SidebarItem>
            <SidebarItem
              className="text-sm"
              href="/owner/laporan/stok-gudang"
              as={Link}
            >
              Laporan Stok Gudang
            </SidebarItem>
            <SidebarItem
              className="text-sm"
              href="/owner/laporan/donasi-barang"
              as={Link}
            >
              Laporan Donasi Barang
            </SidebarItem>
            <SidebarItem
              className="text-sm"
              href="/owner/laporan/rekap-req-donasi"
              as={Link}
            >
              Laporan Request Donasi
            </SidebarItem>
            <SidebarItem
              className="text-sm"
              href="/owner/laporan/laporan-penitip"
              as={Link}
            >
              Laporan untuk Penitip
            </SidebarItem>
            <SidebarItem
              className="text-sm"
              href="/owner/laporan/kategori-stats"
              as={Link}
            >
              Laporan Kategori Barang
            </SidebarItem>
          </SidebarCollapse>
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
