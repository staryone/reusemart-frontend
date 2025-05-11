"use client";

import { checkValidTokenReset, resetPasswordUser } from "@/lib/api/user.api";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = usePathname().slice(16);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await checkValidTokenReset(token);
        if (res) {
          setIsLoading(false);
        }
      } catch (error) {
        router.push("/");
      }
    };

    checkToken();
  }, [token]);

  if (isLoading) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log(token);
    e.preventDefault();
    if (!token) {
      setMessage("Token tidak valid");
      setIsError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Password dan konfirmasi password tidak cocok");
      setIsError(true);
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      const response = await resetPasswordUser(formData, token);

      if (response.data) {
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat mereset password");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Password Baru
            </label>
            <input
              id="newPassword"
              type="password"
              name="new_password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan password baru"
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Konfirmasi Password Baru
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirm_new_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi password baru"
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          >
            Reset Password
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              isError ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
