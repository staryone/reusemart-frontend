"use client";
import Navbar from "@/app/components/NavBar";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";
import Link from "next/link";

export default function HistoryPembelian() {
  return (
    <div className="overflow-x-hidden bg-gray-100 min-h-screen pb-40 pt-16">
      <Navbar />
      <div className="overflow-x-hidden w-screen py-10 px-24">
        <h1 className="text-2xl font-bold mb-12">History Pembelian</h1>
        <div className="p-8 bg-white rounded-2xl my-2">
          <div className="flex">
            <div className="flex justify-between ml-5 w-full">
              <Link href={"/pages/product-details"} className="flex gap-5">
                <div className="w-18 h-18">
                  <Image
                    src={"/product.png"}
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-xl relative!"
                  />
                </div>
                <div className="flex flex-col">
                    <div className="text-sm text-gray-400">Nomor nota: 25.04.202</div>
                    <div>Apple watch keren bagus mahal <span className="text-gray-500">(+ 1 barang lainnya)</span></div>
                    <div className="text-gray-400 text-sm">20 April 2025</div>
                </div>
              </Link>
              <div className="flex flex-col gap-3 items-end justify-between">
                <div className="flex items-center gap-5">
                    <div className="px-2 py-1 rounded-lg bg-amber-200 text-orange-500 font-bold text-sm">Diproses</div>
                    <div className="text-xl font-semibold">Rp2.500.000</div>
                </div>
                <Link href={"/"} className="my-3 rounded-lg py-2 px-8 bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-1 hover:border-blue-500 transition-colors">Lihat detail</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
