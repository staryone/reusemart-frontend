import Navbar from "@/components/utama/navbar";
import Footer from "@/components/utama/footer";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
