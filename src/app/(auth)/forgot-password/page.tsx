"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/pembeli/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        router.push("/");
        console.log(data.token);
      } else {
        const data = await response.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    }
  };

  return (
    <div>
      <div className="overflow-x-hidden w-screen h-screen p-10 place-items-center place-content-center bg-gray-100">
        <form
          onSubmit={handleForgotPassword}
          className="flex flex-col items-start border-1 border-gray-300 rounded-lg w-1/3 p-10 bg-white"
        >
          <div className="text-5xl mb-3 font-bold">Forgot Password</div>
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
          <button
            type="submit"
            className="my-3 rounded-[0.5rem] py-2 px-8 bg-[#1980e6] text-white hover:bg-white hover:text-[#1980e6] border-1 hover:border-[#1980e6] transition-colors"
          >
            Forgot Password
          </button>
        </form>
      </div>
    </div>
  );
}
