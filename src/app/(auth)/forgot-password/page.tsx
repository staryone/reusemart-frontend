"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { forgotPasswordUser } from "@/lib/api/user.api";
import Navbar from "@/components/utama/navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const response = await forgotPasswordUser(formData);

      if (response) {
        console.log("Success kirim email");
      } else {
        console.error("Failed to sent email reset password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="overflow-x-hidden w-screen min-h-screen p-4 sm:p-10 flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleForgotPassword}
          className="flex flex-col items-start border border-gray-300 rounded-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 p-6 sm:p-10 bg-white"
        >
          <div className="text-3xl sm:text-5xl mb-3 font-bold text-center w-full">
            Forgot Password
          </div>
          <div className="my-3 w-full">
            <div className="mb-1 text-sm sm:text-base">Email</div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-400 rounded-sm h-10 w-full px-2 text-sm sm:text-base"
              required
            />
          </div>
          <button
            type="submit"
            className="my-3 rounded-lg py-2 px-6 bg-[#1980e6] text-white hover:bg-white hover:text-[#1980e6] border border-transparent hover:border-[#1980e6] transition-colors text-sm sm:text-base"
          >
            {isLoading ? "Sending email..." : "Forgot Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
