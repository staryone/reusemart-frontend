"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useSWR from "swr";
import {
  getTransaksi,
  expiredTransaksi,
  uploadBuktiPembayaranTransaksi,
} from "@/lib/api/transaksi.api";
import { useUser } from "@/hooks/use-user";
import { TransaksiPayment } from "@/lib/interface/transaksi.interface";

// Fetcher for useSWR
const fetcherTransaksi = async ([idTransaksi, token]: [
  string,
  string | null
]): Promise<TransaksiPayment> => {
  return await getTransaksi(idTransaksi, token || "");
};

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [hasExpired, setHasExpired] = useState<boolean>(false); // Track if expiry has been handled
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // Track if payment is successful

  const currentUser = useUser();
  const token = currentUser?.token || null;

  // Check for idTransaksi in localStorage
  const idTransaksiString =
    typeof window !== "undefined" ? localStorage.getItem("idTransaksi") : null;
  const idTransaksi = idTransaksiString
    ? parseInt(idTransaksiString, 10)
    : null;

  // Redirect if idTransaksi is not present
  useEffect(() => {
    setIsClient(true);
    if (!idTransaksiString || (isNaN(idTransaksi!) && !isSuccess)) {
      toast.error("Transaksi tidak ditemukan.");
      router.push("/cart");
    }
  }, [idTransaksiString, idTransaksi, router]);

  // Fetch transaction data using useSWR
  const {
    data: transaksi,
    error: transaksiError,
    isLoading: isLoadingTransaksi,
  } = useSWR(
    idTransaksi && token !== undefined ? [idTransaksi.toString(), token] : null,
    fetcherTransaksi,
    { revalidateOnFocus: false }
  );

  // Check transaction status and initialize countdown
  useEffect(() => {
    if (!isClient || !transaksi) return;

    // Redirect if status is not "BELUM_DIBAYAR"
    if (transaksi.status_Pembayaran !== "BELUM_DIBAYAR") {
      toast.error("Transaksi ini tidak ditemukan.");
      localStorage.removeItem("idTransaksi");
      router.push("/cart");
      return;
    }

    // Calculate remaining time from batas_pembayaran
    const batasPembayaran = new Date(transaksi.batas_pembayaran).getTime();
    const now = new Date().getTime();
    const remainingSeconds = Math.max(
      0,
      Math.floor((batasPembayaran - now) / 1000)
    );

    // If time has already expired on page load/refresh
    if (remainingSeconds <= 0 && !hasExpired) {
      setHasExpired(true);
      handleExpiry();
      return;
    }

    setTimeLeft(remainingSeconds);
  }, [isClient, transaksi, router, hasExpired]);

  // Countdown logic
  useEffect(() => {
    if (timeLeft <= 0 || hasExpired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasExpired) {
            handleExpiry();
            setHasExpired(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasExpired]);

  // Handle expiry (call expiredTransaksi and set state)
  const handleExpiry = async () => {
    if (idTransaksi && token) {
      try {
        const res = await expiredTransaksi(idTransaksi.toString(), token);
        if (res.errors) {
          toast.error(res.errors || "Gagal membatalkan transaksi.");
        } else {
          toast.success("Transaksi telah dibatalkan karena waktu habis.");
        }
      } catch {
        toast.error("Gagal membatalkan transaksi.");
      }
    }
    localStorage.removeItem("idTransaksi");
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 2MB.");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast.error("Harap unggah bukti pembayaran.");
      return;
    }
    if (!idTransaksi || !token) {
      toast.error("Transaksi tidak valid.");
      return;
    }

    const formData = new FormData();
    formData.set("buktiPembayaran", image);

    try {
      const res = await uploadBuktiPembayaranTransaksi(
        idTransaksi.toString(),
        formData,
        token
      );
      if (res.errors) {
        toast.error(res.errors || "Gagal mengunggah bukti pembayaran.");
      } else {
        setIsSuccess(true);
        toast.success("Bukti pembayaran berhasil diunggah!");
      }
    } catch {
      toast.error("Terjadi kesalahan saat mengunggah bukti pembayaran.");
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  // Loading state
  if (!isClient || isLoadingTransaksi || !idTransaksi || !token) {
    return (
      <div className="w-full min-h-screen bg-gray-100 py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-center mt-20">
        <p>Memuat data transaksi...</p>
      </div>
    );
  }

  // Error state
  if (transaksiError || transaksi?.errors) {
    return (
      <div className="w-full min-h-screen bg-gray-100 py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-center mt-20">
        <p className="text-red-500">Gagal memuat data transaksi.</p>
      </div>
    );
  }

  // If no transaction data
  if (!transaksi) {
    return (
      <div className="w-full min-h-screen bg-gray-100 py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-center mt-20">
        <p>Data transaksi tidak ditemukan.</p>
      </div>
    );
  }

  // If payment is successful
  if (isSuccess) {
    return (
      <div className="w-full min-h-screen bg-gray-100 py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-center mt-20">
        <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-sm text-center">
          <svg
            className="w-16 h-16 text-[#72C678] mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-slate-800 text-2xl sm:text-3xl font-bold leading-tight mb-2">
            Pembayaran Berhasil
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mb-6">
            Bukti pembayaran Anda telah berhasil diunggah dan akan segera
            diverifikasi.
          </p>
          <button
            onClick={() => router.push("/profil")}
            className="bg-[#72C678] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5da060] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5da060] focus:ring-offset-2"
          >
            Lihat Profil
          </button>
        </div>
      </div>
    );
  }

  // If countdown has expired
  if (timeLeft <= 0 || hasExpired) {
    return (
      <div className="w-full min-h-screen bg-gray-100 py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-center mt-20">
        <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-sm text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-slate-800 text-2xl sm:text-3xl font-bold leading-tight mb-2">
            Pembayaran Kedaluwarsa
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mb-6">
            Waktu untuk menyelesaikan pembayaran telah habis. Transaksi Anda
            telah dibatalkan.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-[#72C678] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5da060] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5da060] focus:ring-offset-2"
          >
            Kembali ke Halaman Utama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 py-8 sm:py-12 px-4 sm:px-6 flex justify-center mt-20">
      <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-sm">
        {/* Title and Description */}
        <div className="text-center mb-8">
          <h1 className="text-slate-800 text-2xl sm:text-3xl font-bold leading-tight">
            Selesaikan Pembayaran Anda
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Pesanan Anda akan dibatalkan jika Anda tidak menyelesaikan
            pembayaran dalam waktu yang ditentukan.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-[#f8fafc] rounded-lg p-4 flex flex-col items-center justify-center min-h-[5rem]">
            <p className="text-4xl font-extrabold text-slate-800 leading-none">
              {hours}
            </p>
            <p className="text-xs font-medium text-slate-600 mt-1">Jam</p>
          </div>
          <div className="bg-[#f8fafc] rounded-lg p-4 flex flex-col items-center justify-center min-h-[5rem]">
            <p className="text-4xl font-extrabold text-slate-800 leading-none">
              {minutes}
            </p>
            <p className="text-xs font-medium text-slate-600 mt-1">Menit</p>
          </div>
          <div className="bg-[#f8fafc] rounded-lg p-4 flex flex-col items-center justify-center min-h-[5rem]">
            <p className="text-4xl font-extrabold text-slate-800 leading-none">
              {seconds}
            </p>
            <p className="text-xs font-medium text-slate-600 mt-1">Detik</p>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="border-t border-slate-200 pt-6 mb-8">
          <h3 className="text-slate-800 text-lg font-semibold mb-4">
            Detail Transaksi
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <p className="text-slate-500">Nomor Transaksi</p>
              <p className="text-slate-700 font-medium">
                {transaksi.nomor_transaksi}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-slate-500">Total yang Harus Dibayar</p>
              <p className="text-slate-700 font-medium">
                Rp {transaksi.total_akhir.toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-slate-500">Bank Tujuan</p>
              <p className="text-slate-700 font-medium">Bank ABC</p>
            </div>
            <div className="flex justify-between">
              <p className="text-slate-500">Nomor Rekening</p>
              <p className="text-slate-700 font-medium">123-456-7890</p>
            </div>
            <div className="flex justify-between">
              <p className="text-slate-500">Atas Nama</p>
              <p className="text-slate-700 font-medium">PT. Reusemart</p>
            </div>
          </div>
        </div>

        {/* Upload Proof of Payment */}
        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-slate-800 text-lg font-semibold mb-4">
            Unggah Bukti Pembayaran
          </h3>
          <label className="group block border-2 border-dashed border-slate-300 rounded-lg p-12 text-center cursor-pointer hover:bg-slate-100 transition-colors">
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-12 h-12 text-slate-400 group-hover:text-[#72C678] mb-3 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <p className="text-slate-700 font-semibold text-base group-hover:text-[#72C678] transition-colors">
                Klik untuk mengunggah
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Format: JPG, PNG, PDF (Maks. 2MB)
              </p>
            </div>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleImageUpload}
              className="sr-only"
            />
          </label>
          {preview && (
            <div className="mt-4">
              <Image
                src={preview}
                alt="Payment proof preview"
                width={80}
                height={80}
                className="rounded-lg object-cover border border-slate-200"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={timeLeft <= 0 || !transaksi}
            className="w-full bg-[#72C678] text-white py-3 rounded-lg font-semibold hover:bg-[#5da060] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5da060] focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Konfirmasi Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
