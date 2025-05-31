import Image from "next/image";
import { Gambar } from "@/lib/interface/barang.interface";
import { format, differenceInSeconds } from "date-fns";
import { id } from "date-fns/locale";
import { DetailPenitipan } from "@/lib/interface/detail-penitipan.interface";
import { useState, useEffect } from "react";
import { extendPenitipan, updateBarangStatus } from "@/lib/api/penitip.api";
import { useUser } from "@/hooks/use-user";
import toast from "react-hot-toast";

interface Props {
  dtlPenitipan: DetailPenitipan;
  accessToken: string;
  onExtendSuccess: () => void;
  onPickupSuccess: () => void;
}

export default function CardBarang({
  dtlPenitipan,
  accessToken,
  onExtendSuccess,
  onPickupSuccess,
}: Props) {
  const [penitipan, setPenitipan] = useState<DetailPenitipan>(dtlPenitipan);
  const [countdown, setCountdown] = useState<string>("");
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const currentUser = useUser();
  const token = accessToken || (currentUser !== null ? currentUser.token : "");

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

  const formatCountdown = (seconds: number): string => {
    if (seconds <= 0) return "00:00:00:00";
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;
    return `${days.toString().padStart(2, "0")}:${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endDate = new Date(penitipan.tanggal_akhir);
      const secondsLeft = differenceInSeconds(endDate, now);
      setCountdown(formatCountdown(secondsLeft));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [penitipan.tanggal_akhir]);

  const remainingSeconds = differenceInSeconds(
    new Date(penitipan.tanggal_akhir),
    new Date()
  );

  const remainingPickupSeconds = differenceInSeconds(
    new Date(penitipan.batas_ambil),
    new Date()
  );

  const getPrimaryGambar = (gambars: Gambar[]): string => {
    const primaryGambar = gambars.find(
      (gambar: Gambar) => gambar.is_primary == true
    );
    return primaryGambar ? primaryGambar.url_gambar : "/product.png";
  };

  const handleExtendPenitipan = async () => {
    try {
      const updatedPenitipan = await extendPenitipan(
        dtlPenitipan.id_dtl_penitipan,
        token
      );
      setPenitipan(updatedPenitipan);
      onExtendSuccess();
      toast.success("Penitipan berhasil diperpanjang!");
    } catch {
      toast.error("Gagal memperpanjang penitipan: " + "Unknown error");
    } finally {
      setIsExtendModalOpen(false);
    }
  };

  const handlePickupItem = async () => {
    try {
      const data = {
        id_barang: dtlPenitipan.barang.id_barang,
        status: "MENUNGGU_KEMBALI",
      };
      const formData = new FormData();
      formData.append("id_barang", data.id_barang);
      formData.append("status", data.status);
      const result = await updateBarangStatus(data, accessToken);

      if (result.errors) {
        toast.error("Barang gagal diambil! " + result.errors);
      } else {
        toast.success("Barang berhasil diambil!");
        onPickupSuccess();
        setIsPickupModalOpen(false);
      }
    } catch {
      toast.error("Gagal mengambil barang: " + "Unknown error");
    }
  };

  return (
    <>
      {/* Extend Confirmation Modal */}
      {isExtendModalOpen && (
        <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              Konfirmasi Perpanjangan Penitipan
            </h2>
            <p className="mb-6">
              Apakah Anda yakin ingin memperpanjang penitipan untuk{" "}
              <span className="font-semibold">
                {dtlPenitipan.barang.nama_barang}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => setIsExtendModalOpen(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#72C678] hover:bg-[#008E6D] text-white"
                onClick={handleExtendPenitipan}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pickup Confirmation Modal */}
      {isPickupModalOpen && (
        <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Konfirmasi Pengambilan Barang
            </h2>
            <p className="mb-6">
              Apakah Anda yakin ingin mengambil{" "}
              <span className="font-semibold">
                {penitipan.barang.nama_barang}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => setIsPickupModalOpen(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#72C678] hover:bg-[#008E6D] text-white"
                onClick={handlePickupItem}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-5 items-start border rounded-xl p-4 mb-4 bg-white shadow-sm">
        <div className="w-3/12">
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
                    : dtlPenitipan.barang.status === "MENUNGGU_KEMBALI"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
                }`}
              >
                {dtlPenitipan.barang.status === "MENUNGGU_KEMBALI"
                  ? "MENUNGGU DIAMBIL"
                  : dtlPenitipan.barang.status}
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
            <p className="text-sm">
              Batas ambil:{" "}
              <span className="text-[#72C678] font-semibold">
                {formatTanggal(dtlPenitipan.batas_ambil)}
              </span>
            </p>
            <div className="flex justify-between">
              <p className="text-md">
                Sisa waktu:{" "}
                <span className="text-[#e80505] font-semibold">
                  {countdown}
                </span>{" "}
              </p>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    remainingPickupSeconds > 0 &&
                    dtlPenitipan.barang.status === "TERSEDIA"
                      ? "bg-[#72C678] hover:bg-[#008E6D]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={
                    remainingPickupSeconds <= 0 ||
                    dtlPenitipan.barang.status !== "TERSEDIA"
                  }
                  onClick={() => setIsPickupModalOpen(true)}
                >
                  Ambil Barang
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    !penitipan.is_perpanjang && remainingSeconds > 0
                      ? "bg-[#72C678] hover:bg-[#008E6D]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={penitipan.is_perpanjang || remainingSeconds <= 0}
                  onClick={() => setIsExtendModalOpen(true)}
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
