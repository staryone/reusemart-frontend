import { Info } from "lucide-react";
import Navbar from "@/app/components/NavBar";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-6 flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Text Info */}
            <div>
              <h1 className="text-3xl font-semibold">Frendy</h1>
              <p className="text-lg text-gray-600">Pembeli</p>

              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Info size={16} />
                  <span>Bergabung sejak 2023</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-1">Nomor Telepon</h2>
            <p className="text-gray-600">08123123123</p>
          </div>
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-1">Total Poin</h2>
            <p className="text-blue-600 text-3xl font-bold">100 Poin</p>
          </div>
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-1">Alamat</h2>
            <div className="border-1 border-gray-300 rounded-lg px-10 py-3">
                <div className="text-lg font-bold my-2">Rumah <span className="ml-2 px-1 py-1 rounded-full border border-blue-400 text-blue-400 text-sm">Utama</span></div>
                <hr className="mb-2"/>
                <div className="text-md">Frendy</div>
                <div className="text-md">08123123123</div>
                <div>Jl. Brigjend Konoha, Gg. Dukuh, No. 20, Depok, Sleman, D. I. Yogyakarta, 52218</div>
            </div>
            <Link href={"/"} className="ml-3 text-blue-400 underline hover:text-blue-500">Daftar alamat</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
