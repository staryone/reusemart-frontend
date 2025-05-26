import { useRouter } from "next/navigation";
import { Transaksi } from "@/lib/interface/transaksi.interface";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import { updateRating } from "@/lib/api/rating.api";

// Define the StatusPengiriman enum
enum StatusPengiriman {
  DIPROSES = "DIPROSES",
  SIAP_DIAMBIL = "SIAP_DIAMBIL",
  SEDANG_DIKIRIM = "SEDANG_DIKIRIM",
  SUDAH_DITERIMA = "SUDAH_DITERIMA",
}

interface Props {
  transaksi: Transaksi;
}

export default function CardTransaksi({ transaksi }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const formattedDate = format(
    new Date(transaksi.tanggal_transaksi),
    "dd MMM yyyy",
    { locale: id }
  );

  const formatYear = format(new Date(transaksi.tanggal_transaksi), "yyyy");
  const formatMonth = format(new Date(transaksi.tanggal_transaksi), "MM");

  const getFirstBarang = (transaksi: Transaksi) => {
    const firstDetail = transaksi.detail_transaksi?.[0];
    return firstDetail?.barang || null;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBayarSekarang = () => {
    localStorage.setItem("idTransaksi", transaksi.id_transaksi.toString());
    router.push("/pembayaran");
  };

  // Map status to display text and background colors, including StatusPengiriman
  const statusStyles: Record<
    string,
    { text: string; bgColor: string; textColor: string }
  > = {
    BELUM_DIBAYAR: {
      text: "Belum Dibayar",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    SUDAH_DIBAYAR: {
      text: "Sudah Dibayar",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    DITERIMA: {
      text: "Sedang Diproses",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
    DIBATALKAN: {
      text: "Dibatalkan Sistem",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
    },
    DITOLAK: {
      text: "Ditolak oleh CS",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
    },
    [StatusPengiriman.DIPROSES]: {
      text: "Proses Packing",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
    },
    [StatusPengiriman.SIAP_DIAMBIL]: {
      text: "Siap Diambil",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    [StatusPengiriman.SEDANG_DIKIRIM]: {
      text: "Sedang Dikirim",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    [StatusPengiriman.SUDAH_DITERIMA]: {
      text: "Selesai",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
  };

  // Prioritize status_pengiriman if transaksi.pengiriman exists
  const currentStatus =
    transaksi.pengiriman && transaksi.pengiriman.status_pengiriman
      ? statusStyles[transaksi.pengiriman.status_pengiriman] || {
          text: transaksi.pengiriman.status_pengiriman,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
        }
      : statusStyles[transaksi.status_Pembayaran] || {
          text: transaksi.status_Pembayaran,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
        };

  return (
    <>
      <div className="flex justify-between items-start border rounded-xl p-4 mb-4 bg-white shadow-sm">
        {/* Kiri: Tanggal dan info */}
        <div className="flex flex-col w-3/12">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <span>{formattedDate}</span>
          </div>
          <span className="text-xs text-gray-400">
            {formatYear}.{formatMonth}.{transaksi.id_transaksi}
          </span>
        </div>

        {/* Tengah: Produk info */}
        <div className="flex w-6/12 items-start gap-4">
          <div className="flex flex-col">
            <p className="font-semibold text-sm mb-1 line-clamp-2">
              {getFirstBarang(transaksi)?.nama_barang ||
                "Barang tidak tersedia"}
              <span className="font-normal text-xs">
                {transaksi.detail_transaksi.length > 1 &&
                  ` + ${transaksi.detail_transaksi.length - 1} barang lainnya`}
              </span>
            </p>

            <p className="text-sm text-gray-600">
              Rp{" "}
              {getFirstBarang(transaksi)?.harga.toLocaleString() ||
                "Barang tidak tersedia"}
              <span className="font-normal text-xs">
                {transaksi.detail_transaksi.length > 1 &&
                  ` + ${transaksi.detail_transaksi.length - 1} barang lainnya`}
              </span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus.bgColor} ${currentStatus.textColor}`}
              >
                {currentStatus.text}
              </span>
              {transaksi.status_Pembayaran === "BELUM_DIBAYAR" && (
                <button
                  onClick={handleBayarSekarang}
                  className="inline-flex items-center px-3 py-1.5 rounded-md bg-[#72C678] text-white text-xs font-semibold hover:bg-[#008E6D] transition-colors duration-200"
                >
                  Bayar Sekarang
                </button>
              )}
            </div>

            <div className="flex gap-2 mt-3 text-sm">
              <button
                onClick={handleOpenModal}
                className="text-[#72C678] hover:text-[#008E6D] font-semibold"
              >
                Lihat Detail Transaksi
              </button>
            </div>
          </div>
        </div>

        {/* Kanan: Total */}
        <div className="flex flex-col items-end justify-between w-3/12 text-right">
          <p className="text-sm text-gray-500">Total Belanja</p>
          <p className="text-lg font-bold text-gray-800">
            Rp {transaksi.total_akhir.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <TransactionDetailModal
          transaksi={transaksi}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

interface ModalProps {
  transaksi: Transaksi;
  onClose: () => void;
}

function TransactionDetailModal({ transaksi, onClose }: ModalProps) {
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [ratedItems, setRatedItems] = useState<{ [key: string]: boolean }>(
    transaksi.detail_transaksi.reduce(
      (acc, detail) => ({
        ...acc,
        [detail.barang.id_barang]: detail.is_rating || false,
      }),
      {}
    )
  );

  // Date formatting with error handling
  let formattedDateTransaksi = "-";
  if (transaksi.tanggal_transaksi) {
    try {
      formattedDateTransaksi = `${format(
        new Date(transaksi.tanggal_transaksi),
        "dd MMMM yyyy, HH:mm",
        { locale: id }
      )} WIB`;
    } catch (error) {
      console.warn(
        "Invalid tanggal_transaksi:",
        transaksi.tanggal_transaksi,
        error
      );
      formattedDateTransaksi = "Tanggal tidak valid";
    }
  }

  let formattedDatePembayaran = "-";
  if (transaksi.tanggal_pembayaran) {
    try {
      formattedDatePembayaran = `${format(
        new Date(transaksi.tanggal_pembayaran),
        "dd MMMM yyyy, HH:mm",
        { locale: id }
      )} WIB`;
    } catch (error) {
      console.warn(
        "Invalid tanggal_pembayaran:",
        transaksi.tanggal_pembayaran,
        error
      );
      formattedDatePembayaran = "Tanggal tidak valid";
    }
  }

  let formattedDateBatas = "-";
  if (transaksi.batas_pembayaran) {
    try {
      formattedDateBatas = `${format(
        new Date(transaksi.batas_pembayaran),
        "dd MMMM yyyy, HH:mm",
        { locale: id }
      )} WIB`;
    } catch (error) {
      console.warn(
        "Invalid batas_pembayaran:",
        transaksi.batas_pembayaran,
        error
      );
      formattedDateBatas = "Tanggal tidak valid";
    }
  }

  let formattedDatePengiriman = "-";
  if (transaksi.pengiriman?.tanggal_pengiriman) {
    try {
      formattedDatePengiriman = `${format(
        new Date(transaksi.pengiriman.tanggal_pengiriman),
        "dd MMMM yyyy, HH:mm",
        { locale: id }
      )} WIB`;
    } catch (error) {
      console.warn(
        "Invalid tanggal_pengiriman:",
        transaksi.pengiriman.tanggal_pengiriman,
        error
      );
      formattedDatePengiriman = "Tanggal tidak valid";
    }
  }

  let status_pengiriman = "-";
  if (transaksi.pengiriman?.status_pengiriman) {
    try {
      status_pengiriman = `${transaksi.pengiriman.status_pengiriman}`;
    } catch {
      status_pengiriman = "Status tidak valid";
    }
  }

  const formatYear = format(new Date(transaksi.tanggal_transaksi), "yyyy");
  const formatMonth = format(new Date(transaksi.tanggal_transaksi), "MM");

  // Handle rating selection
  const handleRatingChange = (id_barang: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [id_barang]: rating }));
    setErrors((prev) => ({ ...prev, [id_barang]: null })); // Clear error on change
  };

  // Handle rating submission
  const handleSubmitRating = async (id_barang: string) => {
    if (
      !ratings[id_barang] ||
      ratings[id_barang] < 1 ||
      ratings[id_barang] > 5
    ) {
      setErrors((prev) => ({
        ...prev,
        [id_barang]: "Pilih rating antara 1 hingga 5 bintang",
      }));
      return;
    }

    setIsSubmitting((prev) => ({ ...prev, [id_barang]: true }));
    try {
      const formData = new FormData();
      formData.append("rating", ratings[id_barang].toString());

      const accessToken = localStorage.getItem("accessToken") || undefined;
      const response = await updateRating(id_barang, formData, accessToken);

      if (response.errors) {
        throw new Error("Gagal mengirim rating");
      }

      setRatedItems((prev) => ({ ...prev, [id_barang]: true }));
      setErrors((prev) => ({
        ...prev,
        [id_barang]: "Rating berhasil dikirim!",
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [id_barang]: "Gagal mengirim rating: " + error,
      }));
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [id_barang]: false }));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Detail Transaksi</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Nomor Transaksi:</span> {formatYear}
            .{formatMonth}.{transaksi.id_transaksi}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Tanggal Transaksi:</span>{" "}
            {formattedDateTransaksi}
          </p>
        </div>

        {/* Items List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Daftar Barang
          </h3>
          {transaksi.detail_transaksi.length > 0 ? (
            <div className="space-y-4">
              {transaksi.detail_transaksi.map((detail, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 border-b pb-4 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {detail.barang.nama_barang}
                    </p>
                    <p className="text-sm text-gray-600">
                      Rp {detail.barang.harga.toLocaleString()}
                    </p>
                    {/* Rating Input - Only show when transaksi.pengiriman exists and status_pengiriman is SUDAH_DITERIMA */}
                    {transaksi.pengiriman &&
                      transaksi.pengiriman.status_pengiriman ===
                        StatusPengiriman.SUDAH_DITERIMA && (
                        <div className="mt-2">
                          {ratedItems[detail.barang.id_barang] ? (
                            <p className="text-sm text-green-600">
                              Sudah dirating
                            </p>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() =>
                                      handleRatingChange(
                                        detail.barang.id_barang,
                                        star
                                      )
                                    }
                                    className={`text-2xl ${
                                      ratings[detail.barang.id_barang] >= star
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    } hover:text-yellow-400 focus:outline-none`}
                                    disabled={
                                      isSubmitting[detail.barang.id_barang]
                                    }
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={() =>
                                  handleSubmitRating(detail.barang.id_barang)
                                }
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold text-white ${
                                  isSubmitting[detail.barang.id_barang]
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#72C678] hover:bg-[#008E6D]"
                                }`}
                                disabled={isSubmitting[detail.barang.id_barang]}
                              >
                                Kirim Rating
                              </button>
                            </div>
                          )}
                          {errors[detail.barang.id_barang] && (
                            <p
                              className={`text-sm mt-1 ${
                                errors[detail.barang.id_barang]?.includes(
                                  "berhasil"
                                )
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {errors[detail.barang.id_barang]}
                            </p>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Tidak ada barang dalam transaksi ini.
            </p>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Pengiriman
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Metode Pengiriman</span>
              <span>{transaksi.metode_pengiriman || "-"}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Biaya Pengiriman</span>
              <span>Rp {transaksi.ongkos_kirim?.toLocaleString() || "-"}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Status Pengiriman</span>
              <span>{status_pengiriman}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tanggal Pengiriman</span>
              <span>{formattedDatePengiriman}</span>
            </div>
          </div>
        </div>

        <div className="border-t mt-3 pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Ringkasan Pembayaran
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal Barang</span>
              <span>Rp {transaksi.total_akhir.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Potongan Poin</span>
              <span>Rp {transaksi.potongan_poin.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-800">
              <span>Total Akhir</span>
              <span>Rp {transaksi.total_akhir.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Batas Pembayaran</span>
              <span>{formattedDateBatas}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tanggal Pembayaran</span>
              <span>{formattedDatePembayaran}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Status Pembayaran</span>
              <span>{transaksi.status_Pembayaran}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#72C678] text-white px-4 py-2 rounded hover:bg-[#008E6D]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
