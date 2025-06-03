// components/penitip/detail-barang-modal.tsx
import Image from "next/image";
import { DetailPenitipan } from "@/lib/interface/detail-penitipan.interface";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Gambar } from "@/lib/interface/barang.interface";

interface DetailBarangModalProps {
  isOpen: boolean;
  onClose: () => void;
  penitipan: DetailPenitipan | null;
}

export default function DetailBarangModal({
  isOpen,
  onClose,
  penitipan,
}: DetailBarangModalProps) {
  if (!isOpen || !penitipan) return null;

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

  const getPrimaryGambar = (gambars: Gambar[]): string => {
    const primaryGambar = gambars.find((gambar) => gambar.is_primary);
    return primaryGambar ? primaryGambar.url_gambar : "/product.png";
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Detail Barang</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div>
            <Image
              src={getPrimaryGambar(penitipan.barang.gambar)}
              alt={penitipan.barang.nama_barang}
              width={400}
              height={400}
              className="rounded-lg object-cover w-full"
            />
            {penitipan.barang.gambar.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {penitipan.barang.gambar.map((gambar, index) => (
                  <Image
                    key={index}
                    src={gambar.url_gambar}
                    alt={`Gambar ${index + 1}`}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              {penitipan.barang.nama_barang}
            </h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="font-medium">
                  {penitipan.barang.status === "MENUNGGU_KEMBALI"
                    ? "MENUNGGU DIAMBIL"
                    : penitipan.barang.status}
                </span>
              </p>
              <p>
                <span className="font-medium">Harga:</span>{" "}
                {formatRupiah(penitipan.barang.harga)}
              </p>
              <p>
                <span className="font-medium">Tanggal Masuk:</span>{" "}
                {formatTanggal(penitipan.tanggal_masuk)}
              </p>
              <p>
                <span className="font-medium">Batas Penitipan:</span>{" "}
                {formatTanggal(penitipan.tanggal_akhir)}
              </p>
              <p>
                <span className="font-medium">Batas Ambil:</span>{" "}
                {formatTanggal(penitipan.batas_ambil)}
              </p>
              <p>
                <span className="font-medium">Perpanjangan:</span>{" "}
                {penitipan.is_perpanjang === true
                  ? "TIDAK TERSEDIA"
                  : "TERSEDIA"}
              </p>
              <p>
                <span className="font-medium">Garansi:</span>{" "}
                {penitipan.barang.garansi !== null
                  ? formatTanggal(penitipan.barang.garansi)
                  : "Tidak ada garansi"}
              </p>
              <p>
                <span className="font-medium">Deskripsi:</span>{" "}
                {penitipan.barang.deskripsi}
              </p>
              <p>
                <span className="font-medium">Berat:</span>{" "}
                {penitipan.barang.berat} kg
              </p>
              <p>
                <span className="font-medium">Kategori:</span>{" "}
                {penitipan.barang.kategori.nama_kategori}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
