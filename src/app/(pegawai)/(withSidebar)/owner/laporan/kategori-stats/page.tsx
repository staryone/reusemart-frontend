"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Select,
  Label,
} from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { getCategoryStats } from "@/lib/api/pegawai.api";
import { useUser } from "@/hooks/use-user";
import useSWR from "swr";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import autoTable from "jspdf-autotable";

const fetcher = async ([year, token]: [number | undefined, string]) =>
  await getCategoryStats(year, token);

export default function CategoryStatsPage() {
  const [year, setYear] = useState<number | undefined>(undefined);
  const currentUser = useUser();
  const token = currentUser !== null ? currentUser.token : "";
  const [totalItems, setTotalItems] = useState(0);

  const { data, error, isLoading, mutate } = useSWR([year, token], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (data) {
      setTotalItems(data.length);
    }
  }, [data]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = e.target.value ? parseInt(e.target.value) : undefined;
    setYear(selectedYear);
  };

  const generatePDF = () => {
    try {
      if (!data) {
        throw new Error("No data available to generate PDF");
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Header: Store Name and Address
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("ReUse Mart", 10, 10);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 10, 15);

      // Report Title and Date
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      const title = "LAPORAN PENJUALAN PER KATEGORI BARANG";
      const titleX = 10;
      const titleY = 24;
      doc.text(title, titleX, titleY);

      // Calculate text width for underline
      const textWidth = doc.getTextWidth(title);
      doc.setLineWidth(0.5);
      doc.line(titleX, titleY + 1, titleX + textWidth, titleY + 1);
      doc.setFont("helvetica", "normal");
      const cetakDate = format(new Date(), "dd MMMM yyyy", { locale: id });
      doc.text(`Tahun: ${year || "Semua Tahun"}`, 10, 30);
      doc.text(`Tanggal cetak: ${cetakDate}`, 10, 35);

      // Prepare table data
      const tableData = data.map((item) => [
        item.nama_kategori,
        item.total_sold.toString(),
        item.total_unsold.toString(),
      ]);
      const totalSold = data.reduce((sum, item) => sum + item.total_sold, 0);
      const totalUnsold = data.reduce(
        (sum, item) => sum + item.total_unsold,
        0
      );
      tableData.push(["Total", totalSold.toString(), totalUnsold.toString()]);

      // Generate table
      autoTable(doc, {
        startY: 45,
        head: [
          ["Kategori", "Jumlah Item Terjual", "Jumlah Item Gagal Terjual"],
        ],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [200, 200, 200],
          textColor: [0, 0, 0],
          fontSize: 10,
          halign: "center",
        },
        bodyStyles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 30, halign: "center" },
          2: { cellWidth: 30, halign: "center" },
        },
        margin: { top: 10 },
        didParseCell: function (data) {
          if (Array.isArray(data.row.raw) && data.row.raw[0] === "Total") {
            data.cell.styles.fontStyle = "bold";
            if (
              Array.isArray(data.row.raw) &&
              data.row.raw[0] === "Total" &&
              data.column.index === 0
            ) {
              data.cell.styles.halign = "right";
            }
          }
        },
        didDrawPage: (data) => {
          // Add footer or additional styling if needed
        },
      });

      // Add footer (ReUse Mart address)
      doc.setFontSize(8);
      doc.text("ReUse Mart", 10, doc.internal.pageSize.height - 10);
      doc.text(
        "Jl. Green Eco Park No. 456 Yogyakarta",
        10,
        doc.internal.pageSize.height - 5
      );

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const newWindow = window.open(pdfUrl, "_blank");
      if (!newWindow) {
        throw new Error("Failed to open new window. Popups may be blocked.");
      }
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 5000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    }
  };

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from(
      { length: currentYear - 2020 + 1 },
      (_, i) => currentYear - i
    );
    return [
      { value: "", label: "Semua Tahun" },
      ...yearsArray.map((y) => ({ value: y.toString(), label: y.toString() })),
    ];
  }, []);

  return (
    <div className="flex-1 p-4 ml-64">
      <h1 className="text-4xl font-bold mt-12 mb-4">
        Laporan Penjualan per Kategori
      </h1>
      <div className="flex justify-between items-center my-5">
        <div className="flex gap-3">
          <Label htmlFor="year-filter">Filter Tahun:</Label>
          <Select
            id="year-filter"
            value={year?.toString() || ""}
            onChange={handleYearChange}
            className="w-48"
          >
            {years.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Button onClick={generatePDF} className="p-3 bg-blue-500 text-white">
            Cetak PDF
          </Button>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <Table hoverable className="w-full border-1">
          <TableHead>
            <TableRow>
              <TableHeadCell>Kategori</TableHeadCell>
              <TableHeadCell>Jumlah Item Terjual</TableHeadCell>
              <TableHeadCell>Jumlah Item Gagal Terjual</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Error memuat data
                </TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map((item, index) => (
                <TableRow
                  key={item.id_kategori}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>{item.nama_kategori}</TableCell>
                  <TableCell>{item.total_sold}</TableCell>
                  <TableCell>{item.total_unsold}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
            {data && data.length > 0 && (
              <TableRow className="font-bold">
                <TableCell>Total</TableCell>
                <TableCell>
                  {data.reduce((sum, item) => sum + item.total_sold, 0)}
                </TableCell>
                <TableCell>
                  {data.reduce((sum, item) => sum + item.total_unsold, 0)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
