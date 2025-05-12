"use client";

import { createPembeli } from "@/lib/api/pembeli.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    console.log(formData.get("nama"));
    try {
      const res = await createPembeli(formData);

      if (res.data) {
        toast.success("Akun berhasil dibuat!");
        router.push("/login");
      } else {
        toast.error("Akun gagal dibuat!");
      }
    } catch (error) {
      toast.error("Error ketika mendaftar!");
      console.error("Error register:", error);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div className="overflow-x-hidden w-screen h-screen p-10 place-items-center place-content-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="border-1 border-gray-300 rounded-lg w-1/2 p-10 bg-white"
        >
          <div className="text-5xl mb-3 font-bold">Registrasi Pembeli</div>
          <div className="my-3">
            Ingin mendaftarkan organisasi sosial?{" "}
            <Link
              href={"/pages/register-organisasi"}
              className="text-[#1980e6]/80 underline hover:text-[#1980e6]"
            >
              Daftar disini!
            </Link>
          </div>
          <div className="flex justify-center gap-15">
            <div className="flex flex-col items-start w-full">
              <div className="my-3 w-full">
                <div className="mb-1">Nama</div>
                <input
                  type="text"
                  name="nama"
                  className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"
                />
              </div>
              <div className="my-3 w-full">
                <div className="mb-1">Email</div>
                <input
                  type="text"
                  name="email"
                  className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"
                />
              </div>
              <div className="my-3 w-full">
                <div className="mb-1">No. Handphone</div>
                <input
                  type="text"
                  name="nomor_telepon"
                  className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"
                />
              </div>
            </div>
            <div className="flex flex-col items-start w-full">
              <div className="my-3 w-full">
                <div className="mb-1">Password</div>
                <input
                  type="password"
                  name="password"
                  className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"
                />
              </div>
              <div className="my-3 w-full">
                <div className="mb-1">Konfirmasi Password</div>
                <input
                  type="password"
                  name="confirm_password"
                  className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"
                />
              </div>
              <button
                type="submit"
                className="my-3 rounded-[0.5rem] py-2 px-8 bg-[#1980e6] text-white hover:bg-white hover:text-[#1980e6] border-1 hover:border-[#1980e6] transition-colors"
              >
                Registrasi
              </button>
              <div className="my-3">
                <Link
                  href={"/pages/login"}
                  className="text-[#1980e6]/80 underline hover:text-[#1980e6]"
                >
                  Saya sudah punya akun
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
