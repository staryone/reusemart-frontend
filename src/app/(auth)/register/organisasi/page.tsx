"use client";

import { createOrganisasi } from "@/lib/api/organisasi.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import Image from "next/image";

export default function RegisterOrganisasi() {
  const router = useRouter();
  const [namaOrganisasi, setNamaOrganisasi] = useState("");
  const [email, setEmail] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [alamat, setAlamat] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [namaOrganisasiError, setNamaOrganisasiError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nomorTeleponError, setNomorTeleponError] = useState("");
  const [deskripsiError, setDeskripsiError] = useState("");
  const [alamatError, setAlamatError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    setNamaOrganisasiError("");
    setEmailError("");
    setNomorTeleponError("");
    setDeskripsiError("");
    setAlamatError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Nama Organisasi
    if (!namaOrganisasi.trim()) {
      setNamaOrganisasiError("Nama organisasi harus diisi");
      isValid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email harus diisi");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Email tidak valid");
      isValid = false;
    }

    // Nomor Telepon
    const phoneRegex = /^\d{10,15}$/;
    if (!nomorTelepon.trim()) {
      setNomorTeleponError("Nomor telepon harus diisi");
      isValid = false;
    } else if (!phoneRegex.test(nomorTelepon)) {
      setNomorTeleponError("Nomor telepon tidak valid (10-15 digit)");
      isValid = false;
    }

    // Deskripsi
    if (!deskripsi.trim()) {
      setDeskripsiError("Deskripsi harus diisi");
      isValid = false;
    }

    // Alamat
    if (!alamat.trim()) {
      setAlamatError("Alamat harus diisi");
      isValid = false;
    }

    // Password
    if (!password) {
      setPasswordError("Password harus diisi");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password setidaknya harus 8 karakter");
      isValid = false;
    }

    // Confirm Password
    if (!confirmPassword) {
      setConfirmPasswordError("Konfirmasi password harus diisi");
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Konfirmasi password tidak cocok");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createOrganisasi(formData);

      if (res.data) {
        toast.success("Akun organisasi berhasil dibuat!");
        setTimeout(() => {
          router.push("/organisasi/login");
        }, 2000);
      } else {
        toast.error("Akun gagal dibuat! " + res.errors);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNamaOrganisasiChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNamaOrganisasi(e.target.value);
    if (e.target.value.trim()) setNamaOrganisasiError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.trim()) setEmailError("");
  };

  const handleNomorTeleponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomorTelepon(e.target.value);
    if (e.target.value.trim()) setNomorTeleponError("");
  };

  const handleDeskripsiChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDeskripsi(e.target.value);
    if (e.target.value.trim()) setDeskripsiError("");
  };

  const handleAlamatChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAlamat(e.target.value);
    if (e.target.value.trim()) setAlamatError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length >= 8) setPasswordError("");
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (e.target.value === password) setConfirmPasswordError("");
  };

  return (
    <div className="overflow-x-hidden w-screen min-h-screen p-6 sm:p-10 bg-gray-100">
      <div className="flex flex-col h-full">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={1000}
              height={258}
              className="h-12 w-auto"
            />
          </Link>
        </div>

        <div className="flex-grow flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-start border border-gray-300 rounded-lg w-full max-w-4xl p-6 sm:p-10 bg-white shadow-md animate-fade-in"
          >
            <div className="text-3xl mb-4 font-bold text-center w-full text-gray-800">
              Register Organisasi
            </div>
            <div className="my-4 w-full text-center text-gray-600">
              Sudah punya akun Organisasi ReuseMart?{" "}
              <Link
                href="/organisasi/login"
                className="text-[#72C678] hover:text-[#008E6D] font-semibold transition-colors duration-200"
              >
                Login
              </Link>
            </div>
            <div className="flex flex-col md:flex-row md:gap-8 w-full">
              {/* Kolom Kiri */}
              <div className="flex flex-col items-start w-full">
                <div className="my-4 w-full">
                  <label className="block mb-1 text-gray-700 font-medium">
                    Nama Organisasi
                  </label>
                  <input
                    type="text"
                    name="nama_organisasi"
                    value={namaOrganisasi}
                    onChange={handleNamaOrganisasiChange}
                    className={`w-full h-12 px-4 py-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                      namaOrganisasiError
                        ? "border-red-700 animate-shake"
                        : "border-gray-500"
                    }`}
                    aria-describedby={
                      namaOrganisasiError ? "namaOrganisasiError" : undefined
                    }
                  />
                  {namaOrganisasiError && (
                    <div
                      id="namaOrganisasiError"
                      className="text-red-500 text-sm mt-1"
                    >
                      {namaOrganisasiError}
                    </div>
                  )}
                </div>
                <div className="my-4 w-full">
                  <label className="block mb-1 text-gray-700 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full h-12 px-4 py-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                      emailError
                        ? "border-red-700 animate-shake"
                        : "border-gray-500"
                    }`}
                    aria-describedby={emailError ? "emailError" : undefined}
                  />
                  {emailError && (
                    <div id="emailError" className="text-red-500 text-sm mt-1">
                      {emailError}
                    </div>
                  )}
                </div>
                <div className="my-4 w-full">
                  <label className="block mb-1 text-gray-700 font-medium">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    name="nomor_telepon"
                    value={nomorTelepon}
                    onChange={handleNomorTeleponChange}
                    className={`w-full h-12 px-4 py-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                      nomorTeleponError
                        ? "border-red-700 animate-shake"
                        : "border-gray-500"
                    }`}
                    aria-describedby={
                      nomorTeleponError ? "nomorTeleponError" : undefined
                    }
                  />
                  {nomorTeleponError && (
                    <div
                      id="nomorTeleponError"
                      className="text-red-500 text-sm mt-1"
                    >
                      {nomorTeleponError}
                    </div>
                  )}
                </div>
                <div className="my-4 w-full">
                  <label className="block mb-1 text-gray-700 font-medium">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={deskripsi}
                    onChange={handleDeskripsiChange}
                    className={`w-full h-24 px-4 py-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                      deskripsiError
                        ? "border-red-700 animate-shake"
                        : "border-gray-500"
                    }`}
                    rows={4}
                    aria-describedby={
                      deskripsiError ? "deskripsiError" : undefined
                    }
                  />
                  {deskripsiError && (
                    <div
                      id="deskripsiError"
                      className="text-red-500 text-sm mt-1"
                    >
                      {deskripsiError}
                    </div>
                  )}
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="flex flex-col items-start w-full">
                <div className="my-4 w-full">
                  <label className="block mb-1 text-gray-700 font-medium">
                    Alamat
                  </label>
                  <textarea
                    name="alamat"
                    value={alamat}
                    onChange={handleAlamatChange}
                    className={`w-full h-24 px-4 py-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                      alamatError
                        ? "border-red-700 animate-shake"
                        : "border-gray-500"
                    }`}
                    rows={4}
                    aria-describedby={alamatError ? "alamatError" : undefined}
                  />
                  {alamatError && (
                    <div id="alamatError" className="text-red-500 text-sm mt-1">
                      {alamatError}
                    </div>
                  )}
                </div>
                <div className="my-4 w-full">
                  <label className="block mb-1 text-gray-700 font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`w-full h-12 px-4 py-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                      passwordError
                        ? "border-red-700 animate-shake"
                        : "border-gray-500"
                    }`}
                    aria-describedby={
                      passwordError ? "passwordError" : undefined
                    }
                  />
                  {passwordError && (
                    <div
                      id="passwordError"
                      className="text-red-500 text-sm mt-1"
                    >
                      {passwordError}
                    </div>
                  )}
                </div>
                <div className="my-4 w-full">
                  <label className="block mb-1 text-gray-700 font-medium">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`w-full h-12 px-4 py-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                      confirmPasswordError
                        ? "border-red-700 animate-shake"
                        : "border-gray-500"
                    }`}
                    aria-describedby={
                      confirmPasswordError ? "confirmPasswordError" : undefined
                    }
                  />
                  {confirmPasswordError && (
                    <div
                      id="confirmPasswordError"
                      className="text-red-500 text-sm mt-1"
                    >
                      {confirmPasswordError}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className={`my-5 py-2 px-8 rounded-[0.5rem] bg-[#72C678] text-white font-semibold hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300 w-full flex items-center justify-center gap-2 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Mendaftar..." : "Register"}
            </button>
            <div className="mt-4 w-full text-center text-gray-600">
              <Link
                href="/register"
                className="text-[#72C678] hover:text-[#008E6D] transition-colors duration-200"
              >
                <span className="font-medium">Daftar sebagai </span>
                <span className="font-semibold">Pembeli</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-2px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(2px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
