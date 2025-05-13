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
      if (token) {
        try {
          const response = await fetch("/api/auth/verify/pegawai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          const data = await response.json();

          if (data.valid) {
            if (data.decoded.jabatan?.toUpperCase() === "ADMIN") {
              return router.push("/admin/pegawai-master");
            } else if (data.decoded.jabatan?.toUpperCase() === "GUDANG") {
              return router.push("/gudang/dashboard");
            } else if (data.decoded.jabatan?.toUpperCase() === "CS") {
              return router.push("/cs/penitip-master");
            } else if (data.decoded.jabatan?.toUpperCase() === "OWNER") {
              return router.push("/owner/request-donasi");
            } else {
              return router.push("/unauthorized");
            }
          } else {
            router.push("/unauthorized");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          router.push("/unauthorized");
        }
      } else {
        setIsVerifying(false);
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
