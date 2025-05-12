"use client";

import Navbar from "@/components/penitip/navbar";
import { getProfilPenitip } from "@/lib/api/penitip.api";
import { getToken } from "@/lib/auth/auth";
import { Penitip } from "@/lib/interface/penitip.interface";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [penitip, setPenitip] = useState<Penitip | null>(null);
  const token = getToken() || "";

  useEffect(() => {
    async function fetchPenitip() {
      try {
        const response = await getProfilPenitip(token);
        setPenitip(response);
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      }
    }
    fetchPenitip();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 pt-24 pb-10">
      <Navbar />
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Left: Profile Summary */}
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col items-start">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {penitip?.nama || "Nama Tidak Tersedia"}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mb-2">
                {penitip?.email || "Email Tidak Tersedia"}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm sm:text-md text-gray-900">
                  ⭐ {penitip?.rating?.toFixed(1) || "0"} / 5
                </p>
                {penitip?.is_top_seller && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-green-600 rounded-full">
                    Top Seller
                  </span>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Total Saldo
              </h2>
              <p className="text-blue-600 text-xl sm:text-2xl font-bold mt-1">
                Rp
                {penitip?.saldo !== undefined
                  ? new Intl.NumberFormat("id-ID").format(penitip.saldo)
                  : "0"}
              </p>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Total Poin
              </h2>
              <p className="text-blue-600 text-xl sm:text-2xl font-bold mt-1">
                {penitip?.poin || 0} Poin
              </p>
            </div>
            <Link href="/penitip/transactions">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
                Lihat Transaksi
              </button>
            </Link>
          </div>

          {/* Right: Details */}
          <div className="col-span-2 space-y-6">
            {/* Personal Info */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Informasi Pribadi
              </h2>
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mt-2 space-y-2">
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-medium">ID Penitip:</span>{" "}
                  {penitip?.id_penitip || "-"}
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-medium">Nomor KTP:</span>{" "}
                  {penitip?.nomor_ktp || "-"}
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-medium">Nomor Telepon:</span>{" "}
                  {penitip?.nomor_telepon || "-"}
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-medium">Alamat:</span>{" "}
                  {penitip?.alamat || "-"}
                </p>
              </div>
            </div>

            {/* Rating & Reviews */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Rating & Ulasan
              </h2>
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mt-2 space-y-2">
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-medium">Total Review:</span>{" "}
                  {penitip?.total_review || 0}
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-medium">Jumlah Review:</span>{" "}
                  {penitip?.jumlah_review || 0}
                </p>
              </div>
            </div>

            {/* Financials */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Keuangan
              </h2>
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mt-2 space-y-2">
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-medium">
                    Total Penghasilan Bulanan:
                  </span>{" "}
                  Rp
                  {penitip?.total_per_bulan !== undefined
                    ? new Intl.NumberFormat("id-ID").format(
                        penitip.total_per_bulan
                      )
                    : "0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
