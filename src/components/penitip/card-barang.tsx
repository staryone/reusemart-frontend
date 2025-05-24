import Image from "next/image";
import Link from "next/link";
import { Barang, Gambar } from "@/lib/interface/barang.interface";
import { format, differenceInDays } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import { DetailPenitipan } from "@/lib/interface/detail-penitipan.interface";

interface Props {
  dtlPenitipan: DetailPenitipan;
}

export default function CardBarang({ dtlPenitipan }: Props) {
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatTanggal = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy", { locale: id });
  };

  return (
    <>
      <div className="flex gap-5 items-start border rounded-xl p-4 mb-4 bg-white shadow-sm">
        {/* Kiri: Tanggal dan info */}
        <div className="w-2/12">
          <img src="/product.png" alt="gambar produk" />
        </div>

        {/* Tengah: Produk info */}
        <div className="w-full">
          <div className="flex flex-col gap-3">
            <p className="font-semibold text-xl line-clamp-2">
              {dtlPenitipan.barang.nama_barang}
            </p>
            <hr className="w-full" />
            <p className="text-sm text-gray-600">
              <span className="font-normal text-xl">
                {formatRupiah(dtlPenitipan.barang.harga)}
              </span>
            </p>

            <p className="text-sm">
              Tanggal masuk:{" "}
              <span className="text-[#72C678] font-semibold">
                {formatTanggal(dtlPenitipan.tanggal_masuk)}
              </span>
            </p>
            <p className="text-sm">
              Batas penitipan:{" "}
              <span className="text-[#72C678] font-semibold">
                {formatTanggal(dtlPenitipan.tanggal_akhir)}
              </span>
            </p>
            <div className="flex justify-between">
              <p className="text-md">
                Sisa waktu:{" "}
                <span className="text-[#e80505] font-semibold">
                  {differenceInDays(
                    new Date(dtlPenitipan.tanggal_akhir),
                    new Date()
                  ) > 0
                    ? differenceInDays(
                        new Date(dtlPenitipan.tanggal_akhir),
                        new Date()
                      )
                    : 0}{" "}
                  hari
                </span>{" "}
                hari
              </p>
              <button className="bg-[#72C678] text-white px-4 py-2 rounded-lg hover:bg-[#008E6D]">
                Perpanjang Masa Penitipan
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
