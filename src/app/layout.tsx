import type { Metadata } from "next";
import "./globals.css";

import { Poppins } from "next/font/google";
import { UserProvider } from "@/provider/UserProvider";
import { getCurrentUser } from "@/lib/auth";

// Configure the font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Reusemart",
  description: "Belanja barang bekas berkualitas dan murah",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        <UserProvider user={user}>{children}</UserProvider>
      </body>
    </html>
  );
}
