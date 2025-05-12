"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setToken } from "@/lib/auth/auth";
import { removeToken } from "@/lib/auth/auth";
import { API_LOGIN_PENITIP, BASE_URL } from "@/lib/env";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const loginResponse = await fetch(BASE_URL + API_LOGIN_PENITIP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        const data = await loginResponse.json();
        setError(data.error || "Login failed");
        return;
      }

      const loginData = await loginResponse.json();
      const token = loginData.data.token;

      const verifyResponse = await fetch("/api/auth/verify/penitip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok && verifyData.valid) {
        setToken(token);
        router.push("/penitip/profil");
      } else {
        setError(verifyData.error || "Invalid user role or token");
        removeToken();
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="overflow-x-hidden w-screen h-screen p-10 place-items-center place-content-center bg-gray-100">
        <Link
          href="/"
          className="flex items-center justify-center space-x-3 mb-5"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={1000}
            height={258}
            className="h-12 w-auto"
          />
        </Link>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start border-1 border-gray-300 rounded-lg w-1/3 p-10 bg-white"
        >
          <div className="text-5xl mb-3 font-bold">Login</div>
          {/* <div className="my-3">
            Belum mempunyai akun?{" "}
            <Link
              href={"/organisasi/register"}
              className="text-[#72C678] hover:text-[#008E6D] font-semibold"
            >
              Daftar disini!
            </Link>
          </div> */}
          <div className="my-4 w-full">
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200"
              required
            />
          </div>
          <div className="my-4 w-full">
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200"
              required
            />
          </div>
          <div className="w-full text-right text-sm font-medium">
            <Link
              href="#"
              className="text-[#72C678] hover:text-[#008E6D] font-medium text-right"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="my-1 py-2 px-8 rounded-[0.5rem] bg-[#72C678] text-white font-semibold hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300"
          >
            Log in
          </button>
          {/* <div className="mt-5 w-full text-center">
            <Link
              href={"/login"}
              className="text-[#72C678] hover:text-[#008E6D]"
            >
              <span className="font-medium">Masuk sebagai </span>
              <span className="font-semibold">Pembeli</span>
            </Link>
          </div> */}
        </form>
      </div>
    </div>
  );
}
