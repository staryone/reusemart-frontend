"use client";

import { useState, useEffect } from "react";
import {
  getListBarang
} from "@/lib/api/barang.api";
import { Barang } from "@/lib/interface/barang.interface";

export default function BeriDonasi() {

  const [namaPenerima, setNamaPenerima] = useState("");
  const [barangDonasi, setBarangDonasi] = useState<Barang | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [historiDonasi, setHistoriDonasi] = useState([
    { id: 1, nama: "Andi", barang: "Pakaian" },
    { id: 2, nama: "Siti", barang: "Buku" },
  ]);
  const [semuaBarang, setSemuaBarang] = useState<Barang[]>([]);

  useEffect(() => {
    async function fetchBarang() {
      try {
        const response = await getListBarang();
        setSemuaBarang(response[0]);
      } catch (error) {
        console.error("Gagal memuat barang:", error);
      }
    }
    fetchBarang();
  }, []);

  const filteredBarang = semuaBarang.filter((barang) =>
    barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!namaPenerima || !barangDonasi) return;
    const newEntry = {
      id: historiDonasi.length + 1,
      nama: namaPenerima,
      barang: barangDonasi.nama_barang,
    };
    setHistoriDonasi([newEntry, ...historiDonasi]);
    setNamaPenerima("");
    setBarangDonasi(null);
    setSearchTerm("");
  };

  return (
    <div className="w-screen p-10">
      <h1 className="text-5xl font-bold mb-8">Donasi ke Yayasan Panti Rapih</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Formulir */}
        <form onSubmit={handleSubmit} className="w-full lg:w-1/2 space-y-4">
          <div>
            <label className="block font-semibold">Nama Penerima:</label>
            <input
              type="text"
              value={namaPenerima}
              onChange={(e) => setNamaPenerima(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Masukkan nama penerima"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">
              Cari & Pilih Barang Donasi:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari barang..."
              className="border p-2 w-full mb-4 rounded"
            />

            <div className="max-h-48 overflow-y-auto border rounded p-2">
              <div className="flex flex-col gap-3">
              {filteredBarang.map((barang) => (
                  <button
                    type="button"
                    key={barang.id_barang}
                    onClick={() => setBarangDonasi(barang)}
                    className={`p-3 border rounded text-left transition text-sm ${
                      barangDonasi?.id_barang === barang.id_barang
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex flex-col">
                      <div>{barang.nama_barang}</div>
                      <div>Penitip: {barang.penitip.nama}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {barangDonasi && (
              <p className="text-sm text-green-600 mt-2">
                Barang yang dipilih: <strong>{barangDonasi.nama_barang}</strong>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Kirim Donasi
          </button>
        </form>

        {/* Histori */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Histori Donasi</h2>
          {historiDonasi.length === 0 ? (
            <p>Belum ada donasi yang tercatat.</p>
          ) : (
            <ul className="space-y-2">
              {historiDonasi.map((donasi) => (
                <li key={donasi.id} className="border p-3 rounded shadow">
                  <strong>{donasi.nama}</strong> mendonasikan{" "}
                  <em>{donasi.barang}</em>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
