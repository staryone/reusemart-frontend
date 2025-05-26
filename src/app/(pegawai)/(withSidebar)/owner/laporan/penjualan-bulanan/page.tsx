"use client";

import React, { useMemo } from "react";
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
import { getLaporan } from "@/lib/api/penitipan.api";
import useSWR from "swr";
import { useUser } from "@/hooks/use-user";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getLaporan(params, token);

export default function PenjualanBulanan() {
  const currentUser = useUser();
  const token = currentUser !== null ? currentUser.token : "";

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      sortField: "tanggal_masuk",
      sortOrder: "desc",
    });
    params.append("status", "TERJUAL");
    params.append("all", "true");
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

  const tableData = useMemo(() => {
    if (!data || !Array.isArray(data[0])) return [];
    return data[0];
  }, [data]);

  const chartData = useMemo(() => {
    if (!tableData || tableData.length === 0) {
      return {
        labels: [],
        datasets: [{ label: "Total Sales (IDR)", data: [], backgroundColor: "rgba(59, 130, 246, 0.6)" }],
      };
    }

    const labels = tableData.map((item) => item.month);
    const salesData = tableData.map((item) => item.totalSales);

    return {
      labels,
      datasets: [
        {
          label: "Total Sales (IDR)",
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

  const laporanDate = (): number => {
    const year = new Date().getFullYear();
    return year - 1;
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Sales " + laporanDate(),
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="p-4 ml-64">
      <h1 className="text-2xl font-bold mb-4">Laporan Penjualan Bulanan</h1>
      <div className="mb-6">
        <p>ReUse Mart</p>
        <p>Jl. Green Eco Park No. 456 Yogyakarta</p>
        <p>Tahun: {laporanDate()}</p>
        <p>Tanggal cetak: {todaysDate()}</p>
      </div>
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
                <td className="border p-2">{row.month}</td>
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
                {new Intl.NumberFormat("id-ID").format(tableData
                  .reduce((sum, row) => sum + row.totalSales, 0)
                  )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
