"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { getLaporanTransaksiPenitip } from "@/lib/api/transaksi.api";
import { getListPenitip } from "@/lib/api/penitip.api";
import useSWR from "swr";
import { useUser } from "@/hooks/use-user";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Penitip } from "@/lib/interface/penitip.interface";

export interface LaporanTransaksi {
  transaksi: TransaksiPenitip[];
  totalHargaJualBersih: number;
  totalBonusTerjual: number;
  totalPendapatan: number;
  errors?: string;
}

export interface TransaksiPenitip {
  kode_produk: string;
  nama_produk: string;
  tanggal_masuk: string;
  tanggal_laku: string;
  harga_jual_bersih: number;
  bonus_terjual_cepat: number;
  pendapatan: number;
}

const fetcherTransaksi = async ([params, token]: [URLSearchParams, string]) =>
  await getLaporanTransaksiPenitip(params, token);

const fetcherPenitip = async ([params, token]: [URLSearchParams, string]) =>
  await getListPenitip(params, token);

export default function LaporanTransaksiPenitip() {
  const currentUser = useUser();
  const token = currentUser !== null ? currentUser.token : "";

  const todaysMonth = (): string => {
    const date = new Date();
    return date.toLocaleDateString("id-ID", { month: "numeric" });
  };
  const todaysYear = (): string => {
    const date = new Date();
    return date.toLocaleDateString("id-ID", { year: "numeric" });
  };

  const [selectedPenitip, setSelectedPenitip] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState(todaysMonth());
  const [selectedYear, setSelectedYear] = useState(todaysYear());
  const [searchPenitip, setSearchPenitip] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  const years = Array.from({ length: 6 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  // Fetch list of penitip
  const penitipParams = useMemo(() => {
    const params = new URLSearchParams({
      page: "1",
      limit: "100",
      search: searchPenitip,
    });
    return params;
  }, [searchPenitip]);

  const { data: penitipData, error: penitipError } = useSWR(
    [penitipParams, token],
    fetcherPenitip,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const penitipList: Penitip[] = useMemo(() => {
    if (!penitipData || !Array.isArray(penitipData[0])) return [];
    return penitipData[0];
  }, [penitipData]);

  // Set default penitip (paling awal dari list)
  useEffect(() => {
    if (penitipList.length > 0 && !selectedPenitip) {
      setSelectedPenitip(penitipList[0].id_penitip.toString());
    }
  }, [penitipList, selectedPenitip]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update queryParams based on selected penitip, month, and year
  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      id_penitip: selectedPenitip,
      bulan: selectedMonth,
      tahun: selectedYear,
    });
    return params;
  }, [selectedPenitip, selectedMonth, selectedYear]);

  const { data, error, isLoading } = useSWR(
    selectedPenitip ? [queryParams, token] : null,
    fetcherTransaksi,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  console.log(data);

  const transaksiData: TransaksiPenitip[] = useMemo(() => {
    if (!data || !Array.isArray(data.transaksi)) return [];
    console.log(data);
    return data.transaksi;
  }, [data]);

  const totals = useMemo(() => {
    if (!data)
      return {
        totalHargaJualBersih: 0,
        totalBonusTerjual: 0,
        totalPendapatan: 0,
      };
    return {
      totalHargaJualBersih: data.totalHargaJualBersih || 0,
      totalBonusTerjual: data.totalBonusTerjual || 0,
      totalPendapatan: data.totalPendapatan || 0,
    };
  }, [data]);

  const selectedPenitipName = useMemo(() => {
    const penitip = penitipList.find(
      (p) => p.id_penitip.toString() === selectedPenitip
    );
    return penitip ? penitip.nama : "N/A";
  }, [penitipList, selectedPenitip]);

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
    const monthLabel =
      months.find((m) => m.value === selectedMonth)?.label || "Unknown";

    // Add header
    doc.setFontSize(16);
    doc.text("Laporan Transaksi Penitip", 14, 20);
    doc.setFontSize(12);
    doc.text("ReUse Mart", 14, 30);
    doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 14, 38);
    doc.text(`ID Penitip: ${selectedPenitip}`, 14, 46);
    doc.text(`Nama Penitip: ${selectedPenitipName}`, 14, 54);
    doc.text(`Bulan: ${monthLabel}`, 14, 62);
    doc.text(`Tahun: ${selectedYear}`, 14, 70);
    doc.text(`Tanggal Cetak: ${todaysDate()}`, 14, 78);

    // Add table
    autoTable(doc, {
      startY: 84,
      head: [
        [
          "Kode Produk",
          "Nama Produk",
          "Tanggal Masuk",
          "Tanggal Laku",
          "Harga Jual Bersih (sudah dipotong komisi)",
          "Bonus Terjual Cepat",
          "Pendapatan",
        ],
      ],
      body: [
        ...transaksiData.map((item) => [
          item.kode_produk,
          item.nama_produk,
          item.tanggal_masuk,
          item.tanggal_laku,
          `Rp${new Intl.NumberFormat("id-ID").format(item.harga_jual_bersih)}`,
          `Rp${new Intl.NumberFormat("id-ID").format(
            item.bonus_terjual_cepat
          )}`,
          `Rp${new Intl.NumberFormat("id-ID").format(item.pendapatan)}`,
        ]),
        [
          "TOTAL",
          "",
          "",
          "",
          `Rp${new Intl.NumberFormat("id-ID").format(
            totals.totalHargaJualBersih
          )}`,
          `Rp${new Intl.NumberFormat("id-ID").format(
            totals.totalBonusTerjual
          )}`,
          `Rp${new Intl.NumberFormat("id-ID").format(totals.totalPendapatan)}`,
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      styles: { fontSize: 10 },
    });

    // Save the PDF
    doc.save(`Laporan_Transaksi_Penitip_${monthLabel}_${selectedYear}.pdf`);
  };

  if (penitipError) return <div>Error loading penitip list</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="container mx-auto p-4 ml-64 mt-10">
      <h1 className="text-2xl font-bold mb-4">Laporan Transaksi Penitip</h1>

      {/* Dropdown for Penitip, Month, and Year */}
      <div className="mb-4 flex gap-4">
        <div className="relative" ref={dropdownRef}>
          <label htmlFor="penitip" className="mr-2">
            Penitip:
          </label>
          <input
            id="penitip"
            type="text"
            value={searchPenitip}
            onChange={(e) => setSearchPenitip(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Cari nama penitip..."
            className="border border-gray-300 rounded p-2 w-64"
          />
          {isDropdownOpen && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 ml-16 w-64 max-h-60 overflow-y-auto">
              {penitipList.length > 0 ? (
                penitipList.map((penitip) => (
                  <div
                    key={penitip.id_penitip}
                    onClick={() => {
                      setSelectedPenitip(penitip.id_penitip.toString());
                      setSearchPenitip("");
                      setIsDropdownOpen(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {penitip.nama}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">
                  Tidak ada penitip ditemukan
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="month" className="mr-2">
            Bulan:
          </label>
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
          <label htmlFor="year" className="mr-2">
            Tahun:
          </label>
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
          <p className="mb-2">ID Penitip: {selectedPenitip}</p>
          <p className="mb-2">Nama Penitip: {selectedPenitipName}</p>
          <p className="mb-2">
            Bulan: {months.find((m) => m.value === selectedMonth)?.label}
          </p>
          <p className="mb-2">Tahun: {selectedYear}</p>
          <p className="mb-4">Tanggal Cetak: {todaysDate()}</p>
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
            <th className="border border-gray-300 p-2">Tanggal Masuk</th>
            <th className="border border-gray-300 p-2">Tanggal Laku</th>
            <th className="border border-gray-300 p-2">
              Harga Jual Bersih (sudah dipotong komisi)
            </th>
            <th className="border border-gray-300 p-2">Bonus Terjual Cepat</th>
            <th className="border border-gray-300 p-2">Pendapatan</th>
          </tr>
        </thead>
        <tbody>
          {transaksiData.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{item.kode_produk}</td>
              <td className="border border-gray-300 p-2">{item.nama_produk}</td>
              <td className="border border-gray-300 p-2">
                {item.tanggal_masuk}
              </td>
              <td className="border border-gray-300 p-2">
                {item.tanggal_laku}
              </td>
              <td className="border border-gray-300 p-2">
                Rp
                {new Intl.NumberFormat("id-ID").format(item.harga_jual_bersih)}
              </td>
              <td className="border border-gray-300 p-2">
                Rp
                {new Intl.NumberFormat("id-ID").format(
                  item.bonus_terjual_cepat
                )}
              </td>
              <td className="border border-gray-300 p-2">
                Rp{new Intl.NumberFormat("id-ID").format(item.pendapatan)}
              </td>
            </tr>
          ))}
          <tr className="font-bold">
            <td className="border border-gray-300 p-2">TOTAL</td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2">
              Rp
              {new Intl.NumberFormat("id-ID").format(
                totals.totalHargaJualBersih
              )}
            </td>
            <td className="border border-gray-300 p-2">
              Rp
              {new Intl.NumberFormat("id-ID").format(totals.totalBonusTerjual)}
            </td>
            <td className="border border-gray-300 p-2">
              Rp{new Intl.NumberFormat("id-ID").format(totals.totalPendapatan)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
