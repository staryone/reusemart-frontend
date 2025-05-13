"use client";

import { createPembeli } from "@/lib/api/pembeli.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import Image from "next/image";

export default function Register() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [namaError, setNamaError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nomorTeleponError, setNomorTeleponError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    setNamaError("");
    setEmailError("");
    setNomorTeleponError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!nama.trim()) {
      setNamaError("Nama harus diisi");
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("Email harus diisi");
      isValid = false;
    }

    if (!nomorTelepon.trim()) {
      setNomorTeleponError("Nomor Telepon harus diisi");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password harus diisi");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password setidaknya harus mengandung 8 karakter");
      isValid = false;
    }

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
      const res = await createPembeli(formData);

      if (res.data) {
        toast.success("Akun berhasil dibuat!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error("Akun gagal dibuat!  " + res.errors);
      }
    } catch (error) {
      toast.error("Internal server error " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNama(e.target.value);
    if (e.target.value.trim()) {
      setNamaError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.trim()) {
      setEmailError("");
    }
  };

  const handleNomorTeleponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomorTelepon(e.target.value);
    if (e.target.value.trim()) {
      setNomorTeleponError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length >= 8) {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (e.target.value === password) {
      setConfirmPasswordError("");
    }
  };

  return (
    <div className="overflow-x-hidden w-screen h-screen p-10 bg-gray-100">
      <div className="flex flex-col h-full">
        <div className="mb-5 flex justify-center">
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
            className="flex flex-col items-start border border-gray-300 rounded-lg w-full max-w-4xl p-10 bg-white"
          >
            <div className="text-5xl mb-3 font-bold">Register</div>
            <div className="my-3">
              Sudah punya akun ReuseMart?{" "}
              <Link
                href={"/login"}
                className="text-[#72C678] hover:text-[#008E6D] font-semibold"
              >
                Login
              </Link>
            </div>
            <div className="flex flex-col md:flex-row md:gap-10 w-full">
              {/* Kolom Kiri */}
              <div className="flex flex-col items-start w-full">
                <div className="my-3 w-full">
                  <label className="block mb-1 text-gray-700">Nama</label>
                  <input
                    type="text"
                    name="nama"
                    value={nama}
                    onChange={handleNamaChange}
                    className={`w-full h-11 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                      namaError ? "border-red-700" : "border-gray-500"
                    }`}
                  />
                  {namaError && (
                    <div className="text-red-500 text-sm mt-1">{namaError}</div>
                  )}
                </div>
                <div className="my-3 w-full">
                  <label className="block mb-1 text-gray-700">Email</label>
                  <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full h-11 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                      emailError ? "border-red-700" : "border-gray-500"
                    }`}
                  />
                  {emailError && (
                    <div className="text-red-500 text-sm mt-1">
                      {emailError}
                    </div>
                  )}
                </div>
                <div className="my-3 w-full">
                  <label className="block mb-1 text-gray-700">Telepon</label>
                  <input
                    type="text"
                    name="nomor_telepon"
                    value={nomorTelepon}
                    onChange={handleNomorTeleponChange}
                    className={`w-full h-11 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                      nomorTeleponError ? "border-red-700" : "border-gray-500"
                    }`}
                  />
                  {nomorTeleponError && (
                    <div className="text-red-500 text-sm mt-1">
                      {nomorTeleponError}
                    </div>
                  )}
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="flex flex-col items-start w-full">
                <div className="my-3 w-full">
                  <label className="block mb-1 text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`w-full h-11 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                      passwordError ? "border-red-700" : "border-gray-500"
                    }`}
                  />
                  {passwordError && (
                    <div className="text-red-500 text-sm mt-1">
                      {passwordError}
                    </div>
                  )}
                </div>
                <div className="my-3 w-full">
                  <label className="block mb-1 text-gray-700">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`w-full h-11 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                      confirmPasswordError
                        ? "border-red-700"
                        : "border-gray-500"
                    }`}
                  />
                  {confirmPasswordError && (
                    <div className="text-red-500 text-sm mt-1">
                      {confirmPasswordError}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="my-5 py-2 px-8 rounded-[0.5rem] bg-[#72C678] text-white font-semibold hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300 w-full"
            >
              Register
            </button>
            <div className="mt-3 w-full text-center">
              <Link
                href={"/organisasi/register"}
                className="text-[#72C678] hover:text-[#008E6D]"
              >
                <span className="font-medium">Daftar sebagai </span>
                <span className="font-semibold">Organisasi</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
