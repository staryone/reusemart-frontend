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
import { HiSearch } from "react-icons/hi";
import { useUser } from "@/hooks/use-user";

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
    <div className="flex bg-gray-100 h-screen">
      {/* Create Modal */}
      <Modal
        show={openCreateModal}
        size="md"
        onClose={() => setOpenCreateModal(false)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <form className="space-y-6" onSubmit={handleCreate}>
            <h3 className="text-xl font-medium text-gray-900">
              Tambah Diskusi Baru
            </h3>
            {createError && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                {createError}
              </div>
            )}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="message">Pesan</Label>
              </div>
              <TextInput
                id="message"
                name="message"
                placeholder="Masukkan pesan"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="id_barang">ID Barang</Label>
              </div>
              <TextInput
                id="id_barang"
                name="id_barang"
                placeholder="Masukkan ID barang"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#72C678] hover:bg-[#008E6D]"
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
      >
        <ModalHeader />
        <ModalBody>
          <form className="space-y-6" onSubmit={handleCreate}>
            <h3 className="text-xl font-medium text-gray-900">
              Balas Diskusi: {selectedDiskusi?.nama_barang}
            </h3>
            {createError && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                {createError}
              </div>
            )}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="message">Pesan</Label>
              </div>
              <TextInput
                id="message"
                name="pesan"
                placeholder="Masukkan pesan balasan"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="id_barang">ID Barang</Label>
              </div>
              <TextInput
                id="id_barang"
                name="id_barang"
                value={selectedDiskusi?.id_barang}
                readOnly
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#72C678] hover:bg-[#008E6D]"
            >
              Kirim Balasan
            </Button>
          </form>
        </ModalBody>
      </Modal>

      <div className="flex-1 p-4 ml-64">
        <h1 className="text-4xl font-bold mt-4 mb-4">Diskusi</h1>
        <div className="flex justify-between items-center mb-5">
          <form className="flex gap-3" onSubmit={handleSearch}>
            <input
              type="text"
              name="search-diskusi"
              id="search-diskusi"
              className={`h-11 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#72C678] focus:border-[#72C678] transition duration-200 border ${
                error ? "border-red-700" : "border-gray-500"
              }`}
              placeholder="Cari diskusi"
            />
            <button
              type="submit"
              className="p-3 bg-[#72C678] text-white rounded-lg hover:bg-[#008E6D]"
            >
              <HiSearch />
            </button>
          </form>
          <Button
            onClick={() => setOpenCreateModal(true)}
            className="bg-[#72C678] hover:bg-[#008E6D]"
          >
            Tambah Diskusi
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error memuat data</div>
        ) : data && data[0]?.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {data[0].map((diskusi: Diskusi) => (
              <div
                key={diskusi.id_diskusi}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="text-lg font-semibold text-gray-800">
                  {diskusi.nama_barang}
                </div>
                <div className="text-gray-600 mt-1">Pesan: {diskusi.pesan}</div>
                <div className="text-gray-500 text-sm mt-1">
                  Diajukan oleh: {diskusi.nama}
                </div>
                <div className="text-gray-500 text-sm">
                  Waktu:{" "}
                  {new Date(diskusi.tanggal_diskusi).toLocaleDateString()}
                </div>
                <button
                  onClick={() => handleReply(diskusi)}
                  className="mt-3 inline-block bg-[#72C678] text-white px-4 py-2 rounded-lg hover:bg-[#008E6D] transition"
                >
                  Balas Sekarang
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">Tidak ada data</div>
        )}

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(page * limit, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> entries
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-[#72C678] text-white rounded-lg hover:bg-[#008E6D] disabled:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-[#72C678] text-white rounded-lg hover:bg-[#008E6D] disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
