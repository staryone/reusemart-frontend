"use client";
import Navbar from "@/components/utama/navbar";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getBarang } from "@/lib/api/barang.api";
import { Barang, Gambar } from "@/lib/interface/barang.interface";
import { getListDiskusi, createDiskusi } from "@/lib/api/diskusi.api";
import { Diskusi } from "@/lib/interface/diskusi.interface";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth/auth";

export default function ProductDetails() {
  const [barang, setBarang] = useState<Barang | null>(null);
  const [diskusi, setDiskusi] = useState<Diskusi[]>([]);
  const [gambar, setGambar] = useState<Gambar[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { id } = useParams();

  const token = getToken() || "";
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch barang
        const barangResponse = await getBarang(id?.toString());
        setBarang(barangResponse);

        setGambar(barangResponse.gambar);
        // Fetch diskusi with the updated paramsDiskusi
        if (token) {
          const params = new URLSearchParams();
          params.set("search", barangResponse.nama_barang);
          const diskusiResponse = await getListDiskusi(params, token);
          setDiskusi(diskusiResponse[0]);
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    }
    fetchData();
  }, [id, token]);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A"; // Handle missing dates
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmitDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return; // Prevent empty submissions
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("pesan", newMessage);
      formData.append("id_barang", id?.toString() || "");

      await createDiskusi(formData, token);

      // Refresh discussion list
      const params = new URLSearchParams();
      params.set("search", barang?.nama_barang || "");
      const diskusiResponse = await getListDiskusi(params, token);
      setDiskusi(diskusiResponse[0]);

      // Clear input
      setNewMessage("");
    } catch (error) {
      console.error("Gagal menambahkan diskusi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="overflow-x-hidden w-screen pt-30 pb-10 px-24">
        <div className="flex justify-center gap-20 h-fit w-full">
          <div className="w-1/3 place-items-center">
            <Carousel useKeyboardArrows={true}>
              {gambar.map((item) => (
                <div
                  key={item.id_gambar}
                  className="slide relative w-full h-full"
                >
                  <img
                    alt="sample_file"
                    src={item.url_gambar}
                    key={item.id_gambar}
                    style={{ objectFit: "contain" }}
                    className="w-4/5!"
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="flex flex-col items-start justify-items-center gap-10 max-w-1/2">
            <div className="text-xl font-semibold">{barang?.nama_barang}</div>
            <div className="text-4xl font-semibold">
              Rp
              {barang?.harga !== undefined
                ? new Intl.NumberFormat("id-ID").format(barang.harga)
                : "0"}
            </div>
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
              <div>Nama penitip: </div>
              <div>{barang?.penitip.nama}</div>
            </div>
            <div className="flex justify-between w-72">
              <div>Berat produk: </div>
              <div>{barang?.berat} kg</div>
            </div>
            <div className="flex justify-between w-72">
              <div>Kategori: </div>
              <div>{barang?.kategori.nama_kategori}</div>
            </div>
            <div className="flex justify-between w-72">
              <div>Garansi: </div>
              <div>
                {barang?.garansi == null
                  ? "Tidak ada"
                  : formatDate(barang.garansi)}
              </div>
            </div>
          </div>
          <div className="text-2xl my-5 font-bold">Deskripsi</div>
          <div className="text-md">{barang?.deskripsi}</div>
        </div>
        <div>
          {token ? (
            <div>
              <div className="text-2xl mt-10 mb-3 font-bold">
                Diskusi Produk
              </div>
              <div className="mb-5">
                <form
                  onSubmit={handleSubmitDiscussion}
                  className="flex flex-col gap-3"
                >
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tulis pesan diskusi Anda..."
                    className="border-2 border-gray-300 rounded-lg p-3 w-full h-24 resize-none"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    className={`bg-[#1980e6] text-white p-3 rounded-[0.5rem] w-48 hover:bg-[#1980e6]/80 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Diskusi"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          {diskusi && diskusi.length > 0 ? (
            diskusi.map((diskusi: Diskusi) => (
              <div key={diskusi.id_diskusi}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <img
                      src="../profile.png"
                      alt="profile"
                      className="rounded-full h-8 border-1"
                    />
                    <div className="text-md">
                      {diskusi.role == "CS" ? "Customer Service" : diskusi.nama}
                    </div>
                  </div>
                  <div className="text-lg ml-11">{diskusi.pesan}</div>
                  <hr className="my-3 border-gray-400" />
                </div>
              </div>
            ))
          ) : (
            <div>{token ? "Belum ada diskusi" : ""}</div>
          )}
        </div>
      </div>
    </div>
  );
}
