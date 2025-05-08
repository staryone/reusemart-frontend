import Navbar from "@/components/utama/navbar";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 pb-10 pt-26">
      <Navbar />
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Profile Summary */}
        <div className="flex flex-col justify-between">
          <div className="flex flex-col items-start">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Frendy</h1>
            <p className="text-gray-600 mb-2">Pembeli</p>
            <p className="text-sm text-gray-400">📅 Bergabung sejak 2023</p>
          </div>
          {/* Points */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Total Poin</h2>
            <p className="text-[#2662d9] text-2xl font-bold mt-1">100 Poin</p>
          </div>
        </div>

        {/* Right: Details */}
        <div className="col-span-2 space-y-6">
          {/* Phone */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Nomor Telepon
            </h2>
            <p className="text-gray-700 mt-1">08123123123</p>
          </div>

          {/* Address */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Alamat</h2>
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-800">Rumah</h3>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  Utama
                </span>
              </div>
              <p className="text-gray-700">Frendy</p>
              <p className="text-gray-700">08123123123</p>
              <p className="text-gray-700">
                Jl. Brigjend Konoha, Gg. Dukuh, No. 20, Depok, Sleman, D. I.
                Yogyakarta, 52218
              </p>
            </div>
            <Link
              href={"/daftar-alamat"}
              className="text-[#2662d9] text-md hover:underline hover:text-blue-500"
            >
              Daftar alamat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
