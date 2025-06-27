"use client";

import CardBarang from "@/components/penitip/card-barang";
import Sidebar from "@/components/penitip/sidebar";

import { getProfilPenitip } from "@/lib/api/penitip.api";
import { Penitip } from "@/lib/interface/penitip.interface";

import { useState, useEffect } from "react";
import { useUser, useSWRWithNavigation } from "@/hooks/use-user";
import { HiSearch } from "react-icons/hi";

import DetailBarangModal from "@/components/penitip/modal-barang";
import { DetailPenitipan } from "@/lib/interface/detail-penitipan.interface";

export default function TransaksiPenitip() {
  const [penitip, setPenitip] = useState<Penitip | null>(null);
  const currentUser = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPenitipan, setSelectedPenitipan] =
    useState<DetailPenitipan | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchDate, setSearchDate] = useState<string>(""); // New state for date
  const [dateField, setDateField] = useState<
    "tanggal_masuk" | "tanggal_akhir" | "batas_ambil"
  >("tanggal_masuk"); // New state for date field type

  const penitipFetcher = async (token: string) => {
    if (!token) return null;
    return await getProfilPenitip(token);
  };

  const {
    data: penitipData,
    error,
    isLoading,
    mutate,
  } = useSWRWithNavigation(currentUser?.token || null, penitipFetcher);

  useEffect(() => {
    if (penitipData) {
      setPenitip(penitipData);
    }
  }, [penitipData]);

  const detailPenitipanList = penitip?.penitipan
    ? penitip.penitipan.flatMap((penitipan) => penitipan.detail_penitipan)
    : [];

  const filteredPenitipanList = detailPenitipanList.filter((trx) => {
    // Skip items with missing required data
    if (
      !trx ||
      !trx.barang ||
      !trx.barang.nama_barang ||
      !trx.barang.kategori
    ) {
      return false;
    }

    const matchesText = searchQuery
      ? trx.barang.nama_barang
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        trx.barang.harga.toString().includes(searchQuery) ||
        trx.barang.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trx.barang.kategori.nama_kategori
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    const matchesDate = searchDate
      ? new Date(trx[dateField]).toISOString().slice(0, 10) === searchDate
      : true;

    return matchesText && matchesDate;
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search-barang") as string;
    const date = formData.get("search-date") as string;
    const field = formData.get("date-field") as
      | "tanggal_masuk"
      | "tanggal_akhir"
      | "batas_ambil";
    setSearchQuery(search.trim());
    setSearchDate(date);
    setDateField(field || "tanggal_masuk");
  };

  const handleCardClick = (penitipan: DetailPenitipan) => {
    setSelectedPenitipan(penitipan);
    setIsDetailModalOpen(true);
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
            <input
              type="date"
              name="search-date"
              id="search-date"
              className="border rounded-md p-2 w-40"
              defaultValue={searchDate}
            />
            <select
              name="date-field"
              id="date-field"
              className="border rounded-md p-2"
              defaultValue={dateField}
            >
              <option value="tanggal_masuk">Tanggal Masuk</option>
              <option value="tanggal_akhir">Batas Penitipan</option>
              <option value="batas_ambil">Batas Ambil</option>
            </select>
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
          filteredPenitipanList.map((trx, index) => (
            <CardBarang
              key={`${trx.id_dtl_penitipan}-${index}`}
              dtlPenitipan={trx}
              accessToken={currentUser?.token || ""}
              onExtendSuccess={() => mutate()}
              onPickupSuccess={() => mutate()}
              onCardClick={handleCardClick}
            />
          ))
        )}
        <DetailBarangModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          penitipan={selectedPenitipan}
        />
      </div>
    </div>
  );
}
