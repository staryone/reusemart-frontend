"use client";
import Navbar from "@/components/utama/navbar";
// import { Carousel } from "flowbite-react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
// import Image from "next/image";

import { getBarang } from "@/lib/api/barang.api";
import { Barang } from "@/lib/interface/barang.interface";
import { useParams } from "next/navigation";

import { useState, useEffect } from "react";

export default function ProductDetails() {
  const [barang, setBarang] = useState<Barang | null>(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchBarang() {
      try {
        const response = await getBarang(id?.toString());

        setBarang(response);
      } catch (error) {
        console.error("Gagal memuat history:", error);
      }
    }
    fetchBarang();
  }, []);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A"; // Handle missing dates
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const images = [
    "../product.png",
    "https://res.cloudinary.com/demo/image/upload/v1652366604/docs/demo_image5.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1652345874/docs/demo_image1.jpg",
  ];
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="overflow-x-hidden w-screen pt-30 pb-10 px-24">
        <div className="flex justify-center gap-20 h-fit w-full">
          <div className="w-1/3 place-items-center">
            <Carousel useKeyboardArrows={true}>
              {images.map((URL, index) => (
                <div key={index} className="slide relative w-full h-full">
                  <img
                    alt="sample_file"
                    src={URL}
                    key={index}
                    style={{ objectFit: "contain" }}
                    className="w-4/5!"
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="flex flex-col items-start justify-items-center gap-10 max-w-1/2">
            <div className="text-xl font-semibold">{barang?.nama_barang}</div>
            <div className="text-4xl font-semibold">Rp{barang?.harga !== undefined ? new Intl.NumberFormat('id-ID').format(barang.harga) : '0'}</div>
            <button className="bg-blue-500 text-white p-3 rounded-lg w-64">
              Tambahkan ke Keranjang
            </button>
            <button className="text-blue-500 border-2 border-blue-500 p-3 rounded-lg w-64">
              Beli Langsung
            </button>
          </div>
        </div>
        <div className="mt-10">
          <div className="text-2xl my-5 font-bold">Informasi Produk</div>
          <div className="flex flex-col gap-4 mb-10 text-md">
            <div className="flex justify-between w-72">
              <div>Nama penitip: </div>
              <div>{barang?.penitip.nama}</div>
            </div>
            <div className="flex justify-between w-72">
              <div>Berat produk: </div>
              <div>{barang?.berat} kg</div>
            </div>
            <div className="flex justify-between w-72">
              <div>Kategori: </div>
              <div>{barang?.kategori.nama_kategori}</div>
            </div>
            <div className="flex justify-between w-72">
              <div>Garansi: </div>
              <div>{barang?.garansi == null ? "Tidak ada" : formatDate(barang.garansi)}</div>
            </div>
          </div>
          <div className="text-2xl my-5 font-bold">Deskripsi</div>
          <div className="text-md">
            {barang?.deskripsi}
          </div>
        </div>
        <div>
          <div className="text-2xl mt-10 mb-3 font-bold">Diskusi Produk</div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <img
                src="../profile.png"
                alt="profile"
                className="rounded-full h-8 border-1"
              />
              <div className="text-md">Nama</div>
            </div>
            <div className="text-lg ml-11">Apakah produknya ori?</div>
            <hr className="my-3 border-gray-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <img
                src="../profile.png"
                alt="profile"
                className="rounded-full h-8 border-1"
              />
              <div className="text-md">Customer Service</div>
            </div>
            <div className="text-lg ml-11">Ori dongs</div>
            <hr className="my-3 border-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
