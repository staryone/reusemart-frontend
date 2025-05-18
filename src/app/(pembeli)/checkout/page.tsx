"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";

interface CartItem {
  id: number;
  name: string;
  image: string;
  category: string;
  price: number;
}

interface User {
  primaryAddress: string | null;
  points: number;
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">(
    "pickup"
  );
  const [pointsToUse, setPointsToUse] = useState<number>(0);

  // Mock user data and cart items
  const user: User = {
    primaryAddress:
      "Rumah - Stansylaus Hary Muntoro, Pecel Lele Mboke Laras, Jl. Kemusuk Lor, Kec. Sedayu, Bantul, Jogja, 55752",
    points: 150,
  };

  const cartItems: CartItem[] = [
    {
      id: 1,
      name: "Kentunk Keripik Kentang Serut 500 Gram cemilan keluarga",
      image: "/placeholder-image.jpg",
      category: "Pedas DaunJeruk",
      price: 74000,
    },
    {
      id: 2,
      name: "Keripik Bayam 250 Gram",
      image: "/placeholder-image.jpg",
      category: "Original",
      price: 35000,
    },
  ];

  // Calculate points earned per item (1 point per 10,000 IDR)
  const calculatePointsEarned = (price: number): number =>
    Math.floor(price / 10000);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const totalPointsEarned = cartItems.reduce(
    (sum, item) => sum + calculatePointsEarned(item.price),
    0
  );
  const shippingCost = deliveryMethod === "delivery" ? 100000 : 0;

  // Bonus points: 20% extra if total purchase > 500,000 IDR
  const bonusPoints =
    totalPrice > 500000 ? Math.floor(totalPointsEarned * 0.2) : 0;
  const finalPointsEarned = totalPointsEarned + bonusPoints;

  // Points deduction (100 points = 10,000 IDR)
  const maxPointsToUse = Math.min(user.points, Math.floor(totalPrice / 100));
  const pointsDeduction = pointsToUse * 100;
  const finalTotal = totalPrice + shippingCost - pointsDeduction;

  const handleCheckout = () => {
    if (deliveryMethod === "delivery" && !user.primaryAddress) {
      toast.error("Harus ada alamat utama untuk melanjutkan pengiriman!");
      return;
    }
    router.push("/payment-confirmation");
  };

  return (
    <div className="w-full p-4 bg-gray-100 min-h-screen pt-16 mt-10 px-10">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Desktop: Two-column layout, Mobile: Single-column */}
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Left Column: Delivery Method, Cart Items, Payment Method */}
        <div className="flex-1 space-y-6">
          {/* Delivery Method and Address */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Alamat Pengiriman</h2>
            {deliveryMethod === "delivery" && user.primaryAddress ? (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{user.primaryAddress}</p>
                </div>
                <button className="text-blue-500 text-sm">Ganti</button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Pilih metode pengiriman</p>
            )}

            <div className="flex space-x-4 mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  checked={deliveryMethod === "pickup"}
                  onChange={() => setDeliveryMethod("pickup")}
                  className="form-radio text-blue-500"
                />
                <span>Ambil di tempat</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="delivery"
                  checked={deliveryMethod === "delivery"}
                  onChange={() => setDeliveryMethod("delivery")}
                  className="form-radio text-blue-500"
                />
                <span>Kirim ke alamat</span>
              </label>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Produk</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 mb-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-lg font-semibold">
                    Rp{item.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Dapatkan {calculatePointsEarned(item.price)} poin
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Metode Pembayaran</h2>
            <p className="text-sm">Transfer Bank ke Bank Reusemart</p>
            <p className="text-sm text-gray-600">Nomor Rekening: 1231238101</p>
          </div>
        </div>

        {/* Right Column: Points Deduction, Transaction Summary */}
        <div className="lg:w-1/3 space-y-6 mt-6 lg:mt-0">
          {/* Points Deduction */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Gunakan Poin</h2>
            <p className="text-sm text-gray-600">
              Poin yang dimiliki: {user.points}
            </p>
            <input
              type="number"
              min="0"
              max={maxPointsToUse}
              value={pointsToUse}
              onChange={(e) =>
                setPointsToUse(Math.min(Number(e.target.value), maxPointsToUse))
              }
              className="border rounded-lg p-2 w-full mt-2"
              placeholder="Masukkan jumlah poin"
            />
            <p className="text-sm text-gray-600 mt-2">
              Potongan: Rp{(pointsToUse * 100).toLocaleString()} ({pointsToUse}{" "}
              poin)
            </p>
          </div>

          {/* Transaction Summary */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Ringkasan Transaksi</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Harga ({cartItems.length} Barang)</span>
                <span>Rp{totalPrice.toLocaleString()}</span>
              </div>
              {deliveryMethod === "delivery" && (
                <div className="flex justify-between text-sm">
                  <span>Ongkos Kirim</span>
                  <span>Rp{shippingCost.toLocaleString()}</span>
                </div>
              )}
              {pointsToUse > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Potongan Poin ({pointsToUse} poin)</span>
                  <span>-Rp{pointsDeduction.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Jumlah Dapat Poin</span>
                <span>{finalPointsEarned} poin</span>
              </div>
              <div className="flex justify-between text-lg font-semibold mt-4">
                <span>Total Tagihan</span>
                <span>Rp{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            className="w-full bg-[#72C678] text-white py-3 rounded-lg font-semibold hover:bg-[#008E6D]"
          >
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
