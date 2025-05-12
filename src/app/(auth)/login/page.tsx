"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setToken, verifyToken } from "@/lib/auth/auth";
import { removeToken } from "@/lib/auth/auth";
import { BASE_URL, API_LOGIN_PEMBELI } from "@/lib/env";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const loginResponse = await fetch(BASE_URL + API_LOGIN_PEMBELI, {
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

      const verifyResponse = await fetch("/api/auth/verify/pembeli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok && verifyData.valid) {
        // Simpan token jika valid
        setToken(token);
        router.push("/");
        console.log("Login successful, token:", token);
      } else {
        setError(verifyData.error || "Invalid user role or token");
        removeToken(); // Hapus token jika tidak valid
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="overflow-x-hidden w-screen h-screen p-10 place-items-center place-content-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start border-1 border-gray-300 rounded-lg w-1/3 p-10 bg-white"
        >
          <div className="text-5xl mb-3 font-bold">Log in</div>
          <div className="my-3">
            Belum mempunyai akun?{" "}
            <Link
              href={"/pages/register-pembeli"}
              className="text-[#1980e6]/80 underline hover:text-[#1980e6]"
            >
              Daftar disini!
            </Link>
          </div>
          {/* <div className="my-3 w-full">
                <div className="mb-1">Email</div>
                <input type="text" className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"/>
            </div>
            <div className="my-3 w-full">
                <div className="mb-1">Password</div>
                <input type="password" className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"/>
            </div>
            <button type="submit" className="my-3 rounded-[0.5rem] py-2 px-8 bg-[#1980e6] text-white hover:bg-white hover:text-[#1980e6] border-1 hover:border-[#1980e6] transition-colors">Log in</button>
            <div className="my-3">
                <Link href={"#"} className="text-[#1980e6]/80 underline hover:text-[#1980e6]">Forgot Password</Link>
            </div> */}
          <div className="my-3 w-full">
            <div className="mb-1">Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"
              required
            />
          </div>
          <div className="my-3 w-full">
            <div className="mb-1">Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"
              required
            />
          </div>
          <button
            type="submit"
            className="my-3 rounded-[0.5rem] py-2 px-8 bg-[#1980e6] text-white hover:bg-white hover:text-[#1980e6] border-1 hover:border-[#1980e6] transition-colors"
          >
            Log in
          </button>
          <div className="my-3">
            <Link
              href="#"
              className="text-[#1980e6]/80 underline hover:text-[#1980e6]"
            >
              Forgot Password
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
