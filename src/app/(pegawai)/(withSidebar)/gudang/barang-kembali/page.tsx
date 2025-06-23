"use client";

import { useUser } from "@/hooks/use-user";
import { getListBarang } from "@/lib/api/barang.api";
import { updateBarangStatus } from "@/lib/api/pegawai.api";
import { Barang } from "@/lib/interface/barang.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Label, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useState, useMemo } from "react";
import { HiSearch } from "react-icons/hi";
import useSWR from "swr";
import toast, { Toaster } from "react-hot-toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const fetcher = async ([query]: [URLSearchParams, string]) =>
  await getListBarang(query);

export default function BarangKembali() {
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);

  const currentUser = useUser();

  const token = currentUser !== null ? currentUser.token : "";

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: "MENUNGGU_KEMBALI",
      all: "true",
    });
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    return params;
  }, [page, searchQuery, limit]);

  const { data, error, isLoading, mutate } = useSWR(
    [queryParams, token],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search-barang-kembali") as string;
    setSearchQuery(search);
    setPage(1);
  };

  const handleConfirmPengambilan = async () => {
    if (!selectedBarang) return;
    try {
      const data = {
        id_barang: selectedBarang.id_barang,
        status: "KEMBALI",
      };
      const formData = new FormData();
      formData.append("id_barang", data.id_barang);
      formData.append("status", data.status);
      const result = await updateBarangStatus(data, token);

      if (result.errors) {
        toast.error("Barang gagal diambil! " + result.errors);
      } else {
        toast.success(
          `Pengambilan barang ${selectedBarang.nama_barang} confirmed!`
        );
        setOpenConfirmModal(false);
        setSelectedBarang(null);
        mutate();
      }
    } catch {
      toast.error("Gagal mengambil barang: " + "Unknown error");
    }
  };

  const totalItems = data?.[1] || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const formatTanggal = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy, HH:mm", { locale: id });
  };

  return (
    <div className="flex-1 p-4 ml-64 w-[calc(95vw-16rem)] min-h-screen">
      <Toaster position="top-center" />
      <h1 className="text-4xl font-bold mt-12 mb-4">
        Data Pengambilan Barang Kembali
      </h1>
      <div className="flex justify-between items-center my-5">
        <form className="flex gap-3" onSubmit={handleSearch}>
          <input
            type="text"
            name="search-barang-kembali"
            id="search-barang-kembali"
            className="border rounded-md p-2 w-72"
            placeholder="Cari barang"
          />
          <button
            type="submit"
            className="p-3 rounded-[0.5rem] bg-[#72C678] text-white font-semibold hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300"
          >
            <HiSearch />
          </button>
        </form>
      </div>
      {/* Updated Table Container */}
      <div className="overflow-x-auto w-full">
        <Table hoverable className="min-w-full border">
          <TableHead>
            <TableRow>
              <TableHeadCell>No.</TableHeadCell>
              <TableHeadCell>Barang</TableHeadCell>
              <TableHeadCell>Penitip</TableHeadCell>
              <TableHeadCell>Batas Ambil</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Error loading data
                </TableCell>
              </TableRow>
            ) : data && data[0]?.length > 0 ? (
              data[0].map((barang: Barang, index: number) => (
                <TableRow
                  key={barang.id_barang}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>{(page - 1) * limit + index + 1}.</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {barang.nama_barang}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {barang.penitip.nama}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {barang.detail_penitipan?.batas_ambil
                      ? formatTanggal(barang.detail_penitipan.batas_ambil)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => {
                        setSelectedBarang(barang);
                        setOpenDetailModal(true);
                      }}
                      className="font-medium text-blue-600 hover:underline dark:text-red-500"
                    >
                      Detail
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => {
                        setSelectedBarang(barang);
                        setOpenConfirmModal(true);
                      }}
                      className="font-medium text-blue-600 hover:underline dark:text-red-500"
                    >
                      Konfirmasi Pengambilan
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{(page - 1) * limit + 1}</span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(page * limit, totalItems)}
          </span>{" "}
          of <span className="font-medium">{totalItems}</span> entries
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        show={openDetailModal}
        onClose={() => {
          setOpenDetailModal(false);
          setSelectedBarang(null);
        }}
      >
        <ModalHeader>Detail Barang</ModalHeader>
        <ModalBody>
          {selectedBarang ? (
            <div className="space-y-4">
              <div>
                <Label>Nama Barang</Label>
                <p className="text-gray-900">{selectedBarang.nama_barang}</p>
              </div>
              <div>
                <Label>Penitip</Label>
                <p className="text-gray-900">{selectedBarang.penitip.nama}</p>
              </div>
              <div>
                <Label>Tanggal Masuk</Label>
                <p className="text-gray-900">
                  {selectedBarang.detail_penitipan?.tanggal_masuk
                    ? formatTanggal(
                        selectedBarang.detail_penitipan.tanggal_masuk
                      )
                    : "-"}
                </p>
              </div>
              <div>
                <Label>Batas Penitipan</Label>
                <p className="text-gray-900">
                  {selectedBarang.detail_penitipan?.tanggal_akhir
                    ? formatTanggal(
                        selectedBarang.detail_penitipan.tanggal_akhir
                      )
                    : "-"}
                </p>
              </div>
              <div>
                <Label>Batas Ambil</Label>
                <p className="text-gray-900">
                  {selectedBarang.detail_penitipan?.batas_ambil
                    ? formatTanggal(selectedBarang.detail_penitipan.batas_ambil)
                    : "-"}
                </p>
              </div>
              <div>
                <Label>Harga</Label>
                <p className="text-gray-900">
                  {selectedBarang.harga
                    ? `Rp ${selectedBarang.harga.toLocaleString()}`
                    : "-"}
                </p>
              </div>
              <div>
                <Label>Berat</Label>
                <p className="text-gray-900">
                  {selectedBarang.berat ? `${selectedBarang.berat} kg` : "-"}
                </p>
              </div>
              <div>
                <Label>Kategori</Label>
                <p className="text-gray-900">
                  {selectedBarang.kategori?.nama_kategori || "-"}
                </p>
              </div>
              <div>
                <Label>Gambar</Label>
                {selectedBarang.gambar && selectedBarang.gambar.length > 0 ? (
                  <div className="flex gap-2">
                    {selectedBarang.gambar.map((img) => (
                      <img
                        key={img.id_gambar}
                        src={img.url_gambar}
                        alt={selectedBarang.nama_barang}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-900">No images available</p>
                )}
              </div>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </ModalBody>
      </Modal>

      {/* Confirm Pengambilan Modal */}
      <Modal
        show={openConfirmModal}
        onClose={() => {
          setOpenConfirmModal(false);
          setSelectedBarang(null);
        }}
      >
        <ModalHeader>Konfirmasi Pengambilan</ModalHeader>
        <ModalBody>
          {selectedBarang ? (
            <div className="space-y-4">
              <p>
                Apakah Anda yakin ingin mengkonfirmasi pengambilan barang{" "}
                <strong>{selectedBarang.nama_barang}</strong> oleh{" "}
                <strong>{selectedBarang.penitip.nama}</strong>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  onClick={() => {
                    setOpenConfirmModal(false);
                    setSelectedBarang(null);
                  }}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-[#72C678] hover:bg-[#008E6D] text-white"
                  onClick={handleConfirmPengambilan}
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}
