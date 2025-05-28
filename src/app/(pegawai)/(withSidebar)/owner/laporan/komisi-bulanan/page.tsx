"use client";

import { useState } from "react";

export default function CommissionReport() {
  const [data] = useState([
    { 
      code: "K201", 
      name: "Kompor Tanam 3 tungku", 
      price: 2000000, 
      entryDate: "5/1/2025", 
      saleDate: "7/1/2025", 
      hunterCommission: 100000, 
      reuseMartCommission: 260000, 
      bonus: 40000 
    },
    { 
      code: "R95", 
      name: "Rak Buku 5 tingkat", 
      price: 500000, 
      entryDate: "5/1/2025", 
      saleDate: "9/2/2025", 
      hunterCommission: 0, 
      reuseMartCommission: 137500, 
      bonus: 0 
    },
  ]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Laporan Komisi Bulanan</h1>
      <p className="mb-2">Bulan: Januari Tahun: 2025</p>
      <p className="mb-2">Tanggal cetak: 2 Februari 2025</p>
      <p className="mb-4">ReUse Mart, Jl. Green Eco Park No. 456 Yogyakarta</p>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Kode Produk</th>
            <th className="border border-gray-300 p-2">Nama Produk</th>
            <th className="border border-gray-300 p-2">Harga Jual</th>
            <th className="border border-gray-300 p-2">Tanggal Masuk</th>
            <th className="border border-gray-300 p-2">Tanggal Laku</th>
            <th className="border border-gray-300 p-2">Komisi Hunter</th>
            <th className="border border-gray-300 p-2">Komisi ReUseMart</th>
            <th className="border border-gray-300 p-2">Bonus Penjual</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="border border-gray-300 p-2">{item.code}</td>
              <td className="border border-gray-300 p-2">{item.name}</td>
              <td className="border border-gray-300 p-2">{item.price.toLocaleString()}</td>
              <td className="border border-gray-300 p-2">{item.entryDate}</td>
              <td className="border border-gray-300 p-2">{item.saleDate}</td>
              <td className="border border-gray-300 p-2">{item.hunterCommission.toLocaleString()}</td>
              <td className="border border-gray-300 p-2">{item.reuseMartCommission.toLocaleString()}</td>
              <td className="border border-gray-300 p-2">{item.bonus.toLocaleString()}</td>
            </tr>
          ))}
          <tr className="bg-gray-200">
            <td className="border border-gray-300 p-2" colSpan={2}>Total</td>
            <td className="border border-gray-300 p-2">{data.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2">{data.reduce((sum, item) => sum + item.hunterCommission, 0).toLocaleString()}</td>
            <td className="border border-gray-300 p-2">{data.reduce((sum, item) => sum + item.reuseMartCommission, 0).toLocaleString()}</td>
            <td className="border border-gray-300 p-2">{data.reduce((sum, item) => sum + item.bonus, 0).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

