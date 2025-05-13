"use client";

import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Akses Tidak Diizinkan
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Anda tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <Button
        onClick={() => router.push("/")}
        className="bg-[#72C678] hover:from-[#72C678] hover:to-[#008E6D]"
      >
        Kembali ke Halaman Utama
      </Button>
    </div>
  );
}
