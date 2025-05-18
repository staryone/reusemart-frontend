"use client";

import React from "react";
import AdminSideBar from "@/components/admin/sidebar";
import CSSideBar from "@/components/cs/sidebar";
import OwnerSideBar from "@/components/owner/sidebar";
import GudangSideBar from "@/components/gudang/sidebar";
import { useUser } from "@/hooks/use-user";
import { Jabatan } from "@/types/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useUser();
  return (
    <>
      {user?.jabatan === Jabatan.ADMIN ? (
        <AdminSideBar />
      ) : user?.jabatan === Jabatan.CS ? (
        <CSSideBar />
      ) : user?.jabatan === Jabatan.OWNER ? (
        <OwnerSideBar />
      ) : (
        <GudangSideBar />
      )}

      <main>{children}</main>
    </>
  );
}
