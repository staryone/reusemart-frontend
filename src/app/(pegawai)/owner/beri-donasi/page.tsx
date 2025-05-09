"use client";

import { useState } from "react";

export default function BeriDonasi() {
  const semuaBarang = [
    "Pakaian",
    "Makanan",
    "Buku",
    "Mainan",
    "Obat",
    "Alat Tulis",
    "Alat Tulis",
    "Alat Tulis",
    "Alat Tulis",
    "Alat Tulis",
    "Alat Tulis",
  ];

  const [namaPenerima, setNamaPenerima] = useState("");
  const [barangDonasi, setBarangDonasi] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [historiDonasi, setHistoriDonasi] = useState([
    { id: 1, nama: "Andi", barang: "Pakaian" },
    { id: 2, nama: "Siti", barang: "Buku" },
  ]);

  const filteredBarang = semuaBarang.filter((barang) =>
    barang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!namaPenerima || !barangDonasi) return;
    const newEntry = {
      id: historiDonasi.length + 1,
      nama: namaPenerima,
      barang: barangDonasi,
    };
    setHistoriDonasi([newEntry, ...historiDonasi]);
    setNamaPenerima("");
    setBarangDonasi("");
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredBarang.map((barang, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setBarangDonasi(barang)}
                    className={`p-3 border rounded text-center transition ${
                      barangDonasi === barang
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {barang}
                  </button>
                ))}
              </div>
            </div>

            {barangDonasi && (
              <p className="text-sm text-green-600 mt-2">
                Barang yang dipilih: <strong>{barangDonasi}</strong>
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
