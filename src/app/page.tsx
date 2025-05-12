"use client";
import Navbar from "../components/utama/navbar";
import { getListBarang } from "@/lib/api/barang.api";
import { Barang, Gambar } from "@/lib/interface/barang.interface";
// import Image from "next/image";
import { useState, useMemo } from "react";
import useSWR from "swr";

const fetcher = async ([params]: [URLSearchParams, string]) =>
  await getListBarang(params);

export default function Home() {
  // const [searchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [primaryImage, setPrimaryImage] = useState("");

  const tersediaOnly = "TERSEDIA";
  const queryParams = useMemo(() => {
    const params = new URLSearchParams({});
    if (selectedCategory) {
      params.append("search", selectedCategory);
    }
    if (tersediaOnly) {
      params.append("status", tersediaOnly);
    }
    return params;
  }, [selectedCategory]);

  const { data, error, isLoading } = useSWR([queryParams], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const getPrimaryGambar = (gambars: Gambar[]): string | null => {
    const primaryGambar = gambars.find((gambar: Gambar) => gambar.is_primary);
    return primaryGambar ? primaryGambar.url_gambar : null;
  }

  // const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const search = formData.get("search-alamat") as string;
  //   setSearchQuery(search);
  // };

  const categories = [
    { id: "", name: "Semua" },
    { id: "1", name: "Elektronik & Gadget" },
    { id: "2", name: "Pakaian & Aksesori" },
    { id: "3", name: "Perabotan Rumah Tangga" },
    { id: "4", name: "Buku, Alat Tulis, & Peralatan Sekolah" },
    { id: "5", name: "Hobi, Mainan, & Koleksi" },
    { id: "6", name: "Perlengkapan Bayi & Anak" },
    { id: "7", name: "Otomotif & Aksesori" },
    { id: "8", name: "Perlengkapan Taman & Outdoor" },
    { id: "9", name: "Peralatan Kantor & Industri" },
    { id: "10", name: "Kosmetik & Perawatan Diri" },
  ];
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="mt-[5vw] w-[90vw] h-auto mx-auto">
        <img src="banner.png" alt="image" className="w-screen" />
      </div>
      <div className="flex flex-col items-start justify-items-center px-18 py-18">
        <h2 className="text-4xl mb-4 mt-10">Barang Terbaru</h2>
        <div className="flex gap-3 overflow-x-auto max-w-full">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error memuat data</div>
          ) : data && data[0].length > 0 ? (
            data[0]
              .sort((a: Barang, b: Barang) => {
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                ); // Newest first
              })
              .slice(0, 10)
              .map((barang: Barang) => (
                <div
                  className="bg-white border border-gray-200 rounded-lg shadow-sm flex-shrink-0 w-64"
                  key={barang.id_barang}
                >
                  <a
                    href={`/product-details/${barang.id_barang}`}
                    className="flex flex-col h-full"
                  >
                    <img
                      className="p-8 rounded-t-lg"
                      src={getPrimaryGambar(barang.gambar)}
                      alt="product image"
                    />
                    <div className="px-5 pb-5 flex flex-col justify-between flex-grow">
                      <h5 className="text-lg tracking-tight text-gray-900">
                        {barang.nama_barang}
                      </h5>
                      <div className="text-xl font-bold text-gray-900">
                        Rp{new Intl.NumberFormat("id-ID").format(barang.harga)}
                      </div>
                    </div>
                  </a>
                </div>
              ))
          ) : (
            <div>Tidak ada data</div>
          )}
        </div>
        <h2 className="text-4xl mb-4 mt-10">Semua Produk</h2>
        {/* Category Filter UI */}
        <div className="mb-6">
          <label htmlFor="category" className="mr-2 text-lg">
            Filter berdasarkan kategori:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-md"
          >
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.name == "Semua" ? "" : category.name}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-5 gap-3 max-w-full">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error memuat data</div>
          ) : data && data[0].length > 0 ? (
            data[0].map((barang: Barang) => (
              <div
                className="bg-white border border-gray-200 rounded-lg shadow-sm flex-shrink-0 w-64"
                key={barang.id_barang}
              >
                <a
                  href={`/product-details/${barang.id_barang}`}
                  className="flex flex-col h-full"
                >
                  <img
                    className="p-8 rounded-t-lg"
                    src={getPrimaryGambar(barang.gambar)}
                    alt="product image"
                  />
                  <div className="px-5 pb-5 flex flex-col justify-between flex-grow">
                    <h5 className="text-lg tracking-tight text-gray-900">
                      {barang.nama_barang}
                    </h5>
                    <div className="text-xl font-bold text-gray-900">
                      Rp{new Intl.NumberFormat("id-ID").format(barang.harga)}
                    </div>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <div>Tidak ada data</div>
          )}
        </div>
      </div>
    </div>
  );
}
