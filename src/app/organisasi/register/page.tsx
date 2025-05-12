"use client";

import { createOrganisasi } from "@/lib/api/organisasi.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import Navbar from "@/components/utama/navbar";
import { ThreeDot } from "react-loading-indicators";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    let isValid = true;
    setNamaOrganisasiError("");
    setEmailError("");
    setNomorTeleponError("");
    setDeskripsiError("");
    setAlamatError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!namaOrganisasi.trim()) {
      setNamaOrganisasiError("Nama organisasi harus diisi");
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("Email harus diisi");
      isValid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setEmailError("Format email tidak valid");
      isValid = false;
    }

    if (!nomorTelepon.trim()) {
      setNomorTeleponError("No. Handphone harus diisi");
      isValid = false;
    }

    if (!deskripsi.trim()) {
      setDeskripsiError("Deskripsi harus diisi");
      isValid = false;
    }

    if (!alamat.trim()) {
      setAlamatError("Alamat harus diisi");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password harus diisi");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password harus minimal 8 karakter");
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
      const res = await createOrganisasi(formData);

      if (res.data) {
        toast.success("Akun organisasi berhasil dibuat!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error("Akun gagal dibuat! " + res.errors);
      }
    } catch (error) {
      toast.error("Internal server error " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNamaOrganisasiChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNamaOrganisasi(e.target.value);
    if (e.target.value.trim()) {
      setNamaOrganisasiError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (
      e.target.value.trim() &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.target.value)
    ) {
      setEmailError("");
    }
  };

  const handleNomorTeleponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomorTelepon(e.target.value);
    if (e.target.value.trim()) {
      setNomorTeleponError("");
    }
  };

  const handleDeskripsiChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDeskripsi(e.target.value);
    if (e.target.value.trim()) {
      setDeskripsiError("");
    }
  };

  const handleAlamatChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAlamat(e.target.value);
    if (e.target.value.trim()) {
      setAlamatError("");
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
    <div>
      <Toaster position="top-right" />
      <Navbar />
      <div className="overflow-x-hidden w-screen min-h-screen p-4 sm:p-10 flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="border-1 border-gray-300 rounded-lg w-full sm:w-3/4 md:w-1/2 p-6 sm:p-10 bg-white"
        >
          <div className="text-3xl sm:text-5xl mb-3 font-bold">
            Registrasi Organisasi
          </div>
          <div className="my-3 text-sm sm:text-base">
            Ingin mendaftarkan sebagai pembeli?{" "}
            <Link
              href={"/pembeli/register"}
              className="text-[#1980e6]/80 underline hover:text-[#1980e6]"
            >
              Daftar disini!
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:justify-center md:gap-15">
            <div className="flex flex-col items-start w-full">
              <div className="my-3 w-full">
                <div className="mb-1">Nama Organisasi</div>
                <input
                  type="text"
                  name="nama_organisasi"
                  value={namaOrganisasi}
                  onChange={handleNamaOrganisasiChange}
                  className={`border-1 rounded-sm h-10 w-full px-2 ${
                    namaOrganisasiError ? "border-red-500" : "border-gray-400"
                  }`}
                />
                {namaOrganisasiError && (
                  <div className="text-red-500 text-sm mt-1">
                    {namaOrganisasiError}
                  </div>
                )}
              </div>
              <div className="my-3 w-full">
                <div className="mb-1">Email</div>
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`border-1 rounded-sm h-10 w-full px-2 ${
                    emailError ? "border-red-500" : "border-gray-400"
                  }`}
                />
                {emailError && (
                  <div className="text-red-500 text-sm mt-1">{emailError}</div>
                )}
              </div>
              <div className="my-3 w-full">
                <div className="mb-1">No. Handphone</div>
                <input
                  type="text"
                  name="nomor_telepon"
                  value={nomorTelepon}
                  onChange={handleNomorTeleponChange}
                  className={`border-1 rounded-sm h-10 w-full px-2 ${
                    nomorTeleponError ? "border-red-500" : "border-gray-400"
                  }`}
                />
                {nomorTeleponError && (
                  <div className="text-red-500 text-sm mt-1">
                    {nomorTeleponError}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start w-full">
              <div className="my-3 w-full">
                <div className="mb-1">Deskripsi</div>
                <textarea
                  name="deskripsi"
                  value={deskripsi}
                  onChange={handleDeskripsiChange}
                  className={`border-1 rounded-sm w-full px-2 py-2 ${
                    deskripsiError ? "border-red-500" : "border-gray-400"
                  }`}
                  rows={4}
                />
                {deskripsiError && (
                  <div className="text-red-500 text-sm mt-1">
                    {deskripsiError}
                  </div>
                )}
              </div>
              <div className="my-3 w-full">
                <div className="mb-1">Alamat</div>
                <textarea
                  name="alamat"
                  value={alamat}
                  onChange={handleAlamatChange}
                  className={`border-1 rounded-sm w-full px-2 py-2 ${
                    alamatError ? "border-red-500" : "border-gray-400"
                  }`}
                  rows={4}
                />
                {alamatError && (
                  <div className="text-red-500 text-sm mt-1">{alamatError}</div>
                )}
              </div>
              <div className="my-3 w-full">
                <div className="mb-1">Password</div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`border-1 rounded-sm h-10 w-full px-2 ${
                      passwordError ? "border-red-500" : "border-gray-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {passwordError && (
                  <div className="text-red-500 text-sm mt-1">
                    {passwordError}
                  </div>
                )}
              </div>
              <div className="my-3 w-full">
                <div className="mb-1">Konfirmasi Password</div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`border-1 rounded-sm h-10 w-full px-2 ${
                      confirmPasswordError
                        ? "border-red-500"
                        : "border-gray-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {confirmPasswordError && (
                  <div className="text-red-500 text-sm mt-1">
                    {confirmPasswordError}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="my-3 rounded-[0.5rem] py-2 px-8 bg-[#1980e6] text-white hover:bg-white hover:text-[#1980e6] border-1 hover:border-[#1980e6] transition-colors"
              >
                {isLoading ? (
                  <ThreeDot
                    color="#ffffff"
                    size="small"
                    text=""
                    textColor=""
                    style={{ fontSize: "7px" }}
                  />
                ) : (
                  "Registrasi"
                )}
              </button>
              <div className="my-3 text-sm sm:text-base">
                <Link
                  href={"/login"}
                  className="text-[#1980e6]/80 underline hover:text-[#1980e6]"
                >
                  Saya sudah punya akun organisasi
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
