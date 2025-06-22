"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import useSWR from "swr";

import { Pembeli } from "@/lib/interface/pembeli.interface";
import { Keranjang } from "@/lib/interface/keranjang.interface";
import { Alamat } from "@/lib/interface/alamat.interface";
import { getProfilPembeli } from "@/lib/api/pembeli.api";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { createTransaksi } from "@/lib/api/transaksi.api";

interface CheckoutPageProps {
  keranjangItemsInitial?: Keranjang[];
}

const fetcherPembeli = async (token: string): Promise<Pembeli> => {
  return getProfilPembeli(token);
};

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  keranjangItemsInitial = [],
}) => {
  const router = useRouter();
  const [keranjangItems, setKeranjangItems] = useState<Keranjang[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<"DIAMBIL" | "DIKIRIM">(
    "DIAMBIL"
  );
  const [pointsToUse, setPointsToUse] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentUser = useUser();
  const token = currentUser?.token || null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const itemsFromStorageString = localStorage.getItem("checkoutItems");
    let loadedItems: Keranjang[] = [];

    if (itemsFromStorageString) {
      try {
        const parsedItems = JSON.parse(itemsFromStorageString);
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          loadedItems = parsedItems;
        } else {
          toast.error("Item checkout di penyimpanan tidak valid atau kosong.");
        }
      } catch {
        toast.error("Gagal memuat data keranjang dari penyimpanan.");
      }
    }

    if (loadedItems.length > 0) {
      setKeranjangItems(loadedItems);
    } else if (keranjangItemsInitial && keranjangItemsInitial.length > 0) {
      setKeranjangItems(keranjangItemsInitial);
      toast.error("Memuat item keranjang dari data awal (props).");
    } else {
      toast.error(
        "Tidak ada item untuk di-checkout. Silakan pilih dari keranjang."
      );
      router.push("/cart");
    }
  }, [isClient, router, keranjangItemsInitial, currentUser, token]);

  const {
    data: pembeli,
    error: pembeliError,
    isLoading: isLoadingPembeli,
  } = useSWR(token ? token : null, fetcherPembeli, {
    revalidateOnFocus: false,
  });

  const primaryAddress = pembeli?.alamat?.find((a: Alamat) => a.status_default);
  const idPrimaryAddress = primaryAddress?.id_alamat;

  const formattedPrimaryAddress = primaryAddress
    ? `${primaryAddress.nama_alamat} - ${primaryAddress.detail_alamat}`
    : null;

  const calculatePointsEarned = (price: number): number =>
    Math.floor(price / 10000);

  const totalPrice = keranjangItems.reduce(
    (sum, item) => sum + item.harga_barang,
    0
  );

  const totalPointsEarned = keranjangItems.reduce(
    (sum, item) => sum + calculatePointsEarned(item.harga_barang),
    0
  );

  const shippingCost =
    deliveryMethod === "DIKIRIM" && totalPrice < 1500000 ? 100000 : 0;

  const bonusPoints =
    totalPrice > 500000 ? Math.floor(totalPointsEarned * 0.2) : 0;
  const finalPointsEarned = totalPointsEarned + bonusPoints;

  const maxPointsToUse = Math.min(
    pembeli?.poin_loyalitas || 0,
    Math.floor(totalPrice / 100)
  );

  const pointsDeduction = pointsToUse * 100;
  const finalTotal = totalPrice + shippingCost - pointsDeduction;
  const remainingPoints = (pembeli?.poin_loyalitas || 0) - pointsToUse;

  const handleCheckout = async () => {
    if (deliveryMethod === "DIKIRIM" && !primaryAddress) {
      toast.error("Harus ada alamat utama untuk melanjutkan pengiriman!");
      return;
    }
    if (!pembeli) {
      toast.error("Data pengguna tidak dimuat. Silakan tunggu atau coba lagi.");
      return;
    }
    if (keranjangItems.length === 0) {
      toast.error("Keranjang belanja Anda kosong.");
      return;
    }

    const dataCreate = {
      id_barang: keranjangItems.map((item) => item.id_barang),
      id_alamat: idPrimaryAddress ? idPrimaryAddress : null,
      metode_pengiriman: deliveryMethod,
      potongan_poin: pointsToUse,
    };

    const formDataToSend = new FormData();

    formDataToSend.append("dataTransaksi", JSON.stringify(dataCreate));

    try {
      const res = await createTransaksi(formDataToSend, token || "");
      if (!res.errors) {
        localStorage.removeItem("checkoutItems");
        localStorage.setItem("idTransaksi", res.data);
        toast.success(
          "Pesanan sedang diproses! Silahkan lanjutkan ke Pembayaran"
        );
        router.push("/pembayaran");
      } else {
        toast.error(res.errors || "Gagal membuat transaksi");
      }
    } catch {
      toast.error("Internal server error");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    sessionStorage.setItem("finalPointsEarned", finalPointsEarned.toString());
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmCheckout = () => {
    setIsModalOpen(false);
    handleCheckout();
  };

  if (!isClient || !token) {
    return (
      <div className="w-full p-4 bg-gray-100 min-h-screen pt-16 mt-10 px-10 flex justify-center items-center">
        <p>Menunggu sesi pengguna...</p>
      </div>
    );
  }

  if (isLoadingPembeli && !pembeli && token) {
    return (
      <div className="w-full p-4 bg-gray-100 min-h-screen pt-16 mt-10 px-10 flex justify-center items-center">
        <p>Memuat data checkout...</p>
      </div>
    );
  }

  if (pembeliError && !pembeli) {
    return (
      <div className="w-full p-4 bg-gray-100 min-h-screen pt-16 mt-10 px-10 flex flex-col justify-center items-center">
        <p className="text-red-500">Gagal memuat data pengguna.</p>
        <button
          onClick={() => router.refresh()}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  if (token && !pembeli && !isLoadingPembeli) {
    return (
      <div className="w-full p-4 bg-gray-100 min-h-screen pt-16 mt-10 px-10 flex justify-center items-center">
        <p>Data pengguna tidak dapat dimuat. Pastikan Anda sudah login.</p>
      </div>
    );
  }

  if (keranjangItems.length === 0 && isClient) {
    return (
      <div className="w-full p-4 bg-gray-100 min-h-screen pt-16 mt-10 px-10 flex flex-col justify-center items-center">
        <p className="text-gray-700">
          Tidak ada item yang dipilih untuk checkout.
        </p>
        <button
          onClick={() => router.push("/cart")}
          className="mt-4 bg-[#72C678] text-white py-2 px-4 rounded hover:bg-[#5da060]"
        >
          Kembali ke Keranjang
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-gray-100 min-h-screen pt-16 mt-10 px-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row lg:space-x-6">
        <div className="flex-1 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Alamat Pengiriman</h2>
            {deliveryMethod === "DIKIRIM" ? (
              primaryAddress ? (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      {formattedPrimaryAddress}
                    </p>
                  </div>
                  <Link
                    href={"/daftar-alamat"}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    Ganti
                  </Link>
                </div>
              ) : (
                <div className="text-sm text-yellow-600">
                  <p>Belum ada alamat utama yang dipilih.</p>
                  <Link
                    href={"/daftar-alamat"}
                    className="text-blue-500 hover:underline"
                  >
                    Atur Alamat Utama
                  </Link>
                </div>
              )
            ) : (
              <p className="text-sm text-gray-600">
                Pesanan akan diambil di tempat.
              </p>
            )}

            <div className="flex space-x-4 mt-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="DIAMBIL"
                  checked={deliveryMethod === "DIAMBIL"}
                  onChange={() => setDeliveryMethod("DIAMBIL")}
                  className="form-radio accent-[#72C678]"
                />
                <span>Ambil di tempat</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="DIKIRIM"
                  checked={deliveryMethod === "DIKIRIM"}
                  onChange={() => setDeliveryMethod("DIKIRIM")}
                  className="form-radio accent-[#72C678]"
                />
                <span>Kirim ke alamat</span>
              </label>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Produk Dipesan ({keranjangItems.length})
            </h2>
            {keranjangItems.length > 0 ? (
              keranjangItems.map((item) => (
                <div
                  key={item.id_keranjang}
                  className="flex items-center space-x-4 mb-4"
                >
                  <Image
                    src={item.gambar_barang || "/placeholder-image.jpg"}
                    alt={item.nama_barang}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium line-clamp-2">
                      {item.nama_barang}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.kategori_barang}
                    </p>
                    <p className="text-lg font-semibold">
                      Rp{item.harga_barang.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Dapatkan {calculatePointsEarned(item.harga_barang)} poin
                    </p>
                    <p className="text-xs text-gray-400">
                      Penitip: {item.nama_penitip}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Tidak ada produk di keranjang.
              </p>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Metode Pembayaran</h2>
            <p className="text-sm">Transfer Bank ke Bank Reusemart</p>
            <p className="text-sm text-gray-600">
              Nomor Rekening: 1231238101 (Contoh)
            </p>
          </div>
        </div>

        <div className="lg:w-1/3 space-y-6 mt-6 lg:mt-0">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Gunakan Poin</h2>
            <p className="text-sm text-gray-600">
              Poin yang dimiliki: {pembeli?.poin_loyalitas || 0}
            </p>
            <input
              type="number"
              min="0"
              max={maxPointsToUse}
              value={pointsToUse}
              onChange={(e) => {
                const value = Number(e.target.value);
                setPointsToUse(Math.min(Math.max(0, value), maxPointsToUse));
              }}
              className="border rounded-lg p-2 w-full mt-2"
              placeholder="Masukkan jumlah poin"
              disabled={
                maxPointsToUse === 0 ||
                !pembeli?.poin_loyalitas ||
                pembeli.poin_loyalitas === 0
              }
            />
            {maxPointsToUse > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Maks. {maxPointsToUse} poin dapat digunakan. (1 poin = Rp100)
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Potongan: Rp{pointsDeduction.toLocaleString()} ({pointsToUse}{" "}
              poin)
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Estimasi Sisa Poin: {remainingPoints} poin
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Ringkasan Transaksi</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Harga ({keranjangItems.length} Barang)</span>
                <span>Rp{totalPrice.toLocaleString()}</span>
              </div>
              {deliveryMethod === "DIKIRIM" && (
                <div className="flex justify-between text-sm">
                  <span>Ongkos Kirim</span>
                  <span>Rp{shippingCost.toLocaleString()}</span>
                </div>
              )}
              {pointsToUse > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Potongan Poin ({pointsToUse} poin)</span>
                  <span>-Rp{pointsDeduction.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Estimasi Poin Didapat</span>
                <span className="text-green-600">
                  +{finalPointsEarned} poin
                </span>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between text-lg font-semibold mt-2">
                <span>Total Tagihan</span>
                <span>Rp{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            disabled={
              keranjangItems.length === 0 ||
              (deliveryMethod === "DIKIRIM" && !primaryAddress) ||
              isLoadingPembeli ||
              !pembeli
            }
            className="w-full bg-[#72C678] text-white py-3 rounded-lg font-semibold hover:bg-[#008E6D] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoadingPembeli ? "Memuat..." : "Bayar Sekarang"}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Konfirmasi Checkout</h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin melanjutkan checkout untuk{" "}
              {keranjangItems.length} barang dengan total tagihan Rp
              {finalTotal.toLocaleString()}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={confirmCheckout}
                className="bg-[#72C678] text-white py-2 px-4 rounded-lg hover:bg-[#008E6D]"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
