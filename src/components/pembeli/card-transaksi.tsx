import Image from "next/image";
import Link from "next/link";
import { Transaksi } from "@/lib/interface/transaksi.interface";
import { Barang, Gambar } from "@/lib/interface/barang.interface";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Props {
  transaksi: Transaksi;
}

export default function CardTransaksi({ transaksi }: Props) {
  const formattedDate = format(
    new Date(transaksi.tanggal_transaksi),
    "dd MMM yyyy",
    { locale: id }
  );

  const getPrimaryGambar = (gambars: Gambar[]): string | null => {
    const primaryGambar = gambars.find((gambar: Gambar) => gambar.is_primary);
    return primaryGambar ? primaryGambar.url_gambar : null;
  };

  return (
    <div className="flex justify-between items-start border rounded-xl p-4 mb-4 bg-white shadow-sm">
      {/* Kiri: Tanggal dan info */}
      <div className="flex flex-col w-3/12">
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <span className="mr-2">🛍️ Belanja</span>
          <span>{formattedDate}</span>
        </div>
        <span className="text-xs text-gray-400">
          INV/20250413/MPL/{String(transaksi.id_transaksi).padStart(9, "0")}
        </span>
      </div>

      {/* Tengah: Produk info */}
      <div className="flex w-6/12 items-start gap-4">
        <Image
          src={getPrimaryGambar(transaksi.barang[0].gambar) as string}
          alt="produk"
          width={60}
          height={60}
          className="rounded border object-cover"
        />
        <div className="flex flex-col">
          <p className="font-semibold text-sm mb-1 line-clamp-2">
            SXDOOL Kipas Pendingin Router CPU Fan Cooler Cooling USB 120mm -
            SX120
          </p>
          <p className="text-sm text-gray-600">3 barang x Rp60.900</p>

          <div className="flex gap-2 mt-3 text-sm">
            <Link
              href={`/transaksi/${transaksi.id_transaksi}`}
              className="text-green-600 font-semibold hover:underline"
            >
              Lihat Detail Transaksi
            </Link>
            <button className="border border-green-600 text-green-600 px-2 py-1 rounded hover:bg-green-50">
              Ulas
            </button>
            <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
              Beli Lagi
            </button>
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
