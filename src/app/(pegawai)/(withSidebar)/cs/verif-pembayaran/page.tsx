"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import {
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Select,
} from "flowbite-react";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  XCircle,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import useSWR from "swr";
import { TransaksiVerif } from "@/lib/interface/transaksi.interface";
import {
  getListTransaksiVerif,
  verifPembayaran,
} from "@/lib/api/transaksi.api";
import { useUser } from "@/hooks/use-user";
import toast from "react-hot-toast";

export default function VerifPembayaran() {
  const [openModal, setOpenModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransaksiVerif | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("SUDAH_DIBAYAR"); // Default filter

  const currentUser = useUser();
  const token = currentUser !== null ? currentUser.token : "";

  // Query parameters for pagination and status filter
  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: statusFilter, // Add status filter to query params
    });
    return params;
  }, [page, limit, statusFilter]);

  // Fetcher function for useSWR
  const fetcher = async ([params, token]: [URLSearchParams, string]) =>
    await getListTransaksiVerif(params, token);

  // Fetch data using useSWR
  const { data, error, isLoading, mutate } = useSWR(
    token ? [queryParams, token] : null, // Prevent fetching if no token
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  // Update totalItems when data changes
  useMemo(() => {
    if (data && data[1] !== undefined) {
      setTotalItems(data[1]);
    }
  }, [data]);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / limit);

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle verification or rejection
  const handleVerifyAction = async (action: "accept" | "reject") => {
    if (!selectedTransaction) return;

    try {
      const formData = new FormData();
      formData.set("status", action === "accept" ? "DITERIMA" : "DITOLAK");

      await verifPembayaran(
        selectedTransaction.id_transaksi.toString(),
        formData,
        token
      );

      if (action === "accept") {
        toast.success("Pembayaran berhasil diterima!");
      } else {
        toast.success("Pembayaran berhasil ditolak!");
      }
      mutate(); // Revalidate data after action
      setOpenModal(false);
    } catch (error) {
      console.error("Error verifying payment:", error);
      // Optionally show error notification
    }
  };

  // Handle verify button click
  const handleVerifyClick = (transaction: TransaksiVerif) => {
    setSelectedTransaction(transaction);
    setOpenModal(true);
  };

  // Handle status filter change
  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main Content */}
      <main className="flex-1 flex justify-center py-8 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40">
        <div className="w-full max-w-5xl flex flex-col">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6 p-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Verifikasi Pembayaran
            </h1>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="statusFilter"
                className="text-sm font-medium text-gray-700"
              >
                Filter Status:
              </Label>
              <Select
                id="statusFilter"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="w-48"
              >
                <option value="ALL">Semua</option>
                <option defaultChecked={true} value="SUDAH_DIBAYAR">
                  Menunggu Verifikasi
                </option>
                <option value="DITERIMA">Sudah Terverifikasi</option>
                <option value="DITOLAK">Verifikasi Ditolak</option>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="px-2 py-3">
            {isLoading && <p>Loading...</p>}
            {error && <p>Error loading transactions: {error.message}</p>}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>ID Transaksi</TableHeadCell>
                    <TableHeadCell>Nomor Transaksi</TableHeadCell>
                    <TableHeadCell>Jumlah</TableHeadCell>
                    <TableHeadCell>Tanggal</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell>Aksi</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                  {data && data[0] && data[0].length > 0 ? (
                    data[0].map((transaction: TransaksiVerif) => (
                      <TableRow
                        key={transaction.id_transaksi}
                        className="bg-white hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="whitespace-nowrap font-medium text-gray-700">
                          {transaction.id_transaksi}
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-medium text-gray-700">
                          {transaction.nomor_transaksi}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-gray-600">
                          {transaction.total_akhir.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-gray-600">
                          {new Date(
                            transaction.tanggal_transaksi
                          ).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium text-sm ${
                              transaction.status_Pembayaran === "DITERIMA"
                                ? "bg-[#E6F7E2] text-[#4CAF50]"
                                : transaction.status_Pembayaran === "DITOLAK"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {transaction.status_Pembayaran === "DITERIMA" ? (
                              <CheckCircle />
                            ) : (
                              <XCircle />
                            )}
                            {transaction.status_Pembayaran === "DITERIMA"
                              ? "Sudah Terverifikasi"
                              : transaction.status_Pembayaran === "DITOLAK"
                              ? "Verifikasi Ditolak"
                              : "Menunggu Verifikasi"}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <button
                            className="text-sm text-[#8cd279] font-bold hover:text-[#76b966] transition-colors"
                            onClick={() => handleVerifyClick(transaction)}
                          >
                            {transaction.status_Pembayaran !== "SUDAH_DIBAYAR"
                              ? "Detail"
                              : "Verifikasi"}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        Data transaksi kosong
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
              <div className="mt-6 flex justify-center">
                <nav
                  aria-label="Pagination"
                  className="inline-flex -space-x-px rounded-md shadow-sm bg-white border border-gray-200"
                >
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-[#8cd279] focus:border-[#8cd279] disabled:opacity-50"
                  >
                    <span className="sr-only">Sebelumnya</span>
                    <ChevronLeft />
                  </button>
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                        pageNumber === page
                          ? "text-[#8cd279] bg-[#e6f7e2]"
                          : "text-gray-700 hover:bg-gray-50"
                      } focus:z-10 focus:outline-none focus:ring-1 focus:ring-[#8cd279] focus:border-[#8cd279]`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-[#8cd279] focus:border-[#8cd279] disabled:opacity-50"
                  >
                    <span className="sr-only">Berikutnya</span>
                    <ChevronRight />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Modal show={openModal} onClose={() => setOpenModal(false)} size="2xl">
          <ModalHeader>Detail Transaksi</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              {/* Left Section: Transaction Details */}
              <div className="space-y-6">
                <div>
                  <Label className="block text-xs font-medium text-gray-500 uppercase">
                    ID Transaksi
                  </Label>
                  <p className="text-sm text-gray-800 font-medium">
                    {selectedTransaction.id_transaksi}
                  </p>
                </div>
                <div>
                  <Label className="block text-xs font-medium text-gray-500 uppercase">
                    Pengguna
                  </Label>
                  <p className="text-sm text-gray-800">
                    {selectedTransaction.pembeli.nama} (
                    {selectedTransaction.pembeli.email})
                  </p>
                </div>
                <div>
                  <Label className="block text-xs font-medium text-gray-500 uppercase">
                    Jumlah
                  </Label>
                  <p className="text-2xl font-bold text-[#8cd279]">
                    {selectedTransaction.total_akhir.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </p>
                </div>
                <div>
                  <Label className="block text-xs font-medium text-gray-500 uppercase">
                    Tanggal & Waktu
                  </Label>
                  <p className="text-sm text-gray-800">
                    {new Date(
                      selectedTransaction.tanggal_transaksi
                    ).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <Label className="block text-xs font-medium text-gray-500 uppercase">
                    Nomor Transaksi
                  </Label>
                  <p className="text-sm text-gray-800">
                    {selectedTransaction.nomor_transaksi}
                  </p>
                </div>
                <div>
                  <Label className="block text-xs font-medium text-gray-500 uppercase">
                    Status Saat Ini
                  </Label>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium text-sm ${
                      selectedTransaction.status_Pembayaran === "DITERIMA"
                        ? "bg-[#E6F7E2] text-[#4CAF50]"
                        : selectedTransaction.status_Pembayaran === "DITOLAK"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedTransaction.status_Pembayaran === "DITERIMA" ? (
                      <CheckCircle />
                    ) : (
                      <XCircle />
                    )}
                    {selectedTransaction.status_Pembayaran === "DITERIMA"
                      ? "Sudah Terverifikasi"
                      : selectedTransaction.status_Pembayaran === "DITOLAK"
                      ? "Verifikasi Ditolak"
                      : "Menunggu Verifikasi"}
                  </span>
                </div>
                {/* Improved Section: Item Details (Neater Layout) */}
                <div>
                  <Label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                    Detail Barang
                  </Label>
                  {selectedTransaction.barang.length > 0 ? (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <ul className="space-y-3">
                        {selectedTransaction.barang.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between py-3 px-4 bg-white rounded-md shadow-sm hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-sm font-semibold text-gray-900">
                              {item.nama_barang}
                            </span>
                            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                              ID: {item.id_barang}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Tidak ada barang.
                    </p>
                  )}
                </div>
              </div>

              {/* Right Section: Payment Proof */}
              <div className="space-y-4">
                <div>
                  <Label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    Bukti Pembayaran
                  </Label>
                  <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                    <Image
                      alt="Bukti Pembayaran"
                      className="object-contain max-h-full max-w-full"
                      src={selectedTransaction.bukti_transfer}
                      width={720}
                      height={1080}
                    />
                  </div>
                  <button
                    className="mt-2 text-sm text-[#8cd279] hover:text-[#76b966] font-medium flex items-center gap-1"
                    onClick={() => setOpenImageModal(true)}
                  >
                    <ZoomIn />
                    Lihat Gambar Penuh
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedTransaction.status_Pembayaran === "SUDAH_DIBAYAR" ? (
              <div className="mt-6 flex flex-col sm:flex-row justify-end items-center gap-3">
                <Button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 cursor-pointer text-white"
                  onClick={() => handleVerifyAction("reject")}
                >
                  <XCircle />
                  Tolak Pembayaran
                </Button>
                <Button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 cursor-pointer text-white"
                  onClick={() => handleVerifyAction("accept")}
                >
                  <CheckCircle />
                  Verifikasi Pembayaran
                </Button>
              </div>
            ) : (
              <div className="mt-6 flex flex-col sm:flex-row justify-end items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border shadow-sm ${
                    selectedTransaction.status_Pembayaran === "DITERIMA"
                      ? "bg-[#E6F7E2] text-[#4CAF50] border-[#4CAF50]"
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}
                >
                  {selectedTransaction.status_Pembayaran === "DITERIMA" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  {selectedTransaction.status_Pembayaran === "DITOLAK"
                    ? `Ditolak oleh ${
                        selectedTransaction.cs?.nama_cs || "Unknown"
                      }`
                    : `Diterima oleh ${
                        selectedTransaction.cs?.nama_cs || "Unknown"
                      }`}
                </span>
              </div>
            )}
          </ModalBody>
        </Modal>
      )}

      {/* Full Image Modal */}
      {selectedTransaction && (
        <Modal
          show={openImageModal}
          onClose={() => setOpenImageModal(false)}
          size="5xl"
        >
          <ModalHeader>Bukti Pembayaran - Gambar Penuh</ModalHeader>
          <ModalBody>
            <div className="flex justify-center items-center">
              <Image
                alt="Bukti Pembayaran Penuh"
                className="max-w-full max-h-[80vh] object-contain"
                src={selectedTransaction.bukti_transfer}
                width={1080}
                height={1440}
              />
            </div>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
