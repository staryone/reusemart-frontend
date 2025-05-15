"use client";

// import Navbar from "@/components/penitip/navbar";
import Sidebar from "@/components/penitip/sidebar";

export default function TransaksiPenitip() {
  return (
    <div className="min-h-screen flex bg-gray-100 px-4 sm:px-6 lg:px-8 pt-24 pb-10">
      <Sidebar />
      <div className="flex-1 ml-64">
        <h2 className="text-xl font-bold mb-4">Daftar Transaksi</h2>
        <div className="flex gap-5 items-start border rounded-xl p-4 mb-4 bg-white shadow-sm">
          {/* Kiri: Tanggal dan info */}
          <div className="w-2/12">
            <img src="/product.png" alt="gambar produk" />
          </div>

          {/* Tengah: Produk info */}
          <div className="w-full">
            <div className="flex flex-col gap-3">
              <p className="font-semibold text-xl line-clamp-2">
                Pesawat Second
              </p>
              <hr className="w-full" />
              <p className="text-sm text-gray-600">
                Rp99.999
                <span className="font-normal text-xs"></span>
              </p>

              <p className="text-sm">
                Tanggal masuk:{" "}
                <span className="text-[#72C678] font-semibold">15-05-2025</span>
              </p>
              <p className="text-sm">
                Batas penitipan:{" "}
                <span className="text-[#72C678] font-semibold">15-06-2025</span>
              </p>
              <div className="flex justify-between">
                <p className="text-md">
                  Sisa waktu:{" "}
                  <span className="text-[#e80505] font-semibold">3</span> hari
                </p>
                <button className="bg-[#72C678] text-white px-4 py-2 rounded-lg hover:bg-[#008E6D]">
                  Perpanjang Masa Penitipan
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-5 items-start border rounded-xl p-4 mb-4 bg-white shadow-sm">
          {/* Kiri: Tanggal dan info */}
          <div className="w-2/12">
            <img src="/product.png" alt="gambar produk" />
          </div>

          {/* Tengah: Produk info */}
          <div className="w-full">
            <div className="flex flex-col gap-3">
              <p className="font-semibold text-xl line-clamp-2">
                Pesawat Second
              </p>
              <hr className="w-full" />
              <p className="text-sm text-gray-600">
                Rp99.999
                <span className="font-normal text-xs"></span>
              </p>

              <p className="text-sm">
                Tanggal masuk:{" "}
                <span className="text-[#72C678] font-semibold">15-05-2025</span>
              </p>
              <p className="text-sm">
                Batas penitipan:{" "}
                <span className="text-[#72C678] font-semibold">15-06-2025</span>
              </p>
              <p className="text-md">
                Sisa waktu:{" "}
                <span className="text-[#72C678] font-semibold">6</span> hari
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
