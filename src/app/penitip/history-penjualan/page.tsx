"use client";

import { useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/penitip/sidebar";
import { getListHistoryPenjualan } from "@/lib/api/penitip.api";
import { getToken } from "@/lib/auth/auth";
import useSWR from "swr";
import { HiX } from "react-icons/hi";

// TypeScript interfaces
interface Pembeli {
  nama: string;
}

interface Transaksi {
  id_transaksi: number;
  tanggal_transaksi: string;
  total_harga: number;
  status_Pembayaran: string;
  total_akhir: number;
  pembeli: Pembeli;
}

interface DetailTransaksi {
  id_dtl_transaksi: number;
  poin: number;
  komisi_penitip: number;
  transaksi: Transaksi;
}

interface Barang {
  id_barang: number;
  nama_barang: string;
  harga: number;
  detail_transaksi: DetailTransaksi | null;
}

interface DetailPenitipan {
  barang: Barang;
}

interface Penitipan {
  id_penitipan: number;
  tanggal_masuk: string;
  tanggal_laku: string | null;
  detail_penitipan: DetailPenitipan[];
}

// interface ApiResponse {
//   nama: string;
//   penitipan: Penitipan[];
// }

const fetcher = async (token: string) => await getListHistoryPenjualan(token);

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<Barang | null>(null);
  const token = getToken() || "";

  const { data, error, isLoading } = useSWR(token, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const pad = (num: number) => num.toString().padStart(2, "0");
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${pad(date.getDate())} ${
      months[date.getMonth()]
    } ${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const openModal = (item: Barang) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Sidebar />
      <Head>
        <title>History Penjualan Penitip</title>
        <meta name="description" content="Transaction history for penitip" />
      </Head>

      <div className="ml-64 p-4">
        {isLoading ? (
          <div className="text-center p-4">Loading...</div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">Error memuat data</div>
        ) : !data?.penitipan?.length ? (
          <div className="text-center p-4">Tidak ada data penitipan</div>
        ) : (
          <div className="space-y-4">
            {data.penitipan.map((penitipan: Penitipan) => (
              <div
                key={penitipan.id_penitipan}
                className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  Penitipan ID: {penitipan.id_penitipan}
                </h2>
                <p className="text-gray-600 mt-1">
                  Tanggal Masuk: {formatDate(penitipan.tanggal_masuk)}
                </p>
                <p className="text-gray-600">
                  Status:{" "}
                  <span
                    className={
                      penitipan.tanggal_laku
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {penitipan.tanggal_laku
                      ? `Terjual (${formatDate(penitipan.tanggal_laku)})`
                      : "Belum Terjual"}
                  </span>
                </p>

                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    Detail Barang:
                  </h3>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {penitipan.detail_penitipan.map((detail) => (
                      <li
                        key={detail.barang.id_barang}
                        className="py-3 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {detail.barang.nama_barang}
                          </p>
                          <p className="text-sm text-gray-500">
                            Harga: {formatCurrency(detail.barang.harga)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status:{" "}
                            <span
                              className={
                                detail.barang.detail_transaksi
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }
                            >
                              {detail.barang.detail_transaksi
                                ? "Terjual"
                                : "Belum Terjual"}
                            </span>
                          </p>
                        </div>
                        {detail.barang.detail_transaksi && (
                          <button
                            onClick={() => openModal(detail.barang)}
                            className="px-4 py-2 bg-[#72C678] text-white rounded-md hover:bg-[#008E6D] transition-colors"
                          >
                            Lihat Detail
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Transaction Details */}
        {selectedItem && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full border border-gray-300 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Detail Transaksi
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <HiX size={24} />
                </button>
              </div>
              <div className="space-y-3">
                <p>
                  <strong className="text-gray-700">Nama Barang:</strong>{" "}
                  {selectedItem.nama_barang}
                </p>
                <p>
                  <strong className="text-gray-700">Harga:</strong>{" "}
                  {formatCurrency(selectedItem.harga)}
                </p>
                <p>
                  <strong className="text-gray-700">Pembeli:</strong>{" "}
                  {selectedItem.detail_transaksi?.transaksi.pembeli.nama}
                </p>
                <p>
                  <strong className="text-gray-700">Tanggal Transaksi:</strong>{" "}
                  {formatDate(
                    selectedItem.detail_transaksi?.transaksi
                      .tanggal_transaksi as string
                  )}
                </p>
                <p>
                  <strong className="text-gray-700">Total Harga:</strong>{" "}
                  {formatCurrency(
                    selectedItem.detail_transaksi?.transaksi
                      .total_harga as number
                  )}
                </p>
                <p>
                  <strong className="text-gray-700">Total Akhir:</strong>{" "}
                  {formatCurrency(
                    selectedItem.detail_transaksi?.transaksi
                      .total_akhir as number
                  )}
                </p>
                <p>
                  <strong className="text-gray-700">Status Pembayaran:</strong>{" "}
                  <span
                    className={
                      selectedItem.detail_transaksi?.transaksi
                        .status_Pembayaran === "DITERIMA"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {selectedItem.detail_transaksi?.transaksi.status_Pembayaran}
                  </span>
                </p>
                <p>
                  <strong className="text-gray-700">Poin:</strong>{" "}
                  {selectedItem.detail_transaksi?.poin}
                </p>
                <p>
                  <strong className="text-gray-700">Komisi Penitip:</strong>{" "}
                  {formatCurrency(
                    selectedItem.detail_transaksi?.komisi_penitip as number
                  )}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="mt-6 w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
