"use client";
import { useState } from "react";
import Link from "next/link";
import { FaCartShopping } from "react-icons/fa6";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img src="/logo.svg" className="h-8" alt="Logo" />
            <span className="text-2xl font-semibold">ReUseMart</span>
          </Link>

          <ul className="space-x-2 hidden md:flex">
            {["Produk", "Transaksi", "Tentang", "Kontak", "Profil"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100"
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
          {/* Desktop Search */}
          <div className="hidden md:block relative w-80">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          </div>
          <Link
            href="#"
            className="hidden md:block px-3 py-2 text-gray-700 rounded hover:bg-gray-100 text-xl"
          >
            <FaCartShopping />
          </Link>

          {/* Toggle Button */}
          <button
            className="md:hidden p-2 text-gray-500 rounded hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
              {isOpen ? (
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden px-4 pb-4 space-y-4" id="mobile-menu">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
            </div>

            {/* Navigation Links */}
            <ul className="space-y-2">
              {[
                "Produk",
                "Transaksi",
                "Tentang",
                "Kontak",
                "Profil",
                "Keranjang",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}
