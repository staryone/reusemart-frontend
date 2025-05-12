"use client";

import SideBar from "@/components/cs/sidebar";

import Link from "next/link";


export default function Diskusi() {
  return (
    <div className="flex bg-gray-100 h-screen">
      <SideBar />
      <div className="flex-1 p-4 ml-64">
        <h1 className="text-4xl font-bold mt-12 mb-4">Diskusi Pending</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-lg font-semibold text-gray-800">
              Laptop geming
            </div>
            <div className="text-gray-600 mt-1">
              Pesan: Apakah produk support bla?
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Diajukan oleh: John
            </div>
            <div className="text-gray-500 text-sm">Waktu: 10-10-1010</div>
            <Link
              href={`/`}
              className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Balas Sekarang
            </Link>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-lg font-semibold text-gray-800">
              Laptop geming
            </div>
            <div className="text-gray-600 mt-1">
              Pesan: Apakah produk support bla?
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Diajukan oleh: John
            </div>
            <div className="text-gray-500 text-sm">Waktu: 10-10-1010</div>
            <Link
              href={`/`}
              className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Balas Sekarang
            </Link>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-lg font-semibold text-gray-800">
              Laptop geming
            </div>
            <div className="text-gray-600 mt-1">
              Pesan: Apakah produk support bla?
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Diajukan oleh: John
            </div>
            <div className="text-gray-500 text-sm">Waktu: 10-10-1010</div>
            <Link
              href={`/`}
              className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Balas Sekarang
            </Link>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-lg font-semibold text-gray-800">
              Laptop geming
            </div>
            <div className="text-gray-600 mt-1">
              Pesan: Apakah produk support bla?
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Diajukan oleh: John
            </div>
            <div className="text-gray-500 text-sm">Waktu: 10-10-1010</div>
            <Link
              href={`/`}
              className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Balas Sekarang
            </Link>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-lg font-semibold text-gray-800">
              Laptop geming
            </div>
            <div className="text-gray-600 mt-1">
              Pesan: Apakah produk support bla?
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Diajukan oleh: John
            </div>
            <div className="text-gray-500 text-sm">Waktu: 10-10-1010</div>
            <Link
              href={`/`}
              className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Balas Sekarang
            </Link>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-lg font-semibold text-gray-800">
              Laptop geming
            </div>
            <div className="text-gray-600 mt-1">
              Pesan: Apakah produk support bla?
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Diajukan oleh: John
            </div>
            <div className="text-gray-500 text-sm">Waktu: 10-10-1010</div>
            <Link
              href={`/`}
              className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Balas Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
