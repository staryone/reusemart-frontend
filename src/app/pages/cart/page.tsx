"use client";
import Navbar from "@/app/components/NavBar";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";
import Link from "next/link";
import { LucideTrash2 } from "lucide-react";

export default function ProductDetails() {
  return (
    <div className="overflow-x-hidden bg-gray-100 min-h-screen">
      <Navbar />
      <div className="overflow-x-hidden w-screen py-10 px-24">
        <h1 className="text-2xl font-bold mb-12">Keranjang</h1>
        <div className="p-8 bg-white rounded-2xl flex items-center">
            <input type="checkbox" name="chooseAll" id="chooseAll" className="w-5 h-5"/>
            <label htmlFor="chooseAll" className="ml-5 font-bold">Pilih semua</label>
        </div>
        <div className="p-8 bg-white rounded-2xl my-2">
            <div className="flex items-center mb-5">
                <input type="checkbox" name="choosePenitip" id="choosePenitip" className="w-5 h-5"/>
                <label htmlFor="choosePenitip" className="ml-5 font-bold">Penitip Beuh</label>
            </div>
            <div className="flex">
                <input type="checkbox" name="chooseProduk" id="" className="w-5 h-5" />
                <div className="flex justify-between ml-5 w-full">
                    <Link href={"/pages/product-details"} className="flex gap-5">
                        <div className="w-18">
                            <Image src={"/product.png"} alt="" fill style={{ objectFit: "cover" }} className="rounded-xl relative!"/>
                        </div>
                        <div>Apple watch keren bagus mahal</div>
                    </Link>
                    <div className="flex flex-col items-end justify-between">
                        <div className="text-xl font-semibold">Rp2.500.000</div>
                        <LucideTrash2 className="text-gray-500"/>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
