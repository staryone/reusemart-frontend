"use client";

import { useMemo } from "react";
import { getListPenitipan } from "@/lib/api/penitipan.api";
import useSWR from "swr";
import { useUser } from "@/hooks/use-user";
import { DetailPenitipan } from "@/lib/interface/detail-penitipan.interface";

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getListPenitipan(params, token);

export default function LaporanKomisi() {
  // const [data] = useState([
  //   { 
  //     code: "K201", 
  //     name: "Kompor Tanam 3 tungku", 
  //     price: 2000000, 
  //     entryDate: "5/1/2025", 
  //     saleDate: "7/1/2025", 
  //     hunterCommission: 100000, 
  //     reuseMartCommission: 260000, 
  //     bonus: 40000 
  //   },
  //   { 
  //     code: "R95", 
  //     name: "Rak Buku 5 tingkat", 
  //     price: 500000, 
  //     entryDate: "5/1/2025", 
  //     saleDate: "9/2/2025", 
  //     hunterCommission: 0, 
  //     reuseMartCommission: 137500, 
  //     bonus: 0 
  //   },
  // ]);

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

  const { data, error, isLoading } = useSWR([queryParams, token], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const barangData: DetailPenitipan[] = useMemo(() => {
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

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A"; // Handle missing dates
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates
    const day = String(date.getDate());
    const month = String(date.getMonth() + 1); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="container mx-auto p-4 ml-52">
      <h1 className="text-2xl font-bold mb-4">Laporan Komisi Bulanan</h1>
      <p className="mb-2">Bulan: Januari Tahun: 2025</p>
      <p className="mb-2">Tanggal cetak: {todaysDate()}</p>
      <p className="mb-4">ReUse Mart, Jl. Green Eco Park No. 456 Yogyakarta</p>

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
            <th className="border border-gray-300 p-2">Bonus Penjual</th>
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
              <td className="border border-gray-300 p-2">Rp</td>
              <td className="border border-gray-300 p-2">Rp</td>
              <td className="border border-gray-300 p-2">Rp</td>
            </tr>
          ))}
          {/* <tr className="bg-gray-200">
            <td className="border border-gray-300 p-2" colSpan={2}>Total</td>
            <td className="border border-gray-300 p-2">{data.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2">{data.reduce((sum, item) => sum + item.hunterCommission, 0).toLocaleString()}</td>
            <td className="border border-gray-300 p-2">{data.reduce((sum, item) => sum + item.reuseMartCommission, 0).toLocaleString()}</td>
            <td className="border border-gray-300 p-2">{data.reduce((sum, item) => sum + item.bonus, 0).toLocaleString()}</td>
          </tr> */}
        </tbody>
      </table>
    </div>
  );
};

