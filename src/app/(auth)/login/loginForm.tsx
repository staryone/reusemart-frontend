"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email harus diisi");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password harus diisi");
      isValid = false;
    }

    return isValid;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Internal server error");
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.trim()) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value) {
      setPasswordError("");
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
            className="flex flex-col items-start border border-gray-300 rounded-lg w-full max-w-md p-10 bg-white"
          >
            <div className="text-5xl mb-3 font-bold">Login</div>
            <div className="my-3">
              Belum punya akun?{" "}
              <Link
                href={"/register"}
                className="text-[#72C678] hover:text-[#008E6D] font-semibold"
              >
                Daftar disini!
              </Link>
            </div>
            <div className="my-4 w-full">
              <label className="block mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full h-11 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                  emailError ? "border-red-700" : "border-gray-500"
                }`}
              />
              {emailError && (
                <div className="text-red-500 text-sm mt-1">{emailError}</div>
              )}
            </div>
            <div className="my-4 w-full">
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
                <div className="text-red-500 text-sm mt-1">{passwordError}</div>
              )}
            </div>
            <div className="w-full text-right text-sm font-medium">
              <Link
                href="/forgot-password"
                className="text-[#72C678] hover:text-[#008E6D] font-medium text-right"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="my-5 py-2 px-8 rounded-[0.5rem] bg-[#72C678] text-white font-semibold hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300 w-full"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
