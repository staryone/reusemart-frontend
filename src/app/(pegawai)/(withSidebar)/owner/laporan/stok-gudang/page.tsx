"use client";

import React, { useMemo } from "react";
import { getListPenitipan } from "@/lib/api/penitipan.api";
import useSWR from "swr";
import { useUser } from "@/hooks/use-user";
import { DetailPenitipan } from "@/lib/interface/detail-penitipan.interface";
import jsPDF from "jspdf";

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getListPenitipan(params, token);

export default function LaporanStokGudang() {
  const currentUser = useUser();
  const token = currentUser !== null ? currentUser.token : "";

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      sortField: "tanggal_masuk",
      sortOrder: "desc",
    });
    params.append("status", "TERSEDIA"); // Fetch only items in stock
    params.append("all", "true"); // Fetch all items, no pagination
    return params;
  }, []);

  const { data, error, isLoading } = useSWR(
    [queryParams, token],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const stockData: DetailPenitipan[] = useMemo(() => {
    if (!data || !Array.isArray(data[0])) return [];
    return data[0];
  }, [data]);

  const todaysDate = (): string => {
    const date = new Date();
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a3",
    });

    // Page settings
    const pageWidth = 350;
    const margin = 10;
    const maxLineWidth = pageWidth - 2 * margin;
    let yPosition = 10;

    // Header
    doc.setFontSize(16);
    doc.text("Laporan Stok Gudang", margin, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text("ReUse Mart", margin, yPosition);
    yPosition += 6;
    doc.text("Jl. Green Eco Park No. 456 Yogyakarta", margin, yPosition);
    yPosition += 6;
    doc.text(`Tanggal cetak: ${todaysDate()}`, margin, yPosition);
    yPosition += 10;

    // Table headers
    const headers = [
      "Kode Produk",
      "Nama Produk",
      "Id Penitip",
      "Nama Penitip",
      "Tanggal Masuk",
      "Perpanjangan",
      "ID Hunter",
      "Nama Hunter",
      "Harga",
    ];
    const columnWidths = [30, 40, 30, 40, 30, 30, 30, 40, 30]; // Adjusted for A4 width
    const rowHeight = 10;
    doc.setFontSize(10);
    doc.setFillColor(200, 200, 200); // Gray background for header
    doc.rect(margin, yPosition, maxLineWidth, rowHeight, "F");

    headers.forEach((header, index) => {
      const x = margin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
      doc.text(header, x + 2, yPosition + 6);
    });
    yPosition += rowHeight;

    // Table rows
    if (stockData.length === 0) {
      doc.text("Tidak ada data stok tersedia.", margin, yPosition + 6);
      yPosition += rowHeight;
    } else {
      stockData.forEach((item) => {
        // Check for page break
        if (yPosition + rowHeight > 280) {
          doc.addPage();
          yPosition = 10;
          // Redraw headers on new page
          doc.setFillColor(200, 200, 200);
          doc.rect(margin, yPosition, maxLineWidth, rowHeight, "F");
          headers.forEach((header, index) => {
            const x = margin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
            doc.text(header, x + 2, yPosition + 6);
          });
          yPosition += rowHeight;
        }

        const rowData = [
          item.barang.id_barang,
          item.barang.nama_barang,
          `T${item.penitipan.penitip.id_penitip}`,
          item.penitipan.penitip.nama,
          new Date(item.tanggal_masuk).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "numeric",
            year: "numeric",
          }),
          item.is_perpanjang ? "Ya" : "Tidak",
          item.penitipan.hunter ? `P${item.penitipan.hunter.id_pegawai}` : "-",
          item.penitipan.hunter ? item.penitipan.hunter.nama : "-",
          `Rp${new Intl.NumberFormat("id-ID").format(item.barang.harga)}`,
        ];

        rowData.forEach((cell, index) => {
          const x = margin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
          // Truncate text if too long
          const text = doc.splitTextToSize(cell, columnWidths[index] - 4);
          doc.text(text[0], x + 2, yPosition + 6);
        });

        // Draw row border
        doc.rect(margin, yPosition, maxLineWidth, rowHeight);
        yPosition += rowHeight;
      });
    }

    // Draw table borders
    headers.forEach((_, index) => {
      const x = margin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
      doc.line(x, 18, x, yPosition);
    });
    doc.line(margin, 18, margin, yPosition);
    doc.line(pageWidth - margin, 18, pageWidth - margin, yPosition);

    doc.save(`Laporan_Stok_Gudang_${todaysDate().replace(/ /g, "_")}.pdf`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="p-4 ml-64">
      <h1 className="text-2xl font-bold mb-4">Laporan Stok Gudang</h1>
      <button
          onClick={generatePDF}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download PDF
        </button>
      <div className="mb-6">
        <p>ReUse Mart</p>
        <p>Jl. Green Eco Park No. 456 Yogyakarta</p>
        <p>Tanggal cetak: {todaysDate()}</p>
      </div>
      <div className="overflow-x-auto mb-6 w-full">
        <table className="w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Kode Produk</th>
              <th className="border p-2">Nama Produk</th>
              <th className="border p-2">Id Penitip</th>
              <th className="border p-2">Nama Penitip</th>
              <th className="border p-2">Tanggal Masuk</th>
              <th className="border p-2">Perpanjangan</th>
              <th className="border p-2">ID Hunter</th>
              <th className="border p-2">Nama Hunter</th>
              <th className="border p-2">Harga</th>
            </tr>
          </thead>
          <tbody>
            {stockData.length === 0 ? (
              <tr>
                <td colSpan={9} className="border p-2 text-center">
                  Tidak ada data stok tersedia.
                </td>
              </tr>
            ) : (
              stockData.map((item) => (
                <tr key={item.id_dtl_penitipan} className="hover:bg-gray-50">
                  <td className="border p-2">{item.barang.id_barang}</td>
                  <td className="border p-2">{item.barang.nama_barang}</td>
                  <td className="border p-2">T{item.penitipan.penitip.id_penitip}</td>
                  <td className="border p-2">{item.penitipan.penitip.nama}</td>
                  <td className="border p-2">
                    {new Date(item.tanggal_masuk).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border p-2">{item.is_perpanjang ? "Ya" : "Tidak"}</td>
                  <td className="border p-2">
                    {item.penitipan.hunter ? "P"+item.penitipan.hunter.id_pegawai : "-"}
                  </td>
                  <td className="border p-2">
                    {item.penitipan.hunter ? item.penitipan.hunter.nama : "-"}
                  </td>
                  <td className="border p-2 text-right">
                    Rp{new Intl.NumberFormat("id-ID").format(item.barang.harga)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}