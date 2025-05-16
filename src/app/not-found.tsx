import Footer from "@/components/utama/footer";
import Navbar from "@/components/utama/navbar";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl text-gray-600 mb-6">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#72C678] text-white rounded-lg hover:from-[#72C678] hover:to-[#008E6D] transition-colors hover:cursor-pointer"
        >
          Kembali ke Homepage
        </Link>
      </div>
      <Footer />
    </>
  );
}
