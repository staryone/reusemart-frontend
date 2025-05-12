"use client";
import Navbar from "@/components/utama/navbar";
import Link from "next/link";

import { getProfilPembeli } from "@/lib/api/pembeli.api";
import { Pembeli } from "@/lib/interface/pembeli.interface";
import { Alamat } from "@/lib/interface/alamat.interface";

import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [pembeli, setPembeli] = useState<Pembeli | null>(null);
  const [alamat, setAlamat] = useState<Alamat | null>(null);

  const token = getToken() || "";
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const verifyResponse = await fetch("/api/auth/verify/pembeli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok && verifyData.valid) {
        return;
      } else {
        router.push("/");
      }
    };
    checkLogin();
  });

  useEffect(() => {
    async function fetchPembeli() {
      try {
        const response = await getProfilPembeli(token);

        setPembeli(response);
      } catch (error) {
        console.error("Gagal memuat history:", error);
      }
    }
    fetchPembeli();
  }, [token]);

  useEffect(() => {
    if (pembeli?.alamat) {
      const defaultAlamat = pembeli.alamat.find(
        (element) => element.status_default
      );
      setAlamat(defaultAlamat || null);
    }
  }, [pembeli]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 pb-10 pt-26">
      <Navbar />
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Profile Summary */}
        <div className="flex flex-col justify-between">
          <div className="flex flex-col items-start">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {pembeli?.nama}
            </h1>
            <p className="text-gray-600 mb-2">{pembeli?.email}</p>
          </div>
          {/* Points */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Total Poin</h2>
            <p className="text-[#2662d9] text-2xl font-bold mt-1">
              {pembeli?.poin_loyalitas} Poin
            </p>
          </div>
        </div>

        {/* Right: Details */}
        <div className="col-span-2 space-y-6">
          {/* Phone */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Nomor Telepon
            </h2>
            <p className="text-gray-700 mt-1">{pembeli?.nomor_telepon}</p>
          </div>

          {/* Address */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Alamat</h2>
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-800">
                  {alamat?.nama_alamat}
                </h3>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  Utama
                </span>
              </div>
              <p className="text-gray-700">{alamat?.detail_alamat}</p>
            </div>
            <Link
              href={"/daftar-alamat"}
              className="text-[#2662d9] text-md hover:underline hover:text-blue-500"
            >
              Daftar alamat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
