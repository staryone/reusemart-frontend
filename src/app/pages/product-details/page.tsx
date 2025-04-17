"use client";
import Navbar from "@/app/components/NavBar";

export default function ProductDetails() {
  return (
    <div>
      <Navbar />
      <div className="overflow-x-hidden w-screen p-10">
        <div className="flex gap-20 h-fit w-full">
          <div className="w-1/2 place-items-center">
            <img src="../product.png" alt="product" className="w-2/3"/>
          </div>
          <div className="flex flex-col items-start justify-items-center gap-10 max-w-1/2">
              <div className="text-xl font-semibold">Apple Watch</div>
              <div className="text-4xl font-semibold">Rp2.500.000</div>
              <button className="bg-blue-500 text-white p-3 rounded-lg w-64">Tambahkan ke Keranjang</button>
              <button className="text-blue-500 border-2 border-blue-500 p-3 rounded-lg w-64">Beli Langsung</button>
              <hr className="w-full"/>
              <div>
                <div className="text-xl mb-3">Deskripsi</div>
                <div>Kondisi: Baru</div>
                <div>Min. Pemesanan: 1 Buah</div>
                <div>Etalase: Dell Monitor</div>
                <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem ex laudantium eos pariatur numquam, sit quis provident perferendis animi. Facilis saepe asperiores a eaque quo numquam rem amet fuga exercitationem!</div>
              </div>
          </div>
        </div>
        <div>
          <div className="text-xl font-bold my-5">Diskusi Produk</div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <img src="../profile.png" alt="profile" className="rounded-full h-8 border-1"/>
              <div className="text-md">Nama</div>
            </div>
            <div className="text-lg ml-11">Apakah produknya ori?</div>
            <hr className="my-3 border-gray-400"/>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <img src="../profile.png" alt="profile" className="rounded-full h-8 border-1"/>
              <div className="text-md">Customer Service</div>
            </div>
            <div className="text-lg ml-11">Ori dongs</div>
            <hr className="my-3 border-gray-400"/>
          </div>
        </div>
      </div>
    </div>
  );
}
