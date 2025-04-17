"use client";
import Navbar from "./components/NavBar";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="w-screen h-auto">
        <img src="banner.png" alt="image" className="w-screen" />
      </div>
      <div className="flex flex-col items-start justify-items-center px-18 py-18">
        <h2 className="text-4xl mb-4 mt-10">Barang Terbaru</h2>
        <div className="flex gap-3">
          <div className="w-full max-w-3xs bg-white border border-gray-200 rounded-lg shadow-sm">
            <a href="#">
              <img
                className="p-8 rounded-t-lg"
                src="product.png"
                alt="product image"
              />
            </a>
            <div className="px-5 pb-5">
              <a href="#">
                <h5 className="text-lg tracking-tight text-gray-900">
                  Apple Watch Series 7 GPS, Aluminium Case
                </h5>
              </a>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xl font-bold text-gray-900">
                  Rp2.500.000
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
