import Image from "next/image";
import Link from "next/link";
import { Transaksi } from "@/lib/interface/transaksi.interface";
import { Barang, Gambar } from "@/lib/interface/barang.interface";
import { format } from "date-fns";
import { id, tr } from "date-fns/locale";
import { useState } from "react";

interface Props {
  transaksi: Transaksi;
}

export default function CardTransaksi({ transaksi }: Props) {
  const [firstBarang, setFirstBarang] = useState<Barang | null>(null);
  console.log(transaksi);

  const formattedDate = format(
    new Date(transaksi.tanggal_transaksi),
    "dd MMM yyyy",
    { locale: id }
  );

  const formatYear = format(new Date(transaksi.tanggal_transaksi), "yyyy");

  const formatMonth = format(new Date(transaksi.tanggal_transaksi), "MM");

  const getFirstBarang = (transaksi: Transaksi) => {
    const firstDetail = transaksi.detail_transaksi?.[0];
    return firstDetail?.barang || null;
  };

  return (
    <div className="flex justify-between items-start border rounded-xl p-4 mb-4 bg-white shadow-sm">
      {/* Kiri: Tanggal dan info */}
      <div className="flex flex-col w-3/12">
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <span>{formattedDate}</span>
        </div>
        <span className="text-xs text-gray-400">
          {formatYear}.{formatMonth}.{transaksi.id_transaksi}
        </span>
      </div>

      {/* Tengah: Produk info */}
      <div className="flex w-6/12 items-start gap-4">
        <div className="flex flex-col">
          {/* <p className="font-semibold text-sm mb-1 line-clamp-2">
            {getFirstBarang(transaksi)?.nama_barang || "Barang tidak tersedia"}
          </p> */}
          <p className="font-semibold text-sm mb-1 line-clamp-2">
            {getFirstBarang(transaksi)?.nama_barang || "Barang tidak tersedia"}
            <span className="font-normal text-xs">
              {transaksi.detail_transaksi.length > 1 &&
                ` + ${transaksi.detail_transaksi.length - 1} barang lainnya`}
            </span>
          </p>

          <p className="text-sm text-gray-600">
            Rp {getFirstBarang(transaksi)?.harga || "Barang tidak tersedia"}{" "}
            <span className="font-normal text-xs">
              {transaksi.detail_transaksi.length > 1 &&
                ` + ${transaksi.detail_transaksi.length - 1} barang lainnya`}
            </span>
          </p>

          <div className="flex gap-2 mt-3 text-sm">
            <Link
              href={`/transaksi/${transaksi.id_transaksi}`}
              className="text-[#72C678] hover:text-[#008E6D] font-semibold"
            >
              Lihat Detail Transaksi
            </Link>
            {/* <button className="border border-green-600 text-green-600 px-2 py-1 rounded hover:bg-green-50">
              Ulas
            </button>
            <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
              Beli Lagi
            </button> */}
          </div>
        </div>
      </div>

      {/* Kanan: Total */}
      <div className="flex flex-col items-end justify-between w-3/12 text-right">
        <p className="text-sm text-gray-500">Total Belanja</p>
        <p className="text-lg font-bold text-gray-800">
          Rp {transaksi.total_akhir.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
