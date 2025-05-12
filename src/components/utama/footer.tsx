import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Deskripsi */}
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={1200}
              height={300}
              className="h-16 w-auto"
            />
          </div>
          <p className="text-sm text-white/80">
            Platform jual beli barang bekas terpercaya untuk semua kalangan.
            Dukung ekonomi sirkular bersama kami.
          </p>
        </div>

        {/* Menu Navigasi */}
        <div>
          <h4 className="font-semibold mb-3">Menu</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-[#008E6D]">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/produk" className="hover:text-[#008E6D]">
                Produk
              </Link>
            </li>
            <li>
              <Link href="/transaksi" className="hover:text-[#008E6D]">
                Transaksi
              </Link>
            </li>
            <li>
              <Link href="/profil" className="hover:text-[#008E6D]">
                Profil
              </Link>
            </li>
            <li>
              <Link href="/tentang" className="hover:text-[#008E6D]">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link href="/kontak" className="hover:text-[#008E6D]">
                Kontak
              </Link>
            </li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h4 className="font-semibold mb-3">Kontak</h4>
          <ul className="text-sm space-y-2">
            <li>Email: support@reusemart.com</li>
            <li>Telepon: +62 812 3456 7890</li>
            <li>Alamat: Jl. Recycle No. 10, Jakarta</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-sm text-white/70 mt-10 border-t border-white/30 pt-4">
        © {new Date().getFullYear()} ReUseMart. All rights reserved.
      </div>
    </footer>
  );
}
