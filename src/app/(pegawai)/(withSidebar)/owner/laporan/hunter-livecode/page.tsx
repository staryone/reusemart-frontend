"use client";

import React, { useMemo, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Tick,
  Scale,
  CoreScaleOptions,
} from "chart.js";
import { getLaporanPenjualanBulanan } from "@/lib/api/penitipan.api";
import useSWR from "swr";
import { useUser } from "@/hooks/use-user";
import { Page, Text, View, Document, StyleSheet, pdf, Image } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getLaporanPenjualanBulanan(params, token);

// Styles for react-pdf
const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
  table: { display: "flex", flexDirection: "column", marginTop: 20 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#000" },
  tableHeader: { backgroundColor: "#f0f0f0", fontWeight: "bold" },
  tableCell: { flex: 1, padding: 5, fontSize: 10, textAlign: "right" },
  tableCellLeft: { flex: 1, padding: 5, fontSize: 10, textAlign: "left" },
  chartImage: { width: 500, height: 300, marginTop: 20 },
});

const PDFDocument = ({
  tableData,
  laporanYear,
  printDate,
  chartImage,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData: any[];
  laporanYear: number;
  printDate: string;
  chartImage?: string;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Laporan Penjualan Bulanan</Text>
      <Text style={styles.text}>ReUse Mart</Text>
      <Text style={styles.text}>Jl. Green Eco Park No. 456 Yogyakarta</Text>
      <Text style={styles.text}>Tahun: {laporanYear}</Text>
      <Text style={styles.text}>Tanggal cetak: {printDate}</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCellLeft}>Bulan</Text>
          <Text style={styles.tableCell}>Jumlah Barang Terjual</Text>
          <Text style={styles.tableCell}>Jumlah Penjualan Kotor</Text>
        </View>
        {tableData.map((row) => (
          <View key={row.month} style={styles.tableRow}>
            <Text style={styles.tableCellLeft}>{row.month}</Text>
            <Text style={styles.tableCell}>{row.itemsSold}</Text>
            <Text style={styles.tableCell}>Rp{new Intl.NumberFormat("id-ID").format(row.totalSales)}</Text>
          </View>
        ))}
        <View style={[styles.tableRow, { fontWeight: "bold" }]}>
          <Text style={styles.tableCellLeft}>Total</Text>
          <Text style={styles.tableCell}>
            {tableData.reduce((sum, row) => sum + row.itemsSold, 0)}
          </Text>
          <Text style={styles.tableCell}>
            Rp{new Intl.NumberFormat("id-ID").format(tableData.reduce((sum, row) => sum + row.totalSales, 0))}
          </Text>
        </View>
      </View>
      {chartImage && (
        <Image style={styles.chartImage} src={chartImage} />
      )}
    </Page>
  </Document>
);

export default function PenjualanBulanan() {
  const currentUser = useUser();
  const token = currentUser !== null ? currentUser.token : "";
  const chartRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1);

  // Generate array of years for dropdown (e.g., from 2010 to current year)
  const years = Array.from(
    { length: new Date().getFullYear() - 2010 + 1 },
    (_, i) => 2010 + i
  ).reverse();

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      sortField: "tanggal_masuk",
      sortOrder: "desc",
      status: "TERJUAL",
      all: "true",
      startDate: `${selectedYear}-01-01`,
      endDate: `${selectedYear}-12-31`,
    });
    return params;
  }, [selectedYear]);

  const { data, error, isLoading } = useSWR(
    [queryParams, token],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const tableData = useMemo(() => {
    if (!data || !Array.isArray(data[0])) return [];
    return data[0];
  }, [data]);

  const chartData = useMemo(() => {
    if (!tableData || tableData.length === 0) {
      return {
        labels: [],
        datasets: [{ label: "Total Penjualan (IDR)", data: [], backgroundColor: "rgba(59, 130, 246, 0.6)" }],
      };
    }

    const labels = tableData.map((item) => item.month.split(" ")[0]); // Extract month name
    const salesData = tableData.map((item) => item.totalSales);

    return {
      labels,
      datasets: [
        {
          label: "Total Penjualan (IDR)",
          data: salesData,
          backgroundColor: "rgba(59, 130, 246, 0.6)",
        },
      ],
    };
  }, [tableData]);

  const todaysDate = (): string => {
    const date = new Date();
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Penjualan Bulanan ${selectedYear}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (
            this: Scale<CoreScaleOptions>,
            tickValue: string | number,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            index: number,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ticks: Tick[]
          ): string {
            const value =
              typeof tickValue === "string" ? parseFloat(tickValue) : tickValue;
            return `Rp${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  const generatePDF = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);

    let chartImage = "";
    if (chartRef.current) {
      try {
        chartImage = await domtoimage.toPng(chartRef.current, {
          quality: 1,
          width: chartRef.current.offsetWidth,
          height: chartRef.current.offsetHeight,
        });
      } catch (error) {
        console.error("Error capturing chart:", error);
      }
    }

    const doc = (
      <PDFDocument
        tableData={tableData}
        laporanYear={selectedYear}
        printDate={todaysDate()}
        chartImage={chartImage}
      />
    );
    const blob = await pdf(doc).toBlob();
    saveAs(blob, `Laporan_Penjualan_${selectedYear}.pdf`);
    setIsGeneratingPDF(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="p-4 ml-64">
      <h1 className="text-2xl font-bold mb-4">Laporan Penjualan Bulanan</h1>
      <div className="mb-6">
        <p>ReUse Mart</p>
        <p>Jl. Green Eco Park No. 456 Yogyakarta</p>
        <div className="flex items-center gap-4">
          <p>Tahun:</p>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded p-2"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <p>Tanggal cetak: {todaysDate()}</p>
      </div>
      <button
        onClick={generatePDF}
        disabled={isGeneratingPDF}
        className={`mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
          isGeneratingPDF ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
      </button>
      <div className="overflow-x-auto mb-6 w-full">
        <table className="w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Bulan</th>
              <th className="border p-2">Jumlah Barang Terjual</th>
              <th className="border p-2">Jumlah Penjualan Kotor</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.month} className="hover:bg-gray-50">
                <td className="border p-2">{row.month.split(" ")[0]}</td>
                <td className="border p-2 text-right">{row.itemsSold}</td>
                <td className="border p-2 text-right">
                  Rp{new Intl.NumberFormat("id-ID").format(row.totalSales)}
                </td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className="border p-2">Total</td>
              <td className="border p-2 text-right">
                {tableData.reduce((sum, row) => sum + row.itemsSold, 0)}
              </td>
              <td className="border p-2 text-right">
                Rp
                {new Intl.NumberFormat("id-ID").format(
                  tableData.reduce((sum, row) => sum + row.totalSales, 0)
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-full max-w-4xl mx-auto" ref={chartRef}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}