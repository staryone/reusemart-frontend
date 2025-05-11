"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { getListBarang } from "@/lib/api/barang.api";

import {
  createDonasi,
  getListDonasi,
} from "@/lib/api/donasi.api";

import { Barang } from "@/lib/interface/barang.interface";
import { Donasi } from "@/lib/interface/donasi.interface";
import { getOrganisasi } from "@/lib/api/organisasi.api";
import { Organisasi } from "@/lib/interface/organisasi.interface";

export default function BeriDonasi() {
  const searchParams = useSearchParams();
  const id_request = searchParams.get("request");
  const { id } = useParams();
  const router = useRouter();

  const [namaPenerima, setNamaPenerima] = useState("");
  const [barangDonasi, setBarangDonasi] = useState<Barang | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [historiDonasi, setHistoriDonasi] = useState<Donasi[]>([]);
  const [semuaBarang, setSemuaBarang] = useState<Barang[]>([]);
  const [organisasi, setOrganisasi] = useState<Organisasi | null>(null);

  const paramsBarang = new URLSearchParams({
    status: "DIDONASIKAN",
  });
  const paramsDonasi = new URLSearchParams({});

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUEVHQVdBSSIsImphYmF0YW4iOiJPd25lciIsImlhdCI6MTc0Njg5MzY3NSwiZXhwIjoxNzQ3NDk4NDc1fQ.nafkHzTSnLH56H3FzQITmqF3GI7d9ewN54uF9YThYxY";

  useEffect(() => {
    async function fetchBarang() {
      try {
        const response = await getListBarang(paramsBarang);
        setSemuaBarang(response[0]);
      } catch (error) {
        console.error("Gagal memuat barang:", error);
      }
    }
    fetchBarang();
  }, []);

  useEffect(() => {
    async function fetchDonasi() {
      try {
        const response = await getListDonasi(
          id?.toString(),
          paramsDonasi,
          token
        );
        console.log(response);
        setHistoriDonasi(response[0]);
      } catch (error) {
        console.error("Gagal memuat history:", error);
      }
    }
    fetchDonasi();
  }, []);
  useEffect(() => {
    async function fetchOrganisasi() {
      try {
        const response = await getOrganisasi(id?.toString(), token);
        console.log(response);
        setOrganisasi(response);
      } catch (error) {
        console.error("Gagal memuat history:", error);
      }
    }
    fetchOrganisasi();
  }, []);

  const filteredBarang = semuaBarang.filter((barang) =>
    barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19) + "Z";
    const formData = new FormData(e.currentTarget);
    const createData = new FormData();

    if (formData.get("nama")) {
      createData.set("nama_penerima", formData.get("nama") as string);
    }

    createData.set("id_barang", barangDonasi?.id_barang as string);

    createData.set("id_request", id_request as string);

    createData.set("tanggal_donasi", formattedDate as string);

    try {
      const res = await createDonasi(createData, token);

      if (res) {
        router.push("/owner/request-donasi");
      } else {
        console.error("Failed process donasi");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setNamaPenerima("");
    setBarangDonasi(null);
    setSearchTerm("");
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A"; // Handle missing dates
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="w-screen p-10">
      <h1 className="text-5xl font-bold mb-8">
        Donasi ke{" "}
        <span className="text-[#1980e6]">{organisasi?.nama_organisasi}</span>
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Formulir */}
        <form onSubmit={handleSubmit} className="w-full lg:w-1/2 space-y-4">
          <div>
            <label className="block font-semibold">Nama Penerima:</label>
            <input
              id="nama"
              name="nama"
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
                      <div>ID: {barang.id_barang}</div>
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
                <li
                  key={donasi.id_donasi}
                  className="border p-3 rounded shadow flex flex-col"
                >
                  <div className="flex justify-between">
                    <div className="text-xl font-bold">
                      {donasi.barang.nama_barang}
                    </div>
                    <div className="font-light text-gray-600">
                      {formatDate(donasi.tanggal_donasi)}
                    </div>
                  </div>
                  <div>Penerima: {donasi.nama_penerima}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
