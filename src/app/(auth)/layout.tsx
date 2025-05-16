import Navbar from "@/components/utama/navbar";
import Footer from "@/components/utama/footer";
import React from "react";
import { getCurrentUser, getRedirectUrl } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) {
    const redirectUrl = getRedirectUrl(user);
    redirect(redirectUrl);
  }
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
