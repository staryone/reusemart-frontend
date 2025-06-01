"use client";

import { useMemo, useState } from "react";
import { getLaporanDonasiBarang } from "@/lib/api/donasi.api";
import useSWR from "swr";
import { useUser } from "@/hooks/use-user";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface DonasiBarang {
  kode_produk: string;
  nama_produk: string;
  id_penitip: string;
  nama_penitip: string;
  tanggal_donasi: string;
  organisasi: string;
  nama_penerima: string;
}

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getLaporanDonasiBarang(params, token);

export default function LaporanDonasiBarang() {
  const currentUser = useUser();
  const token = currentUser !== null ? currentUser.token : "";

  const todaysYear = (): string => {
    const date = new Date();
    return date.toLocaleDateString("id-ID", { year: "numeric" });
  };

  const [selectedYear, setSelectedYear] = useState(todaysYear());
  const [page, setPage] = useState(1);
  const limit = 25;

  // Generate years (current year and previous 5 years)
  const years = Array.from({ length: 6 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  // Update queryParams based on selected year and pagination
  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      tahun: selectedYear,
      page: page.toString(),
      limit: limit.toString(),
    });
    return params;
  }, [selectedYear, page]);

  const { data, error, isLoading } = useSWR([queryParams, token], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const donasiData: DonasiBarang[] = useMemo(() => {
    if (!data || !Array.isArray(data[0])) return [];
    return data[0];
  }, [data]);

  const totalItems: number = useMemo(() => {
    if (!data || !data[1]) return 0;
    return data[1];
  }, [data]);

  const totalPages = Math.ceil(totalItems / limit);

  const todaysDate = (): string => {
    const date = new Date();
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(16);
    doc.text("Laporan Donasi Barang", 14, 20);
    doc.setFontSize(12);
    doc.text("ReUse Mart", 14, 30);
    doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 14, 38);
    doc.text(`Tahun: ${selectedYear}`, 14, 46);
    doc.text(`Tanggal Cetak: ${todaysDate()}`, 14, 54);

    // Add table
    autoTable(doc, {
      startY: 60,
      head: [
        [
          "Kode Produk",
          "Nama Produk",
          "Id Penitip",
          "Nama Penitip",
          "Tanggal Donasi",
          "Organisasi",
          "Nama Penerima",
        ],
      ],
      body: donasiData.map((item) => [
        item.kode_produk,
        item.nama_produk,
        item.id_penitip,
        item.nama_penitip,
        item.tanggal_donasi,
        item.organisasi,
        item.nama_penerima,
      ]),
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      styles: { fontSize: 10 },
    });

    // Save the PDF
    doc.save(`Laporan_Donasi_Barang_${selectedYear}.pdf`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="container mx-auto p-4 ml-64 mt-10">
      <h1 className="text-2xl font-bold mb-4">Laporan Donasi Barang</h1>

      {/* Dropdown for Year */}
      <div className="mb-4 flex gap-4">
        <div>
          <label htmlFor="year" className="mr-2">
            Tahun:
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setPage(1); // Reset page to 1 when year changes
            }}
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
          <p className="mb-2">Tahun: {selectedYear}</p>
          <p className="mb-2">Tanggal Cetak: {todaysDate()}</p>
          <p className="mb-4">
            ReUse Mart, Jl. Green Eco Park No. 456 Yogyakarta
          </p>
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
            <th className="border border-gray-300 p-2">Id Penitip</th>
            <th className="border border-gray-300 p-2">Nama Penitip</th>
            <th className="border border-gray-300 p-2">Tanggal Donasi</th>
            <th className="border border-gray-300 p-2">Organisasi</th>
            <th className="border border-gray-300 p-2">Nama Penerima</th>
          </tr>
        </thead>
        <tbody>
          {donasiData.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{item.kode_produk}</td>
              <td className="border border-gray-300 p-2">{item.nama_produk}</td>
              <td className="border border-gray-300 p-2">{item.id_penitip}</td>
              <td className="border border-gray-300 p-2">
                {item.nama_penitip}
              </td>
              <td className="border border-gray-300 p-2">
                {item.tanggal_donasi}
              </td>
              <td className="border border-gray-300 p-2">{item.organisasi}</td>
              <td className="border border-gray-300 p-2">
                {item.nama_penerima}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
