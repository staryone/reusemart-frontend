"use client";

import { checkValidTokenReset, resetPasswordUser } from "@/lib/api/user.api";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/utama/navbar";
import toast, { Toaster } from "react-hot-toast";

export default function ResetPassword() {
  const router = useRouter();
  const token = usePathname().slice(16);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await checkValidTokenReset(token);
        if (res) {
          setIsLoading(false);
        }
      } catch (error) {
        toast.error("Token tidak valid atau kadaluarsa");
        router.push("/login");
      }
    };

    checkToken();
  }, [token, router]);

  const validateForm = () => {
    let isValid = true;
    setNewPasswordError("");
    setConfirmPasswordError("");

    if (!newPassword) {
      setNewPasswordError("Password baru harus diisi");
      isValid = false;
    } else if (newPassword.length < 8) {
      setNewPasswordError("Password setidaknya harus 8 karakter");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Konfirmasi password harus diisi");
      isValid = false;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError("Konfirmasi password tidak cocok");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!token) {
      toast.error("Token tidak valid");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await resetPasswordUser(formData, token);

      if (response.data) {
        toast.success("Password berhasil direset!");
        setTimeout(() => router.push("/login"), 5000);
      } else {
        toast.error("Gagal mereset password");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    if (e.target.value.length >= 8) {
      setNewPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (e.target.value === newPassword) {
      setConfirmPasswordError("");
    }
  };

  if (isLoading) return null;

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <div className="overflow-x-hidden w-screen min-h-screen p-4 sm:p-10 flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start border border-gray-300 rounded-lg w-full max-w-md p-8 bg-white shadow-md animate-fade-in"
        >
          <div className="text-3xl mb-4 font-bold text-center w-full text-gray-800">
            Reset Password
          </div>
          <div className="my-4 w-full">
            <label className="block mb-1 text-gray-700 font-medium">
              Password Baru
            </label>
            <input
              id="newPassword"
              type="password"
              name="new_password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              className={`w-full h-12 px-4 py-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                newPasswordError ? "border-red-700" : "border-gray-500"
              }`}
              placeholder="Masukkan password baru"
              required
            />
            {newPasswordError && (
              <div className="text-red-500 text-sm mt-1">
                {newPasswordError}
              </div>
            )}
          </div>
          <div className="my-4 w-full">
            <label className="block mb-1 text-gray-700 font-medium">
              Konfirmasi Password Baru
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirm_new_password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`w-full h-12 px-4 py-2 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                confirmPasswordError ? "border-red-700" : "border-gray-500"
              }`}
              placeholder="Konfirmasi password baru"
              required
            />
            {confirmPasswordError && (
              <div className="text-red-500 text-sm mt-1">
                {confirmPasswordError}
              </div>
            )}
          </div>
          <button
            type="submit"
            className={`my-4 py-2 px-8 rounded-[0.5rem] bg-[#72C678] text-white font-semibold hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300 w-full flex items-center justify-center gap-2 ${
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
            {isLoading ? "Mereset..." : "Reset Password"}
          </button>
        </form>
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
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
