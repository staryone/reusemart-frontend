"use client";

import Navbar from "@/components/utama/navbar";
import { getProfilPenitip } from "@/lib/api/penitip.api";
import { Penitip } from "@/lib/interface/penitip.interface";

import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [penitip, setPenitip] = useState<Penitip | null>(null);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUEVOSVRJUCIsImlhdCI6MTc0Njk4MjI4MCwiZXhwIjoxNzQ3NTg3MDgwfQ.nKtSoI3ID3p2Tv03qoQ_6T3SVHCPl8thWepc4RLomxk";

  useEffect(() => {
      async function fetchPenitip() {
        try {
          const response = await getProfilPenitip(token);
  
          setPenitip(response);
        } catch (error) {
          console.error("Gagal memuat history:", error);
        }
      }
      fetchPenitip();
    }, []);
  return (
    <div className="min-h-screen bg-gray-50 px-6 pb-10 pt-26">
      <Navbar />
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Profile Summary */}
        <div className="flex flex-col justify-between gap-9">
          <div className="flex flex-col items-start">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{penitip?.nama}</h1>
            <p className="text-gray-600 mb-2">{penitip?.email}</p>
            <p className="text-md text-gray-900">⭐ {penitip?.rating} / 5</p>
          </div>
          {/* Points */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Total Saldo</h2>
            <p className="text-[#2662d9] text-2xl font-bold mt-1">Rp{penitip?.saldo !== undefined ? new Intl.NumberFormat('id-ID').format(penitip.saldo) : '0'}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Total Poin</h2>
            <p className="text-[#2662d9] text-2xl font-bold mt-1">{penitip?.poin} Poin</p>
          </div>
        </div>

        {/* Right: Details */}
        <div className="col-span-2 space-y-6">
          {/* Phone */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Nomor Telepon
            </h2>
            <p className="text-gray-700 mt-1">{penitip?.nomor_telepon}</p>
          </div>

          {/* Address */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Alamat</h2>
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mt-2">
              <p className="text-gray-700">
                {penitip?.alamat}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
