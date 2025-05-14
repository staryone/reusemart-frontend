"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { getListBarang } from "@/lib/api/barang.api";
import { createDonasi, getListDonasi } from "@/lib/api/donasi.api";
import { Barang } from "@/lib/interface/barang.interface";
import { Donasi } from "@/lib/interface/donasi.interface";
import { getOrganisasi } from "@/lib/api/organisasi.api";
import { Organisasi } from "@/lib/interface/organisasi.interface";
import { User } from "@/types/auth";
import useSWR from "swr";

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
  const [formError, setFormError] = useState<string | null>(null);
  const [barangError, setBarangError] = useState<string | null>(null);
  const [donasiError, setDonasiError] = useState<string | null>(null);
  const [organisasiError, setOrganisasiError] = useState<string | null>(null);

  const fetcher = async (url: string): Promise<User | null> => {
    const response = await fetch(url, { method: "GET" });
    if (response.ok) {
      return await response.json();
    }
    return null;
  };

  const { data: currentUser } = useSWR("/api/auth/me", fetcher);

  const token = currentUser ? currentUser.token : "";

  const paramsBarang = useMemo(
    () =>
      new URLSearchParams({
        status: "DIDONASIKAN",
      }),
    []
  );

  const paramsDonasi = useMemo(() => new URLSearchParams({}), []);

  useEffect(() => {
    if (!token) {
      setFormError("Sesi tidak valid. Silakan login kembali.");
      router.push("/login");
      return;
    }

    async function fetchBarang() {
      try {
        const response = await getListBarang(paramsBarang);
        if (response[0]) {
          setSemuaBarang(response[0]);
        } else {
          throw new Error("Tidak ada barang tersedia");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Gagal memuat daftar barang";
        setBarangError(errorMessage);
        console.error("Gagal memuat barang:", error);
      }
    }

    async function fetchDonasi() {
      try {
        if (!id) throw new Error("ID organisasi tidak valid");
        const response = await getListDonasi(
          id.toString(),
          paramsDonasi,
          token
        );
        if (response[0]) {
          setHistoriDonasi(response[0]);
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Gagal memuat histori donasi";
        setDonasiError(errorMessage);
        console.error("Gagal memuat histori donasi:", error);
      }
    }

    async function fetchOrganisasi() {
      try {
        if (!id) throw new Error("ID organisasi tidak valid");
        const response = await getOrganisasi(id.toString(), token);
        if (response) {
          setOrganisasi(response);
        } else {
          throw new Error("Organisasi tidak ditemukan");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Gagal memuat data organisasi";
        setOrganisasiError(errorMessage);
        console.error("Gagal memuat organisasi:", error);
      }
    }

    fetchBarang();
    fetchDonasi();
    fetchOrganisasi();
  }, [id, paramsBarang, paramsDonasi, token, router]);

  const filteredBarang = semuaBarang.filter((barang) =>
    barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = () => {
    // Clear form error when user modifies inputs
    if (formError) {
      setFormError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    try {
      // Validasi input
      if (!namaPenerima || namaPenerima.trim().length < 2) {
        throw new Error("Nama penerima harus diisi dan minimal 2 karakter");
      }
      if (!barangDonasi) {
        throw new Error("Pilih barang donasi terlebih dahulu");
      }
      if (!id_request) {
        throw new Error("ID request tidak valid");
      }
      if (!id) {
        throw new Error("ID organisasi tidak valid");
      }

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 19) + "Z";
      const formData = new FormData(e.currentTarget);
      const createData = new FormData();

      if (formData.get("nama")) {
        createData.set("nama_penerima", formData.get("nama") as string);
      }
      createData.set("id_barang", barangDonasi.id_barang);
      createData.set("id_request", id_request);
      createData.set("tanggal_donasi", formattedDate);

      const res = await createDonasi(createData, token);

      if (res) {
        setNamaPenerima(""); // Reset form only on success
        setBarangDonasi(null);
        setSearchTerm("");
        router.push("/owner/request-donasi");
      } else {
        throw new Error("Gagal memproses donasi");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memproses donasi";
      setFormError(errorMessage);
      console.error("Error memproses donasi:", error);
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Tanggal tidak valid";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="w-screen p-10">
      {organisasiError ? (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
          {organisasiError}
        </div>
      ) : (
        <h1 className="text-5xl font-bold mb-8">
          Donasi ke{" "}
          <span className="text-[#1980e6]">
            {organisasi?.nama_organisasi || "Memuat..."}
          </span>
        </h1>
      )}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Formulir */}
        <div className="w-full lg:w-1/2 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                {formError}
              </div>
            )}
            <div>
              <label className="block font-semibold">Nama Penerima:</label>
              <input
                id="nama"
                name="nama"
                type="text"
                value={namaPenerima}
                onChange={(e) => {
                  setNamaPenerima(e.target.value);
                  handleInputChange();
                }}
                className="border p-2 w-full rounded"
                placeholder="Masukkan nama penerima"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">
                Cari & Pilih Barang Donasi:
              </label>
              {barangError ? (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                  {barangError}
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto border rounded p-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      handleInputChange();
                    }}
                    placeholder="Cari barang..."
                    className="border border-gray-500 p-2 w-full mb-4 rounded sticky top-0 bg-white"
                  />
                  <div className="flex flex-col gap-3">
                    {filteredBarang.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        Tidak ada barang ditemukan
                      </p>
                    ) : (
                      filteredBarang.map((barang) => (
                        <button
                          type="button"
                          key={barang.id_barang}
                          onClick={() => {
                            setBarangDonasi(barang);
                            handleInputChange();
                          }}
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
                      ))
                    )}
                  </div>
                </div>
              )}
              {barangDonasi && (
                <p className="text-sm text-green-600 mt-2">
                  Barang yang dipilih:{" "}
                  <strong>{barangDonasi.nama_barang}</strong>
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
              disabled={!!formError}
            >
              Kirim Donasi
            </button>
          </form>
        </div>
        {/* Histori */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Histori Donasi</h2>
          {donasiError ? (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
              {donasiError}
            </div>
          ) : historiDonasi.length === 0 ? (
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
