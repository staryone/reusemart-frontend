import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl text-gray-600 mb-6">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Link href="/">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Kembali ke Homepage
        </button>
      </Link>
    </div>
  );
}
