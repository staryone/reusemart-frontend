"use client";

import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { Pengiriman } from "@/lib/interface/pengiriman.interface";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { Gambar } from "@/lib/interface/barang.interface";

interface DetailPengambilanModalProps {
  isOpen: boolean;
  onClose: () => void;
  pengiriman: Pengiriman | null;
}

export default function DetailPengambilanModal({
  isOpen,
  onClose,
  pengiriman,
}: DetailPengambilanModalProps) {
  if (!isOpen || !pengiriman) return null;

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  console.log("pengiriman", pengiriman);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd MMMM yyyy, HH:mm", { locale: id });
  };

  const formattedNomorTransaksi = () => {
    const date = new Date(pengiriman.transaksi.tanggal_transaksi);
    const year = format(date, "yy", { locale: id });
    const month = format(date, "MM", { locale: id });
    return `${year}.${month}.${pengiriman.transaksi.id_transaksi}`;
  };

  const getPrimaryGambar = (gambars: Gambar[]): string => {
    const primaryGambar = gambars.find((gambar) => gambar.is_primary);
    return primaryGambar ? primaryGambar.url_gambar : "/product.png";
  };

  return (
    <Modal show={isOpen} size="2xl" onClose={onClose} popup>
      <ModalHeader className="text-xl font-medium text-gray-900 dark:text-white">
        Detail Pengiriman
      </ModalHeader>
      <ModalBody>
        <div className="space-y-6">
          {/* Transaction Information */}
          <div>
            <h4 className="text-lg font-semibold">Informasi Transaksi</h4>
            <div className="grid grid-cols-1 gap-2 mt-2">
              <p>
                <span className="font-medium">No. Transaksi:</span>{" "}
                {formattedNomorTransaksi()}
              </p>
              <p>
                <span className="font-medium">Tanggal Transaksi:</span>{" "}
                {formatDate(pengiriman.transaksi.tanggal_transaksi)}
              </p>
              <p>
                <span className="font-medium">Tanggal Pembayaran:</span>{" "}
                {formatDate(pengiriman.transaksi.tanggal_pembayaran)}
              </p>
              <p>
                <span className="font-medium">Tanggal Pengiriman:</span>{" "}
                {formatDate(pengiriman.tanggal)}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className={`font-medium`}>
                  {pengiriman.status_pengiriman === "DIPROSES"
                    ? "Diproses"
                    : pengiriman.status_pengiriman === "SEDANG_DIKIRIM"
                    ? "Sedang Dikirim"
                    : pengiriman.status_pengiriman === "SUDAH_DITERIMA"
                    ? "Diterima"
                    : pengiriman.status_pengiriman}
                </span>
              </p>
            </div>
          </div>

          {/* Buyer Information */}
          <div>
            <h4 className="text-lg font-semibold">Informasi Pembeli</h4>
            <div className="grid grid-cols-1 gap-2 mt-2">
              <p>
                <span className="font-medium">Nama:</span>{" "}
                {pengiriman.transaksi.pembeli.nama}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {pengiriman.transaksi.pembeli.email}
              </p>
              <p>
                <span className="font-medium">Poin Loyalitas:</span>{" "}
                {pengiriman.transaksi.pembeli.poin_loyalitas}
              </p>
            </div>
          </div>

          {/* Item List */}
          <div>
            <h4 className="text-lg font-semibold">Daftar Barang</h4>
            <div className="mt-2 space-y-6">
              {pengiriman.transaksi.detail_transaksi &&
              pengiriman.transaksi.detail_transaksi.length > 0 ? (
                pengiriman.transaksi.detail_transaksi.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* Image Section */}
                    <div>
                      {item.barang.gambar.length > 0 && (
                        <div className="flex gap-2 mt-4 overflow-x-auto">
                          {item.barang.gambar.map((gambar, index) => (
                            <Image
                              key={index}
                              src={gambar.url_gambar}
                              alt={`Gambar ${index + 1}`}
                              width={100}
                              height={100}
                              className="rounded-md object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Details Section */}
                    <div className="space-y-2">
                      <h5 className="text-md font-semibold">
                        {item.barang.nama_barang}
                      </h5>
                      <p>
                        <span className="font-medium">Harga:</span>{" "}
                        {formatRupiah(item.barang.harga)}
                      </p>
                      <p>
                        <span className="font-medium">QC:</span>{" "}
                        {item.barang.nama_qc} ({item.barang.id_qc})
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Tidak ada barang</p>
              )}
            </div>
          </div>

          {/* Totals */}
          <div>
            <h4 className="text-lg font-semibold">Rincian Biaya</h4>
            <div className="grid grid-cols-1 gap-2 mt-2">
              <p>
                <span className="font-medium">Subtotal Barang:</span>{" "}
                {formatRupiah(pengiriman.transaksi.total_harga)}
              </p>
              <p>
                <span className="font-medium">Ongkos Kirim:</span>{" "}
                {formatRupiah(pengiriman.transaksi.ongkos_kirim)}
              </p>
              <p>
                <span className="font-medium">
                  Potongan {pengiriman.transaksi.potongan_poin} poin:
                </span>{" "}
                {pengiriman.transaksi.potongan_poin * 100}
              </p>
              <p>
                <span className="font-medium">Total Akhir:</span>{" "}
                {formatRupiah(pengiriman.transaksi.total_akhir)}
              </p>
              <p>
                <span className="font-medium">Poin dari Pesanan:</span>{" "}
                {pengiriman.transaksi.total_poin}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Tutup
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
