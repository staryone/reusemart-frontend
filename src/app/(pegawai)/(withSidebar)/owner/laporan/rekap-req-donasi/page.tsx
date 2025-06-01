"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { useUser } from "@/hooks/use-user";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getRekapRequestDonasi } from "@/lib/api/request-donasi.api";

export interface RekapRequestDonasi {
  id_organisasi: string;
  nama_organisasi: string;
  alamat: string;
  request: string;
}

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getRekapRequestDonasi(params, token);

export default function RekapRequestDonasi() {
  const currentUser = useUser();
  const token = currentUser !== null ? currentUser.token : "";

  const [page, setPage] = useState(1);
  const limit = 10;

  // Update queryParams based on pagination
  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return params;
  }, [page]);

  const { data, error, isLoading } = useSWR([queryParams, token], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const requestData: RekapRequestDonasi[] = useMemo(() => {
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
    doc.text("Rekap Request Donasi (Semua yang Belum Terpenuhi)", 14, 20);
    doc.setFontSize(12);
    doc.text("ReUse Mart", 14, 30);
    doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 14, 38);
    doc.text(`Tanggal Cetak: ${todaysDate()}`, 14, 46);

    // Add table
    autoTable(doc, {
      startY: 52,
      head: [["ID Organisasi", "Nama", "Alamat", "Request"]],
      body: requestData.map((item) => [
        item.id_organisasi,
        item.nama_organisasi,
        item.alamat,
        item.request,
      ]),
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      styles: { fontSize: 10 },
    });

    // Save the PDF
    doc.save(`Rekap_Request_Donasi_${todaysDate().replace(/ /g, "_")}.pdf`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="container mx-auto p-4 ml-64 mt-10">
      <h1 className="text-2xl font-bold mb-4">Rekap Request Donasi</h1>

      <div className="flex justify-between">
        <div>
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
            <th className="border border-gray-300 p-2">ID Organisasi</th>
            <th className="border border-gray-300 p-2">Nama</th>
            <th className="border border-gray-300 p-2">Alamat</th>
            <th className="border border-gray-300 p-2">Request</th>
          </tr>
        </thead>
        <tbody>
          {requestData.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">
                {item.id_organisasi}
              </td>
              <td className="border border-gray-300 p-2">
                {item.nama_organisasi}
              </td>
              <td className="border border-gray-300 p-2">{item.alamat}</td>
              <td className="border border-gray-300 p-2">{item.request}</td>
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
