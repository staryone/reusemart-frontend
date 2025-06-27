"use client";

import { useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/penitip/sidebar";
import { getListHistoryPenjualan } from "@/lib/api/penitip.api";
import { HiX } from "react-icons/hi";
import { useUser, useSWRWithNavigation } from "@/hooks/use-user";

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
  detail_transaksi?: DetailTransaksi[];
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
  const currentUser = useUser();

  const token = currentUser !== null ? currentUser.token : "";

  const { data, error, isLoading } = useSWRWithNavigation(token, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  // Debug logging
  console.log("=== DEBUG PENITIP TRANSAKSI ===");
  console.log("Token:", token ? "Available" : "Not available");
  console.log("Raw data:", data);
  console.log("Error:", error);
  console.log("Is loading:", isLoading);
  console.log("Environment API URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log("Current environment:", process.env.NODE_ENV);

  // Detailed data structure debugging
  if (data) {
    console.log("=== DETAILED DATA STRUCTURE ===");
    console.log("Data type:", typeof data);
    console.log("Data keys:", Object.keys(data));
    console.log("Penitipan array:", data.penitipan);
    console.log("Penitipan length:", data.penitipan?.length);

    if (data.penitipan && data.penitipan.length > 0) {
      console.log("First penitipan:", data.penitipan[0]);
      console.log(
        "Detail penitipan length:",
        data.penitipan[0]?.detail_penitipan?.length
      );

      if (
        data.penitipan[0]?.detail_penitipan &&
        data.penitipan[0].detail_penitipan.length > 0
      ) {
        console.log(
          "First detail penitipan:",
          data.penitipan[0].detail_penitipan[0]
        );
        console.log(
          "First barang:",
          data.penitipan[0].detail_penitipan[0]?.barang
        );
        console.log(
          "Barang detail_transaksi:",
          data.penitipan[0].detail_penitipan[0]?.barang?.detail_transaksi
        );
      }
    }
  }

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
    // Original logic
    const hasDetailTransaksi = !!barang.detail_transaksi;
    const hasDetailTransaksiLength = !!(
      barang.detail_transaksi && barang.detail_transaksi.length > 0
    );
    const hasFirstDetail = !!(
      barang.detail_transaksi && barang.detail_transaksi[0]
    );
    const hasTransaksi = !!(
      barang.detail_transaksi &&
      barang.detail_transaksi[0] &&
      !!barang.detail_transaksi[0].transaksi
    );
    const hasPengiriman = !!(
      barang.detail_transaksi &&
      barang.detail_transaksi[0] &&
      barang.detail_transaksi[0].transaksi &&
      !!barang.detail_transaksi[0].transaksi.pengiriman
    );
    const isDelivered = !!(
      barang.detail_transaksi &&
      barang.detail_transaksi[0] &&
      barang.detail_transaksi[0].transaksi &&
      barang.detail_transaksi[0].transaksi.pengiriman &&
      barang.detail_transaksi[0].transaksi.pengiriman.status_pengiriman ===
        "SUDAH_DITERIMA"
    );

    console.log("=== DEBUG isItemSold ===");
    console.log("Barang:", barang.nama_barang);
    console.log("hasDetailTransaksi:", hasDetailTransaksi);
    console.log("hasDetailTransaksiLength:", hasDetailTransaksiLength);
    console.log("hasFirstDetail:", hasFirstDetail);
    console.log("hasTransaksi:", hasTransaksi);
    console.log("hasPengiriman:", hasPengiriman);
    console.log("isDelivered:", isDelivered);
    console.log("detail_transaksi:", barang.detail_transaksi);
    console.log(
      "pengiriman status:",
      barang.detail_transaksi?.[0]?.transaksi?.pengiriman?.status_pengiriman
    );

    // Original strict logic
    const originalResult =
      hasDetailTransaksi &&
      hasDetailTransaksiLength &&
      hasFirstDetail &&
      hasTransaksi &&
      hasPengiriman &&
      isDelivered;

    // Fallback logic: Check if item has any transaction (less strict)
    const hasAnyTransaction =
      hasDetailTransaksi && hasDetailTransaksiLength && hasTransaksi;

    // Alternative logic: Check for different status values
    const alternativeStatuses = [
      "SUDAH_DITERIMA",
      "DITERIMA",
      "DELIVERED",
      "COMPLETED",
      "FINISHED",
    ];

    const hasAlternativeStatus = !!(
      barang.detail_transaksi?.[0]?.transaksi?.pengiriman?.status_pengiriman &&
      alternativeStatuses.includes(
        barang.detail_transaksi[0].transaksi.pengiriman.status_pengiriman
      )
    );

    console.log("Original result:", originalResult);
    console.log("Has any transaction:", hasAnyTransaction);
    console.log("Has alternative status:", hasAlternativeStatus);

    // Return true if any condition is met
    return originalResult || (hasAnyTransaction && hasAlternativeStatus);
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
      .filter((detail: DetailPenitipan) => isItemSold(detail.barang))
      .map((detail: DetailPenitipan) => detail.barang) || [];

  console.log("=== DEBUG soldItems ===");
  console.log("Total sold items:", soldItems.length);
  console.log("Sold items:", soldItems);

  // Alternative approach: Show all items with transactions for debugging
  const allItemsWithTransactions =
    data?.penitipan
      ?.flatMap((penitipan: Penitipan) => penitipan.detail_penitipan)
      .filter(
        (detail: DetailPenitipan) =>
          detail.barang.detail_transaksi &&
          detail.barang.detail_transaksi.length > 0
      )
      .map((detail: DetailPenitipan) => detail.barang) || [];

  console.log("=== DEBUG allItemsWithTransactions ===");
  console.log(
    "Total items with transactions:",
    allItemsWithTransactions.length
  );
  console.log("Items with transactions:", allItemsWithTransactions);

  // Show all items for debugging
  const allItems =
    data?.penitipan
      ?.flatMap((penitipan: Penitipan) => penitipan.detail_penitipan)
      .map((detail: DetailPenitipan) => detail.barang) || [];

  console.log("=== DEBUG allItems ===");
  console.log("Total all items:", allItems.length);
  console.log("All items:", allItems);

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
            {allItemsWithTransactions.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Debug: Ditemukan {allItemsWithTransactions.length} item dengan
                  transaksi
                </p>
                <p className="text-sm text-gray-600">
                  Total semua item: {allItems.length}
                </p>
              </div>
            )}
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
                      Pembeli:{" "}
                      {item.detail_transaksi?.[0]?.transaksi.pembeli.nama}
                    </p>
                    <p className="text-sm text-gray-500">
                      Tanggal Transaksi:{" "}
                      {formatDate(
                        item.detail_transaksi?.[0]?.transaksi
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

            {/* Debug section - show all items with transactions */}
            {soldItems.length === 0 && allItemsWithTransactions.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Debug: Semua Item dengan Transaksi
                </h2>
                <div className="space-y-4">
                  {allItemsWithTransactions.map((item: Barang) => (
                    <div
                      key={item.id_barang}
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm"
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
                            Pembeli:{" "}
                            {item.detail_transaksi?.[0]?.transaksi.pembeli.nama}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status Pengiriman:{" "}
                            {item.detail_transaksi?.[0]?.transaksi.pengiriman
                              ?.status_pengiriman || "Tidak ada pengiriman"}
                          </p>
                          <p className="text-sm text-yellow-600 mt-1">
                            Debug: Memiliki transaksi tapi tidak terdeteksi
                            sebagai terjual
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal for Transaction Details */}
        {selectedItem && selectedItem.detail_transaksi?.[0] && (
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
                  <span>{selectedItem.nama_barang}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Harga:</strong>
                  <span>{formatCurrency(selectedItem.harga)}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Pembeli:</strong>
                  <span>
                    {selectedItem.detail_transaksi?.[0]?.transaksi.pembeli.nama}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Tanggal Transaksi:</strong>
                  <span>
                    {formatDate(
                      selectedItem.detail_transaksi?.[0]?.transaksi
                        .tanggal_transaksi as string
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Total Harga:</strong>
                  <span>
                    {formatCurrency(
                      selectedItem.detail_transaksi?.[0]?.transaksi
                        .total_harga as number
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Total Akhir:</strong>
                  <span>
                    {formatCurrency(
                      selectedItem.detail_transaksi?.[0]?.transaksi
                        .total_akhir as number
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Status Pembayaran:</strong>
                  <span
                    className={
                      selectedItem.detail_transaksi?.[0]?.transaksi
                        .status_Pembayaran === "DITERIMA"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {
                      selectedItem.detail_transaksi?.[0]?.transaksi
                        .status_Pembayaran
                    }
                  </span>
                </div>
                {selectedItem.detail_transaksi?.[0]?.transaksi.pengiriman && (
                  <>
                    <div className="flex justify-between">
                      <strong className="text-gray-700">
                        Status Pengiriman:
                      </strong>
                      <span className="text-green-600">
                        {
                          selectedItem.detail_transaksi?.[0].transaksi
                            .pengiriman.status_pengiriman
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong className="text-gray-700">
                        Tanggal Pengiriman:
                      </strong>
                      <span>
                        {formatDate(
                          selectedItem.detail_transaksi?.[0].transaksi
                            .pengiriman.tanggal
                        )}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <strong className="text-gray-700">Poin:</strong>
                  <span>{selectedItem.detail_transaksi?.[0]?.poin}</span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-gray-700">Komisi Penitip:</strong>
                  <span>
                    {formatCurrency(
                      selectedItem.detail_transaksi?.[0]
                        ?.komisi_penitip as number
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
