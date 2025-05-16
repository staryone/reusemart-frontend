"use client";
import { useState } from "react";
import { forgotPasswordUser } from "@/lib/api/user.api";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateForm = () => {
    let isValid = true;
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email harus diisi");
      isValid = false;
    }

    return isValid;
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await forgotPasswordUser(formData);

      if (response.data) {
        toast.success("Email reset password berhasil dikirim!");
      } else {
        toast.error("Gagal mengirim email reset password.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan pada server: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.trim()) {
      setEmailError("");
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="overflow-x-hidden w-screen min-h-screen p-4 sm:p-10 flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleForgotPassword}
          className="flex flex-col items-start border border-gray-300 rounded-lg w-full max-w-md p-8 bg-white shadow-md animate-fade-in"
        >
          <div className="text-3xl mb-4 font-bold text-center w-full text-gray-800">
            Forgot Password
          </div>
          <div className=" w-full text-center text-gray-600">
            Masukkan alamat emailmu disini
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
                emailError ? "border-red-700" : "border-gray-500"
              }`}
              required
            />
            {emailError && (
              <div className="text-red-500 text-sm mt-1">{emailError}</div>
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
            {isLoading ? "Mengirim..." : "Kirim Email Reset"}
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
