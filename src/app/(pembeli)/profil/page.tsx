"use client";
import CardTransaksi from "@/components/pembeli/card-transaksi";
import Link from "next/link";

import { getProfilPembeli } from "@/lib/api/pembeli.api";
import { Pembeli } from "@/lib/interface/pembeli.interface";
import { Alamat } from "@/lib/interface/alamat.interface";

import { useState } from "react";
import useSWR from "swr";
import { useUser } from "@/hooks/use-user";

export default function ProfilePage() {
  const [pembeli, setPembeli] = useState<Pembeli | null>(null);
  const [alamat, setAlamat] = useState<Alamat | null>(null);
  const currentUser = useUser();

  const pembeliFetcher = async (token: string) => {
    if (!token) return null;
    return await getProfilPembeli(token);
  };

  const { data: pembeliData } = useSWR(
    currentUser !== null ? currentUser.token : null,
    pembeliFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (pembeliData && pembeli !== pembeliData) {
    setPembeli(pembeliData);
    if (pembeliData?.alamat) {
      const defaultAlamat = pembeliData.alamat.find(
        (element) => element.status_default
      );
      setAlamat(defaultAlamat || null);
    }
  }

  const transaksiList = pembeli?.transaksi || [];

  return (
    <div className="min-h-screen bg-gray-50 px-6 pb-10 pt-26">
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
            <p className="text-[#008E6D] text-2xl font-bold mt-1">
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
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mt-2 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-800">
                  {alamat?.nama_alamat}
                </h3>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  Utama
                </span>
              </div>
              <p className="text-gray-700">
                {alamat === null
                  ? "Tidak ada alamat utama"
                  : alamat?.detail_alamat}
              </p>
            </div>
            <Link
              href={"/daftar-alamat"}
              className="text-[#72C678] hover:text-[#008E6D] font-semibold"
            >
              Daftar alamat
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-5 max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-xl font-bold mb-4">Daftar Transaksi</h2>
        {transaksiList.length === 0 ? (
          <p className="text-gray-500">Tidak ada transaksi.</p>
        ) : (
          transaksiList.map((trx) => (
            <CardTransaksi key={trx.id_transaksi} transaksi={trx} />
          ))
        )}
      </div>
    </div>
  );
}
