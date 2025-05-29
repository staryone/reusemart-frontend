"use client";

import { useMemo, useState } from "react";
import { getLaporanKomisi } from "@/lib/api/penitipan.api";
import useSWR from "swr";
import { useUser } from "@/hooks/use-user";
import { DetailPenitipan } from "@/lib/interface/detail-penitipan.interface";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getLaporanKomisi(params, token);

export default function LaporanKomisi() {
  const currentUser = useUser();
  const token = currentUser !== null ? currentUser.token : "";

  // State for month and year selection
  const [selectedMonth, setSelectedMonth] = useState("1"); // Default to January
  const [selectedYear, setSelectedYear] = useState("2025"); // Default to 2025

  // List of months
  const months = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  // Generate years (current year and previous 5 years)
  const years = Array.from({ length: 6 }, (_, i) => (new Date().getFullYear() - i).toString());

  // Update queryParams based on selected month and year
  const queryParams = useMemo(() => {
    const startDate = `${selectedYear}-${selectedMonth.padStart(2, "0")}-01`;
    const endDate = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).toISOString().split("T")[0];

    const params = new URLSearchParams({
      sortField: "tanggal_masuk",
      sortOrder: "desc",
      status: "TERJUAL",
      all: "true",
      startDate,
      endDate,
    });
    return params;
  }, [selectedMonth, selectedYear]);

  const { data, error, isLoading } = useSWR([queryParams, token], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const barangData: DetailPenitipan[] = useMemo(() => {
    if (!data || !Array.isArray(data[0])) return [];
    return data[0];
  }, [data]);

  console.log(data);

  const todaysDate = (): string => {
    const date = new Date();
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = String(date.getDate());
    const month = String(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const monthLabel = months.find((m) => m.value === selectedMonth)?.label || "Unknown";

    // Add header
    doc.setFontSize(16);
    doc.text("Laporan Komisi Bulanan", 14, 20);
    doc.setFontSize(12);
    doc.text(`Bulan: ${monthLabel}`, 14, 30);
    doc.text(`Tahun: ${selectedYear}`, 14, 38);
    doc.text(`Tanggal Cetak: ${todaysDate()}`, 14, 46);
    doc.text("ReUse Mart, Jl. Green Eco Park No. 456 Yogyakarta", 14, 54);

    // Add table
    autoTable(doc, {
      startY: 60,
      head: [
        [
          "Kode Produk",
          "Nama Produk",
          "Harga Jual",
          "Tanggal Masuk",
          "Tanggal Laku",
          "Komisi Hunter",
          "Komisi ReUseMart",
          "Bonus Penitip",
        ],
      ],
      body: barangData.map((item) => [
        item.barang.id_barang,
        item.barang.nama_barang,
        `Rp${new Intl.NumberFormat("id-ID").format(item.barang.harga)}`,
        formatDate(item.tanggal_masuk),
        formatDate(item.tanggal_laku),
        item.barang.detail_transaksi
          ? `Rp${new Intl.NumberFormat("id-ID").format(item.barang.detail_transaksi.komisi_hunter)}`
          : "Belum ada",
        item.barang.detail_transaksi
          ? `Rp${new Intl.NumberFormat("id-ID").format(item.barang.detail_transaksi.komisi_reusemart)}`
          : "Belum ada",
        item.barang.detail_transaksi
          ? `Rp${new Intl.NumberFormat("id-ID").format(item.barang.detail_transaksi.komisi_penitip)}`
          : "Belum ada",
      ]),
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      styles: { fontSize: 10 },
    });

    // Save the PDF
    doc.save(`Laporan_Komisi_${monthLabel}_${selectedYear}.pdf`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="container mx-auto p-4 ml-52">
      <h1 className="text-2xl font-bold mb-4">Laporan Komisi Bulanan</h1>

      {/* Dropdown for Month and Year */}
      <div className="mb-4 flex gap-4">
        <div>
          <label htmlFor="month" className="mr-2">Bulan:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="year" className="mr-2">Tahun:</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        
      </div>
      
      <div className="flex justify-between">
        <div>
          <p className="mb-2">
            Bulan: {months.find((m) => m.value === selectedMonth)?.label} <br />
            Tahun: {selectedYear}
          </p>
          <p className="mb-2">Tanggal Cetak: {todaysDate()}</p>
          <p className="mb-4">ReUse Mart, Jl. Green Eco Park No. 456 Yogyakarta</p>
        </div>
        <button
          onClick={generatePDF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 h-3/4"
        >
          Download PDF
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Kode Produk</th>
            <th className="border border-gray-300 p-2">Nama Produk</th>
            <th className="border border-gray-300 p-2">Harga Jual</th>
            <th className="border border-gray-300 p-2">Tanggal Masuk</th>
            <th className="border border-gray-300 p-2">Tanggal Laku</th>
            <th className="border border-gray-300 p-2">Komisi Hunter</th>
            <th className="border border-gray-300 p-2">Komisi ReUseMart</th>
            <th className="border border-gray-300 p-2">Bonus Penitip</th>
          </tr>
        </thead>
        <tbody>
          {barangData.map((item) => (
            <tr key={item.id_dtl_penitipan}>
              <td className="border border-gray-300 p-2">{item.barang.id_barang}</td>
              <td className="border border-gray-300 p-2">{item.barang.nama_barang}</td>
              <td className="border border-gray-300 p-2">Rp{new Intl.NumberFormat("id-ID").format(item.barang.harga)}</td>
              <td className="border border-gray-300 p-2">{formatDate(item.tanggal_masuk)}</td>
              <td className="border border-gray-300 p-2">{formatDate(item.tanggal_laku)}</td>
              <td className="border border-gray-300 p-2">
                {item.barang.detail_transaksi ? "Rp"+ new Intl.NumberFormat("id-ID").format(item.barang.detail_transaksi.komisi_hunter) : "Belum ada"}
              </td>
              <td className="border border-gray-300 p-2">
                {item.barang.detail_transaksi ? "Rp"+ new Intl.NumberFormat("id-ID").format(item.barang.detail_transaksi.komisi_reusemart) : "Belum ada"}
              </td>
              <td className="border border-gray-300 p-2">
                {item.barang.detail_transaksi ? "Rp"+ new Intl.NumberFormat("id-ID").format(item.barang.detail_transaksi.komisi_penitip) : "Belum ada"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};