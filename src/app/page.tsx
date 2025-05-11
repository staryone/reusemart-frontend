"use client";
import Navbar from "../components/utama/navbar";
import { getListBarang } from "@/lib/api/barang.api";
import { Barang } from "@/lib/interface/barang.interface";
// import Image from "next/image";
import { useState, useMemo } from "react";
import useSWR from "swr";

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getListBarang(params, token);

export default function Home() {
  const [searchQuery] = useState("");

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({});
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    return params;
  }, [searchQuery]);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUEVNQkVMSSIsImlhdCI6MTc0NjY5MDY2MCwiZXhwIjoxNzQ3Mjk1NDYwfQ.UcUMayyDsFe4jrfIN10MXzVOfvZeSD-og7y4zYG21S0";

  const { data, error, isLoading } = useSWR(
    [queryParams, token],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const search = formData.get("search-alamat") as string;
  //   setSearchQuery(search);
  // };
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      {/* <div className="w-screen h-auto">
        <img src="banner.png" alt="image" className="w-screen" />
      </div> */}
      <div className="flex flex-col items-start justify-items-center px-18 py-18">
        <h2 className="text-4xl mb-4 mt-10">Barang Terbaru</h2>
        <div className="flex gap-3 overflow-x-auto max-w-full">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error loading data</div>
          ) : data && data[0].length > 0 ? (
            data[0].map((barang: Barang) => (
              <div
                className="bg-white border border-gray-200 rounded-lg shadow-sm flex-shrink-0 w-64"
                key={barang.id_barang}
              >
                <a href={`/product-details/${barang.id_barang}`} className="flex flex-col h-full">
                  <img
                    className="p-8 rounded-t-lg"
                    src="/product.png"
                    alt="product image"
                  />
                  <div className="px-5 pb-5 flex flex-col justify-between flex-grow">
                    <h5 className="text-lg tracking-tight text-gray-900">
                      {barang.nama_barang}
                    </h5>
                    <div className="text-xl font-bold text-gray-900">
                      Rp{new Intl.NumberFormat('id-ID').format(barang.harga)}
                    </div>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <div>No data found</div>
          )}
        </div>
        <h2 className="text-4xl mb-4 mt-10">Semua Produk</h2>
        <div className="flex gap-3 overflow-x-auto max-w-full">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error loading data</div>
          ) : data && data[0].length > 0 ? (
            data[0].map((barang: Barang) => (
              <div
                className="bg-white border border-gray-200 rounded-lg shadow-sm flex-shrink-0 w-64"
                key={barang.id_barang}
              >
                <a href={`/pages/product-details/${barang.id_barang}`} className="flex flex-col h-full">
                  <img
                    className="p-8 rounded-t-lg"
                    src="/product.png"
                    alt="product image"
                  />
                  <div className="px-5 pb-5 flex flex-col justify-between flex-grow">
                    <h5 className="text-lg tracking-tight text-gray-900">
                      {barang.nama_barang}
                    </h5>
                    <div className="text-xl font-bold text-gray-900">
                      Rp{new Intl.NumberFormat('id-ID').format(barang.harga)}
                    </div>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <div>No data found</div>
          )}
        </div>
      </div>
    </div>
  );
}
