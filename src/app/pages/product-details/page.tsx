"use client";
import Navbar from "@/app/components/NavBar";
// import { Carousel } from "flowbite-react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
// import Image from "next/image";

export default function ProductDetails() {
  const images = [
    "../product.png",
    "https://res.cloudinary.com/demo/image/upload/v1652366604/docs/demo_image5.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1652345874/docs/demo_image1.jpg",
  ];
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="overflow-x-hidden w-screen pt-30 pb-10 px-24">
        <div className="flex justify-center gap-20 h-fit w-full">
          <div className="w-1/3 place-items-center">
            {/* <Carousel
              slide={false}
              className="!overflow-hidden [scrollbar-width:none]"
              theme={{
                root: {
                  base: "relative h-full w-full",
                  leftControl:
                    "absolute top-0 left-0 flex h-full items-center justify-center px-4 focus:outline-none",
                  rightControl:
                    "absolute top-0 right-0 flex h-full items-center justify-center px-4 focus:outline-none",
                },
                control: {
                  base: "inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus:ring-2 focus:ring-black",
                  icon: "h-3 w-3",
                },
                indicators: {
                  active: {
                    off: "bg-gray-300 hover:bg-gray-400",
                    on: "bg-gray-500",
                  },
                },
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src="/product.png"
                  alt={`Carousel 1`}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="relative w-full h-full">
                <Image
                  src="/product.png"
                  alt={`Carousel 1`}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="relative w-full h-full">
                <Image
                  src="/product.png"
                  alt={`Carousel 1`}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Carousel> */}
            <Carousel useKeyboardArrows={true}>
              {images.map((URL, index) => (
                <div key={index} className="slide relative w-full h-full">
                  <img alt="sample_file" src={URL} key={index} style={{ objectFit: "contain" }} className="w-4/5!"/>
                </div>
              ))}
            </Carousel>
          </div>
          <div className="flex flex-col items-start justify-items-center gap-10 max-w-1/2">
            <div className="text-xl font-semibold">Apple Watch</div>
            <div className="text-4xl font-semibold">Rp2.500.000</div>
            <button className="bg-blue-500 text-white p-3 rounded-lg w-64">
              Tambahkan ke Keranjang
            </button>
            <button className="text-blue-500 border-2 border-blue-500 p-3 rounded-lg w-64">
              Beli Langsung
            </button>
          </div>
        </div>
        <div className="mt-10">
          <div className="text-2xl my-5 font-bold">Informasi Produk</div>
          <div className="flex flex-col gap-4 mb-10 text-md">
            <div className="flex justify-between w-72">
              <div>Kondisi: </div>
              <div>Baru</div>
            </div>
            <div className="flex justify-between w-72">
              <div>Min. Pemesanan: </div>
              <div>1 Buah</div>
            </div>
            <div className="flex justify-between w-72">
              <div>Etalase: </div>
              <div>Dell Monitor</div>
            </div>
            <div className="flex justify-between w-72">
              <div>Garansi: </div>
              <div>23 Juli 2025</div>
            </div>
          </div>
          <div className="text-2xl my-5 font-bold">Deskripsi</div>
          <div className="text-md">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Exercitationem ex laudantium eos pariatur numquam, sit quis
            provident perferendis animi. Facilis saepe asperiores a eaque
            quo numquam rem amet fuga exercitationem! Lorem ipsum dolor sit amet, 
            consectetur adipisicing elit. Consequuntur nemo quaerat deleniti magni odit neque ut excepturi 
            itaque laborum quas. Similique quisquam odio maiores, non velit esse veniam totam animi?
          </div>
        </div>
        <div>
          <div className="text-2xl mt-10 mb-3 font-bold">Diskusi Produk</div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <img
                src="../profile.png"
                alt="profile"
                className="rounded-full h-8 border-1"
              />
              <div className="text-md">Nama</div>
            </div>
            <div className="text-lg ml-11">Apakah produknya ori?</div>
            <hr className="my-3 border-gray-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <img
                src="../profile.png"
                alt="profile"
                className="rounded-full h-8 border-1"
              />
              <div className="text-md">Customer Service</div>
            </div>
            <div className="text-lg ml-11">Ori dongs</div>
            <hr className="my-3 border-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
