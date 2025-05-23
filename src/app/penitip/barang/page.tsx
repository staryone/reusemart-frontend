"use client";

import CardBarang from "@/components/penitip/card-barang";
import Sidebar from "@/components/penitip/sidebar";

import { getProfilPenitip } from "@/lib/api/penitip.api";
import { Penitip } from "@/lib/interface/penitip.interface";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { useUser } from "@/hooks/use-user";
import { HiSearch } from "react-icons/hi";

export default function TransaksiPenitip() {
  const [penitip, setPenitip] = useState<Penitip | null>(null);
  const currentUser = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  const penitipFetcher = async (token: string) => {
    if (!token) return null;
    return await getProfilPenitip(token);
  };

  const {
    data: penitipData,
    error,
    isLoading,
  } = useSWR(currentUser !== null ? currentUser.token : null, penitipFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (penitipData) {
      setPenitip(penitipData);
    }
  }, [penitipData]);

  const detailPenitipanList = penitip?.penitipan
    ? penitip.penitipan.flatMap((penitipan) => penitipan.detail_penitipan)
    : [];

  const filteredPenitipanList = searchQuery
    ? detailPenitipanList.filter((trx) =>
        trx.barang.nama_barang.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : detailPenitipanList;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search-barang") as string;
    setSearchQuery(search.trim());
  };

  return (
    <div className="min-h-screen flex bg-gray-100 px-4 sm:px-6 lg:px-8 pt-6 pb-10">
      <Sidebar />
      <div className="flex-1 ml-64">
        <h2 className="text-xl font-bold mb-4">Daftar Barang</h2>
        <div className="flex justify-between items-center my-5">
          <form className="flex gap-3" onSubmit={handleSearch}>
            <input
              type="text"
              name="search-barang"
              id="search-barang"
              className="border rounded-md p-2 w-72"
              placeholder="Cari barang"
              defaultValue={searchQuery}
            />
            <button
              type="submit"
              className="bg-[#72C678] text-white px-4 py-2 rounded-lg hover:bg-[#008E6D]"
            >
              <HiSearch />
            </button>
          </form>
        </div>
        {filteredPenitipanList.length === 0 && !isLoading && !error ? (
          <p className="text-gray-500">
            {searchQuery ? "Tidak ada barang ditemukan" : "Tidak ada transaksi"}
          </p>
        ) : (
          filteredPenitipanList.map((trx) => (
            <CardBarang key={trx.id_dtl_penitipan} dtlPenitipan={trx} />
          ))
        )}
      </div>
    </div>
  );
}
