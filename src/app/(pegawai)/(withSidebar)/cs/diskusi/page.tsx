"use client";

import { getListDiskusi, createDiskusi } from "@/lib/api/diskusi.api";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  TextInput,
  Label,
} from "flowbite-react";
import { useState, useMemo } from "react";
import useSWR from "swr";
import {
  HiSearch,
  HiPlus,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import { useUser } from "@/hooks/use-user";
import toast from "react-hot-toast";

interface Diskusi {
  id_diskusi: number;
  tanggal_diskusi: string;
  pesan: string;
  id_barang: string;
  id_pembeli: number;
  nama_barang: string;
  nama: string;
  role: string;
}

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getListDiskusi(params, token);

export default function Diskusi() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [selectedDiskusi, setSelectedDiskusi] = useState<Diskusi | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  const currentUser = useUser();
  const token = currentUser !== null ? currentUser.token : "";

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    return params;
  }, [page, searchQuery]);

  const { data, error, isLoading, mutate } = useSWR(
    [queryParams, token],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useMemo(() => {
    if (data && data[1] !== undefined) {
      setTotalItems(data[1]);
    }
  }, [data]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search-diskusi") as string;
    setSearchQuery(search);
    setPage(1);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateError(null);

    const formData = new FormData(e.currentTarget);
    const createData = new FormData();

    try {
      const message = formData.get("pesan") as string;
      const id_barang = formData.get("id_barang") as string;

      if (!message || message.trim().length < 5) {
        throw new Error("Pesan harus diisi dan minimal 5 karakter");
      }
      if (!id_barang) {
        throw new Error("ID Barang harus diisi");
      }

      createData.set("pesan", message);
      createData.set("id_barang", id_barang);

      const res = await createDiskusi(createData, token);

      if (res) {
        toast.success("Berhasil membalas pesan diskusi!");
        mutate();
        setOpenCreateModal(false);
        setOpenReplyModal(false);
        setSelectedDiskusi(null);
      } else {
        throw new Error("Gagal membuat diskusi");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membuat diskusi";
      setCreateError(errorMessage);
    }
  };

  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleReply = (diskusi: Diskusi) => {
    setSelectedDiskusi(diskusi);
    setOpenReplyModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Create Modal */}
      <Modal
        show={openCreateModal}
        size="md"
        onClose={() => setOpenCreateModal(false)}
        popup
        className="rounded-xl"
      >
        <ModalHeader className="p-4 border-b border-gray-200 text-xl font-semibold text-gray-800">
          Tambah Diskusi Baru
        </ModalHeader>
        <ModalBody className="p-6">
          <form className="space-y-4" onSubmit={handleCreate}>
            {createError && (
              <div className="p-3 text-sm text-red-800 rounded-lg bg-red-50 shadow-sm">
                {createError}
              </div>
            )}
            <div>
              <Label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pesan
              </Label>
              <TextInput
                id="message"
                name="pesan"
                placeholder="Masukkan pesan Anda"
                required
                className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition-all"
              />
            </div>
            <div>
              <Label
                htmlFor="id_barang"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ID Barang
              </Label>
              <TextInput
                id="id_barang"
                name="id_barang"
                placeholder="Masukkan ID barang"
                required
                className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition-all"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#72C678] to-[#5DAB64] hover:from-[#5DAB64] hover:to-[#4A8F50] text-white font-semibold rounded-lg shadow-md transition-all"
            >
              Tambah Diskusi
            </Button>
          </form>
        </ModalBody>
      </Modal>

      {/* Reply Modal */}
      <Modal
        show={openReplyModal}
        size="md"
        onClose={() => {
          setOpenReplyModal(false);
          setSelectedDiskusi(null);
        }}
        popup
        className="rounded-xl"
      >
        <ModalHeader className="p-4 border-b border-gray-200 text-xl font-semibold text-gray-800">
          Balas Diskusi: {selectedDiskusi?.nama_barang}
        </ModalHeader>
        <ModalBody className="p-6">
          <form className="space-y-4" onSubmit={handleCreate}>
            {createError && (
              <div className="p-3 text-sm text-red-800 rounded-lg bg-red-50 shadow-sm">
                {createError}
              </div>
            )}
            <div>
              <Label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pesan
              </Label>
              <TextInput
                id="message"
                name="pesan"
                placeholder="Masukkan pesan balasan"
                required
                className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition-all"
              />
            </div>
            <div>
              <Label
                htmlFor="id_barang"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ID Barang
              </Label>
              <TextInput
                id="id_barang"
                name="id_barang"
                value={selectedDiskusi?.id_barang}
                readOnly
                required
                className="rounded-lg border-gray-300 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#72C678] to-[#5DAB64] hover:from-[#5DAB64] hover:to-[#4A8F50] text-white font-semibold rounded-lg shadow-md transition-all"
            >
              Kirim Balasan
            </Button>
          </form>
        </ModalBody>
      </Modal>

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-8 ml-0 sm:ml-64">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Diskusi
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <form
              className="flex items-center gap-3 w-full sm:w-auto"
              onSubmit={handleSearch}
            >
              <div className="relative w-full sm:w-64">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="search-diskusi"
                  id="search-diskusi"
                  className={`w-full h-11 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition-all shadow-sm ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Cari diskusi..."
                />
              </div>
              <button
                type="submit"
                className="p-2.5 bg-gradient-to-r from-[#72C678] to-[#5DAB64] hover:from-[#5DAB64] hover:to-[#4A8F50] text-white rounded-lg shadow-md transition-all"
              >
                <HiSearch className="w-5 h-5" />
                <span className="sr-only">Cari</span>
              </button>
            </form>
            <Button
              onClick={() => setOpenCreateModal(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-[#72C678] to-[#5DAB64] hover:from-[#5DAB64] hover:to-[#4A8F50] text-white font-semibold rounded-lg shadow-md transition-all"
            >
              <HiPlus className="w-5 h-5 mr-2" />
              Tambah Diskusi
            </Button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="text-center text-gray-600 py-10">
            <div className="animate-pulse text-lg">Memuat data...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-10 bg-red-50 rounded-lg shadow-sm">
            Error memuat data: {error.message}
          </div>
        ) : data && data[0]?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data[0].map((diskusi: Diskusi) => (
              <div
                key={diskusi.id_diskusi}
                className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  {diskusi.nama_barang}
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {diskusi.pesan}
                </p>
                <div className="text-gray-500 text-xs mb-1">
                  Diajukan oleh:{" "}
                  <span className="font-medium">{diskusi.nama}</span>
                </div>
                <div className="text-gray-500 text-xs mb-4">
                  Waktu:{" "}
                  {new Date(diskusi.tanggal_diskusi).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </div>
                <button
                  onClick={() => handleReply(diskusi)}
                  className="w-full bg-gradient-to-r from-[#72C678] to-[#5DAB64] hover:from-[#5DAB64] hover:to-[#4A8F50] text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
                >
                  Balas Sekarang
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-10 bg-white rounded-lg shadow-sm">
            Tidak ada diskusi ditemukan.
          </div>
        )}

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <p className="text-sm text-gray-600">
              Menampilkan{" "}
              <span className="font-medium">{(page - 1) * limit + 1}</span>{" "}
              sampai{" "}
              <span className="font-medium">
                {Math.min(page * limit, totalItems)}
              </span>{" "}
              dari <span className="font-medium">{totalItems}</span> diskusi
            </p>
            <nav aria-label="Pagination" className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-all"
              >
                <HiChevronLeft className="w-5 h-5" />
                <span className="sr-only">Sebelumnya</span>
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      pageNumber === page
                        ? "bg-[#72C678] text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-all"
              >
                <HiChevronRight className="w-5 h-5" />
                <span className="sr-only">Selanjutnya</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
