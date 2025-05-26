import Image from "next/image";
import Link from "next/link";
import { Barang, Gambar } from "@/lib/interface/barang.interface";
import { format, differenceInDays } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import { DetailPenitipan } from "@/lib/interface/detail-penitipan.interface";
import { get } from "http";

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
    return format(new Date(date), "dd MMMM yyyy, HH:mm", { locale: id });
  };

  const remainingDays = differenceInDays(
    new Date(dtlPenitipan.tanggal_akhir),
    new Date()
  );

  const getPrimaryGambar = (gambars: Gambar[]): string => {
    console.log("gambars:", gambars);
    const primaryGambar = gambars.find(
      (gambar: Gambar) => gambar.is_primary == true
    );
    console.log("primaryGambar:", primaryGambar);
    return primaryGambar ? primaryGambar.url_gambar : "/product.png";
  };

  return (
    <>
      <div className="flex gap-5 items-start border rounded-xl p-4 mb-4 bg-white shadow-sm">
        <div className="w-2/12">
          <Image
            src={getPrimaryGambar(dtlPenitipan.barang.gambar)}
            alt="product image"
            width={480}
            height={480}
            className="p-8 rounded-t-lg"
          />
        </div>
        <div className="w-full">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <p className="font-semibold text-xl line-clamp-2">
                {dtlPenitipan.barang.nama_barang}
              </p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                  dtlPenitipan.barang.status === "TERSEDIA"
                    ? "bg-green-500"
                    : dtlPenitipan.barang.status === "TERJUAL"
                    ? "bg-blue-500"
                    : dtlPenitipan.barang.status === "DIDONASIKAN"
                    ? "bg-purple-500"
                    : dtlPenitipan.barang.status === "KEMBALI"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              >
                {dtlPenitipan.barang.status}
              </span>
            </div>

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
              </p>
              <div className="flex gap-2">
                <button className="bg-[#72C678] text-white px-4 py-2 rounded-lg hover:bg-[#008E6D] transition-colors">
                  Ambil Barang
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    remainingDays > 0
                      ? "bg-[#72C678] hover:bg-[#008E6D]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={remainingDays <= 0}
                >
                  Perpanjang Penitipan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
