"use client";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getBarang } from "@/lib/api/barang.api";
import { Barang, Gambar } from "@/lib/interface/barang.interface";
import { getListByBarangId, createDiskusi } from "@/lib/api/diskusi.api";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { HiStar } from "react-icons/hi";
import { createKeranjang } from "@/lib/api/keranjang.api";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/use-user";

export interface DiskusiPublic {
  id_diskusi: number;
  tanggal_diskusi: string;
  pesan: string;
  id_barang: string;
  id_pembeli?: number;
  id_cs?: number;
  nama: string;
  role: string;
}

export default function ProductDetails() {
  const [barang, setBarang] = useState<Barang | null>(null);
  const [diskusi, setDiskusi] = useState<DiskusiPublic[]>([]);
  const [gambar, setGambar] = useState<Gambar[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { id } = useParams();
  const router = useRouter();

  const currentUser = useUser();

  const token = currentUser !== null ? currentUser.token : "";

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch barang
        const barangResponse = await getBarang(id?.toString());
        setBarang(barangResponse);
        setGambar(barangResponse.gambar);

        // Fetch diskusi

        const diskusiResponse = await getListByBarangId(id?.toString());
        setDiskusi(diskusiResponse[0] || []);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    }
    fetchData();
  }, [id]);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmitDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("pesan", newMessage);
      formData.append("id_barang", id?.toString() || "");

      await createDiskusi(formData, currentUser ? currentUser.token : "");

      // Refresh discussion list
      const diskusiResponse = await getListByBarangId(id?.toString());
      setDiskusi(diskusiResponse[0] || []);

      // Clear input
      setNewMessage("");
    } catch (error) {
      console.error("Gagal menambahkan diskusi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitKeranjang = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id_barang", id?.toString() || "");

      const result = await createKeranjang(formData, token);
      if (result.data) {
        return toast.success("Barang berhasil masuk ke keranjang");
      }
      return toast.error("Barang gagal masuk ke keranjang");
    } catch {
      return toast.error(
        "Terjadi kesalahan tidak terduga, silahkan coba lagi! "
      );
    }
  };

  const handleBeliLangsung = () => {
    const dataForCheckout = [
      {
        id_keranjang: 99999,
        id_barang: barang?.id_barang,
        id_pembeli: 99999,
        id_penitip: barang?.penitip.id_penitip,
        is_selected: true,
        nama_penitip: barang?.penitip.nama,
        nama_barang: barang?.nama_barang,
        harga_barang: barang?.harga,
        gambar_barang: barang?.gambar[0].url_gambar,
        kategori_barang: barang?.kategori.nama_kategori,
        createdAt: Date.now().toString(),
      },
    ];

    try {
      localStorage.setItem("checkoutItems", JSON.stringify(dataForCheckout));
      router.push("/checkout");
    } catch (e) {
      console.error("Gagal menyimpan item ke localStorage:", e);
      toast.error("Terjadi kesalahan saat memproses checkout.");
    }
  };

  return (
    <div className="overflow-x-hidden">
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
            <div>
              <div className="text-xl font-semibold">{barang?.nama_barang}</div>
              <div className="flex items-center gap-4">
                <div className="text-sm mt-2 text-gray-600">
                  {barang?.penitip.nama}{" "}
                </div>
                <div className="flex justify-center items-center">
                  <HiStar className="text-2xl text-yellow-300" />
                  {barang?.penitip.rating.toFixed(1)}/5
                </div>
              </div>
            </div>
            <div className="text-4xl font-semibold">
              Rp
              {barang?.harga !== undefined
                ? new Intl.NumberFormat("id-ID").format(barang.harga)
                : "0"}
            </div>
            <button
              onClick={handleSubmitKeranjang}
              className="bg-[#72C678] text-white p-3 rounded-xl w-64 hover:cursor-pointer hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300"
            >
              Tambahkan ke Keranjang
            </button>
            <button
              onClick={handleBeliLangsung}
              className="text-[#72C678] border-2 border-[#72C678] p-3 rounded-xl w-64 hover:cursor-pointer"
            >
              Beli Langsung
            </button>
          </div>
        </div>
        <div className="mt-10">
          <div className="text-2xl my-5 font-bold">Informasi Produk</div>
          <div className="flex flex-col gap-4 mb-10 text-md">
            {/* <div className="flex justify-between w-72">
              <div>Nama penitip: </div>
              <div>{barang?.penitip.nama}</div>
              <div>{barang?.penitip.rating}</div>
            </div> */}
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
          <div className="text-2xl mt-10 mb-3 font-bold">Diskusi Produk</div>
          {token ? (
            <div>
              <div className="mb-5">
                <form
                  onSubmit={handleSubmitDiscussion}
                  className="flex flex-col gap-3"
                >
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tulis pesan diskusi Anda..."
                    className="border-2 border-gray-300 rounded-xl p-3 w-full h-24 resize-none"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    className={`bg-[#72C678] text-white p-3 rounded-xl w-48 hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300 ${
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
            <div>
              {diskusi.map((diskusi: DiskusiPublic) => (
                <div key={diskusi.id_diskusi}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <img
                        src="../profile.png"
                        alt="profile"
                        className="rounded-full h-8 border-1"
                      />
                      <div className="text-md">
                        {diskusi.role === "CS"
                          ? "Customer Service"
                          : diskusi.nama}
                      </div>
                    </div>
                    <div className="text-lg ml-11">{diskusi.pesan}</div>
                    <hr className="my-3 border-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex flex-col">Belum ada diskusi</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
