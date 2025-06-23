import { Transaksi } from "@/lib/interface/transaksi.interface";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";

interface Props {
  transaksi: Transaksi;
}

export default function CardTransaksi({ transaksi }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  let formattedDatePengiriman = "";
  if (transaksi.pengiriman?.tanggal) {
    try {
      formattedDatePengiriman = `${format(
        new Date(transaksi.pengiriman.tanggal),
        "dd MMMM yyyy, HH:mm",
        { locale: id }
      )} WIB`;
    } catch (error) {
      console.warn(
        "Invalid tanggal pengiriman:",
        transaksi.pengiriman.tanggal,
        error
      );
      formattedDatePengiriman = "Tanggal tidak valid";
    }
  }

  let status_pengiriman = "";
  if (transaksi.pengiriman?.status_pengiriman) {
    status_pengiriman = `${transaksi.pengiriman.status_pengiriman}`;
  }

  const formatYear = format(new Date(transaksi.tanggal_transaksi), "yyyy");
  const formatMonth = format(new Date(transaksi.tanggal_transaksi), "MM");

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
              <span>{transaksi.metode_pengiriman}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Biaya Pengiriman</span>
              <span>Rp {transaksi.ongkos_kirim}</span>
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
