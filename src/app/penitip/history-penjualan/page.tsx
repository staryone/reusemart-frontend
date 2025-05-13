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

interface Pengiriman {
  id_pengiriman: number;
  tanggal: string;
  status_pengiriman: string;
  id_kurir: number;
  id_transaksi: number;
  createdAt: string;
  updatedAt: string;
}

interface Transaksi {
  id_transaksi: number;
  tanggal_transaksi: string;
  total_harga: number;
  status_Pembayaran: string;
  total_akhir: number;
  pembeli: Pembeli;
  pengiriman?: Pengiriman | null;
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

  const isItemSold = (barang: Barang): boolean => {
    return (
      !!barang.detail_transaksi &&
      barang.detail_transaksi.transaksi.pengiriman?.status_pengiriman ===
        "SUDAH_DITERIMA"
    );
  };

  const openModal = (item: Barang) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  // Flatten and filter sold items
  const soldItems =
    data?.penitipan
      ?.flatMap((penitipan: Penitipan) => penitipan.detail_penitipan)
      .filter((detail) => isItemSold(detail.barang))
      .map((detail) => detail.barang) || [];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Sidebar />
      <Head>
        <title>History Penjualan Penitip</title>
        <meta name="description" content="Transaction history for penitip" />
      </Head>

      <div className="ml-64 p-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          History Penjualan
        </h1>
        {isLoading ? (
          <div className="text-center p-4">Loading...</div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">Error memuat data</div>
        ) : !soldItems.length ? (
          <div className="text-center p-4">
            Tidak ada riwayat transaksi barang yang sudah terjual
          </div>
        ) : (
          <div className="space-y-4">
            {soldItems.map((item: Barang) => (
              <div
                key={item.id_barang}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {item.nama_barang}
                    </p>
                    <p className="text-sm text-gray-500">
                      Harga: {formatCurrency(item.harga)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Pembeli: {item.detail_transaksi?.transaksi.pembeli.nama}
                    </p>
                    <p className="text-sm text-gray-500">
                      Tanggal Transaksi:{" "}
                      {formatDate(
                        item.detail_transaksi?.transaksi
                          .tanggal_transaksi as string
                      )}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Status: Terjual
                    </p>
                  </div>
                  <button
                    onClick={() => openModal(item)}
                    className="px-4 py-2 bg-[#72C678] text-white rounded-md hover:bg-[#008E6D] transition-colors text-sm"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Transaction Details */}
        {selectedItem && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-green-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full border border-gray-200 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Detail Transaksi
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <HiX size={20} />
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <strong className="text-gray-700">Nama Barang:</strong>
                  <span>{selectedItem.nama_barang}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Harga:</strong>
                  <span>{formatCurrency(selectedItem.harga)}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Pembeli:</strong>
                  <span>
                    {selectedItem.detail_transaksi?.transaksi.pembeli.nama}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Tanggal Transaksi:</strong>
                  <span>
                    {formatDate(
                      selectedItem.detail_transaksi?.transaksi
                        .tanggal_transaksi as string
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Total Harga:</strong>
                  <span>
                    {formatCurrency(
                      selectedItem.detail_transaksi?.transaksi
                        .total_harga as number
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Total Akhir:</strong>
                  <span>
                    {formatCurrency(
                      selectedItem.detail_transaksi?.transaksi
                        .total_akhir as number
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Status Pembayaran:</strong>
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
                </div>
                {selectedItem.detail_transaksi?.transaksi.pengiriman && (
                  <>
                    <div className="flex justify-between">
                      <strong className="text-gray-700">
                        Status Pengiriman:
                      </strong>
                      <span className="text-green-600">
                        {
                          selectedItem.detail_transaksi.transaksi.pengiriman
                            .status_pengiriman
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong className="text-gray-700">
                        Tanggal Pengiriman:
                      </strong>
                      <span>
                        {formatDate(
                          selectedItem.detail_transaksi.transaksi.pengiriman
                            .tanggal
                        )}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <strong className="text-gray-700">Poin:</strong>
                  <span>{selectedItem.detail_transaksi?.poin}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Komisi Penitip:</strong>
                  <span>
                    {formatCurrency(
                      selectedItem.detail_transaksi?.komisi_penitip as number
                    )}
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="mt-4 w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
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
