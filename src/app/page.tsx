"use client";
import Navbar from "../components/utama/navbar";
import { getListBarang } from "@/lib/api/barang.api";
import { Barang, Gambar } from "@/lib/interface/barang.interface";
import Image from "next/image";
import { useState, useMemo } from "react";
import useSWR from "swr";
import Footer from "../components/utama/footer";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { createKeranjang } from "@/lib/api/keranjang.api";
import { useUser } from "@/hooks/use-user";

const fetcher = async ([params]: [URLSearchParams, string]) =>
  await getListBarang(params);

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const currentUser = useUser();

  const token = currentUser !== null ? currentUser.token : "";

  const tersediaOnly = "TERSEDIA";
  const queryParams = useMemo(() => {
    const params = new URLSearchParams({});

    if (selectedCategory) {
      params.append("search", selectedCategory);
    }
    if (tersediaOnly) {
      params.append("status", tersediaOnly);
    }
    params.append("all", "true");
    return params;
  }, [selectedCategory]);

  const { data, error, isLoading } = useSWR([queryParams], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const getPrimaryGambar = (gambars: Gambar[]): string | null => {
    const primaryGambar = gambars.find((gambar: Gambar) => gambar.is_primary);
    return primaryGambar ? primaryGambar.url_gambar : "/product.png";
  };

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

  const handleAddToCart = async (barang: Barang) => {
    try {
      if (token === "") {
        return toast.error("Anda belum login, silahkan login terlebih dahulu!");
      }

      const formData = new FormData();
      formData.append("id_barang", barang.id_barang || "");

      const result = await createKeranjang(formData, token);
      if (result.data) {
        return toast.success("Barang berhasil masuk ke keranjang");
      }
      return toast.error("Barang gagal masuk ke keranjang. " + result.errors);
    } catch {
      return toast.error(
        "Terjadi kesalahan tidak terduga, silahkan coba lagi! "
      );
    }
  };

  return (
    <div className="overflow-x-hidden ">
      <Navbar />
      <div className="mt-20 md:mt-6 w-full max-w-[90vw] mx-auto">
        <Image
          src="/banner.png"
          width={1200}
          height={300}
          alt="Banner"
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      <div className="px-4 sm:px-6 md:px-8 py-6 md:py-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 mt-6">
          Barang Terbaru
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {isLoading ? (
            <div className="text-center w-full">Loading...</div>
          ) : error ? (
            <div className="text-center w-full text-red-500">
              Error memuat data
            </div>
          ) : data && data[0].length > 0 ? (
            data[0]
              .sort((a: Barang, b: Barang) => {
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              })
              .slice(0, 10)
              .map((barang: Barang) => (
                <div
                  className="bg-white border border-gray-200 rounded-lg shadow-sm flex-shrink-0 w-48 sm:w-60 md:w-64"
                  key={barang.id_barang}
                >
                  <Link
                    href={`/product-details/${barang.id_barang}`}
                    className="flex flex-col h-full"
                  >
                    <Image
                      src={getPrimaryGambar(barang.gambar) as string}
                      alt={barang.nama_barang}
                      width={480}
                      height={480}
                      className="p-4 sm:p-6 md:p-8 rounded-t-lg w-full h-40 sm:h-48 md:h-56 object-cover"
                    />
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex flex-col justify-between flex-grow">
                      <h5 className="text-sm sm:text-base md:text-lg tracking-tight text-gray-900 line-clamp-2">
                        {barang.nama_barang}
                      </h5>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                          Rp
                          {new Intl.NumberFormat("id-ID").format(barang.harga)}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(barang);
                          }}
                          className="text-gray-600 hover:text-blue-600"
                          aria-label={`Tambah ${barang.nama_barang} ke keranjang`}
                        >
                          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
          ) : (
            <div className="text-center w-full">Tidak ada data</div>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 mt-6">
          Semua Produk
        </h2>
        <div className="mb-6">
          <label htmlFor="category" className="mr-2 text-base sm:text-lg">
            Filter berdasarkan kategori:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-md text-sm sm:text-base w-full sm:w-auto"
          >
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.name === "Semua" ? "" : category.name}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
          {isLoading ? (
            <div className="col-span-full text-center">Loading...</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500">
              Error memuat data
            </div>
          ) : data && data[0].length > 0 ? (
            data[0].map((barang: Barang) => (
              <div
                className="bg-white border border-gray-200 rounded-lg shadow-sm w-full"
                key={barang.id_barang}
              >
                <Link
                  href={`/product-details/${barang.id_barang}`}
                  className="flex flex-col h-full"
                >
                  <Image
                    src={getPrimaryGambar(barang.gambar) as string}
                    alt={barang.nama_barang}
                    width={1080}
                    height={1080}
                    className="p-4 sm:p-6 md:p-8 rounded-t-lg w-full h-40 sm:h-48 md:h-56 object-cover xl:object-contain"
                  />
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex flex-col justify-between flex-grow">
                    <h5 className="text-sm sm:text-base md:text-lg tracking-tight text-gray-900 line-clamp-2">
                      {barang.nama_barang}
                    </h5>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                        Rp{new Intl.NumberFormat("id-ID").format(barang.harga)}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(barang);
                        }}
                        className="text-gray-600 hover:text-blue-600"
                        aria-label={`Tambah ${barang.nama_barang} ke keranjang`}
                      >
                        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center">Tidak ada data</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
