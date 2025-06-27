"use client";

import { useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/penitip/sidebar";
import { getListHistoryPenjualan } from "@/lib/api/penitip.api";
import { HiX } from "react-icons/hi";
import { useUser, useSWRWithNavigation } from "@/hooks/use-user";

// TypeScript interfaces aligned with new backend response
interface Pembeli {
  nama: string;
}

interface Pengiriman {
  tanggal: string;
  status_pengiriman: string;
}

interface Barang {
  id_barang: number;
  nama_barang: string;
  harga: number;
  detail_penitipan: {
    tanggal_masuk: string;
    tanggal_laku: string | null;
  };
}

interface Transaksi {
  id_transaksi: number;
  tanggal_transaksi: string;
  total_harga: number;
  status_Pembayaran: string;
  total_akhir: number;
  pembeli: Pembeli;
  pengiriman: Pengiriman;
}

interface DetailTransaksi {
  id_dtl_transaksi: number;
  poin: number;
  komisi_penitip: number;
  barang: Barang;
  transaksi: Transaksi;
}

const fetcher = async (token: string) => await getListHistoryPenjualan(token);

export default function Home() {
  const [selectedDetail, setSelectedDetail] = useState<DetailTransaksi | null>(
    null
  );
  const currentUser = useUser();
  const token = currentUser?.token ?? "";

  const { data, error, isLoading } = useSWRWithNavigation<DetailTransaksi[]>(
    token ? token : null,
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
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

  const formatCurrency = (amount: number | null): string =>
    amount != null
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(amount)
      : "N/A";

  const openModal = (detail: DetailTransaksi) => setSelectedDetail(detail);
  const closeModal = () => setSelectedDetail(null);

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
        ) : !data?.length ? (
          <div className="text-center p-4">
            Tidak ada riwayat transaksi barang yang sudah terjual
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item) => (
              <div
                key={item.id_dtl_transaksi}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {item.barang.nama_barang}
                    </p>
                    <p className="text-sm text-gray-500">
                      Harga: {formatCurrency(item.barang.harga)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Pembeli: {item.transaksi.pembeli.nama ?? "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Tanggal Transaksi:{" "}
                      {formatDate(item.transaksi.tanggal_transaksi)}
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

        {selectedDetail && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-green-50/50">
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
                  <span>{selectedDetail.barang.nama_barang}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Harga:</strong>
                  <span>{formatCurrency(selectedDetail.barang.harga)}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Pembeli:</strong>
                  <span>{selectedDetail.transaksi.pembeli.nama ?? "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Tanggal Transaksi:</strong>
                  <span>
                    {formatDate(selectedDetail.transaksi.tanggal_transaksi)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Tanggal Masuk:</strong>
                  <span>
                    {formatDate(
                      selectedDetail.barang.detail_penitipan.tanggal_masuk
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Tanggal Laku:</strong>
                  <span>
                    {selectedDetail.barang.detail_penitipan.tanggal_laku
                      ? formatDate(
                          selectedDetail.barang.detail_penitipan.tanggal_laku
                        )
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Total Harga:</strong>
                  <span>
                    {formatCurrency(selectedDetail.transaksi.total_harga)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Total Akhir:</strong>
                  <span>
                    {formatCurrency(selectedDetail.transaksi.total_akhir)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Status Pembayaran:</strong>
                  <span
                    className={
                      selectedDetail.transaksi.status_Pembayaran === "DITERIMA"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {selectedDetail.transaksi.status_Pembayaran}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Status Pengiriman:</strong>
                  <span className="text-green-600">
                    {selectedDetail.transaksi.pengiriman.status_pengiriman}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Tanggal Pengiriman:</strong>
                  <span>
                    {formatDate(selectedDetail.transaksi.pengiriman.tanggal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Poin:</strong>
                  <span>{selectedDetail.poin ?? "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Komisi Penitip:</strong>
                  <span>{formatCurrency(selectedDetail.komisi_penitip)}</span>
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
