"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaCartShopping } from "react-icons/fa6";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("token");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch("http://localhost:3001/api/penitip/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsLoggedIn(false);
        window.location.href = "/";
      } else {
        console.error("Gagal logout dari server");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { label: "Produk", path: "/" },
    { label: "Transaksi", path: "/" },
    isLoggedIn
      ? { label: "Profil", path: "/penitip/profil" }
      : { label: "Login", path: "/penitip/login" },
    ...(isLoggedIn
      ? [{ label: "Logout", onClick: () => setShowLogoutModal(true) }]
      : []),
  ];

  return (
    <>
      <nav className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-10">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={1000}
              height={258}
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Search */}
          <div className="flex gap-3">
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
          </div>
          <ul className="space-x-2 hidden md:flex">
            {navLinks.map(({ label, path, onClick }) => (
              <li key={label}>
                <Link
                  href={path || "#"}
                  onClick={onClick}
                  className="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

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
              {navLinks.map(({ label, path, onClick }) => (
                <li key={label}>
                  <Link
                    href={path || "#"}
                    onClick={onClick}
                    className="block px-3 py-2 text-gray-700 rounded hover:bg-gray-100"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="bg-white p-6 rounded-xl shadow-2xl w-80 z-10 transition-all duration-300 transform">
            <h2 className="text-lg font-semibold mb-4 text-[#008E6D]">
              Konfirmasi Logout
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Apakah Anda yakin ingin logout?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#72C678] text-white rounded hover:bg-[#008E6D]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
