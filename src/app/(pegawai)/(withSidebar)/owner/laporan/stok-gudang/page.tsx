"use client";

import React, { useMemo } from "react";
import { getListPenitipan } from "@/lib/api/penitipan.api";
import useSWR from "swr";
import { useUser } from "@/hooks/use-user";
import { DetailPenitipan } from "@/lib/interface/detail-penitipan.interface";

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="p-4 ml-64">
      <h1 className="text-2xl font-bold mb-4">Laporan Stok Gudang</h1>
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