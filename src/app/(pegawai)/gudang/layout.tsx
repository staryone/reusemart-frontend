"use client";

import { getToken } from "@/lib/auth/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVerifying, setIsVerifying] = useState(true);
  const token = getToken() || "";
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        router.push("/unauthorized");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify/pegawai/gudang", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!data.valid) {
          router.push("/unauthorized");
        } else {
          setIsVerifying(false);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        router.push("/unauthorized");
      }
    };

    verifyToken();
  }, [token, router]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Verifying access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
