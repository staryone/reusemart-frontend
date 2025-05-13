"use client";

import SideBar from "@/components/cs/sidebar";
import {
  createPenitip,
  deletePenitip,
  getListPenitip,
  //   resetPasswordPenitip,
  updatePenitip,
} from "@/lib/api/penitip.api";
import { getToken } from "@/lib/auth/auth";
import { Penitip } from "@/lib/interface/penitip.interface";
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
  TextInput,
  Button,
} from "flowbite-react";
import { useState, useMemo } from "react";
import { HiSearch } from "react-icons/hi";
import useSWR from "swr";

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getListPenitip(params, token);

export default function PenitipMaster() {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPenitip, setSelectedPenitip] = useState<Penitip | null>(null);

  const token = getToken() || "";

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
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

  useMemo(() => {
    if (data && data[1] !== undefined) {
      setTotalItems(data[1]);
    }
  }, [data]);

  function onCloseModal() {
    setOpenModal(false);
    setSelectedPenitip(null);
  }

  function onCloseDeleteModal() {
    setOpenDeleteModal(false);
    setSelectedPenitip(null);
  }

  function onCloseCreateModal() {
    setOpenCreateModal(false);
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search-penitip") as string;
    setSearchQuery(search);
    setPage(1);
  };

  const handleEdit = (penitip: Penitip) => {
    setSelectedPenitip(penitip);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    if (!selectedPenitip) return;

    try {
      const res = await deletePenitip(selectedPenitip.id_penitip, token);

      if (res) {
        mutate(); // Revalidate data after deletion
        onCloseDeleteModal();
      } else {
        console.error("Failed to delete penitip");
      }
    } catch (error) {
      console.error("Error deleting penitip:", error);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const res = await createPenitip(formData, token);

      if (res) {
        mutate(); // Revalidate data after creation
        onCloseCreateModal();
      } else {
        console.error("Failed to create penitip");
      }
    } catch (error) {
      console.error("Error creating penitip:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPenitip) return;

    const formData = new FormData(e.currentTarget);
    const updateData = new FormData();

    if (formData.get("email")) {
      updateData.set("email", formData.get("email") as string);
    }

    if (formData.get("nama")) {
      updateData.set("nama", formData.get("nama") as string);
    }

    if (formData.get("alamat")) {
      updateData.set("alamat", formData.get("alamat") as string);
    }

    if (formData.get("telp")) {
      updateData.set("nomor_telepon", formData.get("telp") as string);
    }

    try {
      const res = await updatePenitip(
        selectedPenitip.id_penitip,
        updateData,
        token
      );

      if (res) {
        mutate();
        onCloseModal();
      } else {
        console.error("Failed to update penitip");
      }
    } catch (error) {
      console.error("Error updating penitip:", error);
    }
  };

  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex">
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <form className="space-y-6" onSubmit={handleUpdate}>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Edit Data Penitip
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email">Email</Label>
              </div>
              <TextInput
                id="email"
                name="email"
                defaultValue={selectedPenitip?.email}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nama">Nama Penitip</Label>
              </div>
              <TextInput
                id="nama"
                name="nama"
                defaultValue={selectedPenitip?.nama}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="alamat">Alamat</Label>
              </div>
              <TextInput
                id="alamat"
                name="alamat"
                defaultValue={selectedPenitip?.alamat}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="telp">Nomor Telepon</Label>
              </div>
              <TextInput
                id="telp"
                name="telp"
                defaultValue={selectedPenitip?.nomor_telepon}
                required
              />
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700"
              >
                Update Data
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
      <Modal
        show={openDeleteModal}
        size="md"
        onClose={onCloseDeleteModal}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Apakah Anda yakin ingin menghapus data ini?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={onCloseDeleteModal}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        show={openCreateModal}
        size="md"
        onClose={onCloseCreateModal}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <form
            className="space-y-6"
            onSubmit={handleCreate}
            encType="multipart/form-data"
          >
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Tambah Penitip Baru
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email">Email</Label>
              </div>
              <TextInput
                id="email"
                name="email"
                placeholder="Masukkan email"
                type="email"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password">Password</Label>
              </div>
              <TextInput
                id="password"
                name="password"
                placeholder="Masukkan password"
                type="password"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="confirm_password">Konfirmasi Password</Label>
              </div>
              <TextInput
                id="confirm_password"
                name="confirm_password"
                placeholder="Konfirmasi password"
                type="password"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="ktp">Nomor KTP</Label>
              </div>
              <TextInput
                id="ktp"
                name="ktp"
                placeholder="Masukkan nomor KTP"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="foto_ktp">Foto KTP</Label>
              </div>
              <input
                id="foto_ktp"
                name="foto_ktp"
                type="file"
                accept="image/*"
                required
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nama">Nama Penitip</Label>
              </div>
              <TextInput
                id="nama"
                name="nama"
                placeholder="Masukkan nama penitip"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="alamat">Alamat</Label>
              </div>
              <TextInput
                id="alamat"
                name="alamat"
                placeholder="Masukkan alamat"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="telp">Nomor Telepon</Label>
              </div>
              <TextInput
                id="telp"
                name="telp"
                placeholder="Masukkan nomor telepon"
                required
              />
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              <Button
                type="submit"
                className="px-4 py-2 text-white bg-[#1980e6] hover:bg-[#1980e6]/80"
              >
                Tambah Penitip
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
      <SideBar />
      <div className="flex-1 p-4 ml-64 w-screen">
        <h1 className="text-4xl font-bold mt-12 mb-4">Data Penitip</h1>
        <div className="flex justify-between items-center my-5">
          <form className="flex gap-3" onSubmit={handleSearch}>
            <input
              type="text"
              name="search-penitip"
              id="search-penitip"
              className="border rounded-md p-2 w-72"
              placeholder="Cari penitip"
            />
            <button
              type="submit"
              className="p-3 bg-blue-500 text-white rounded-md"
            >
              <HiSearch />
            </button>
          </form>
          <Button
            onClick={() => setOpenCreateModal(true)}
            className="bg-[#1980e6] hover:bg-[#1980e6]/80"
          >
            Tambah Penitip
          </Button>
        </div>
        {/* Updated Table Container */}
        <div className="overflow-x-auto">
          <Table hoverable className="min-w-full border">
            <TableHead>
              <TableRow>
                <TableHeadCell>No.</TableHeadCell>
                <TableHeadCell>ID</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>Nomor KTP</TableHeadCell>
                <TableHeadCell>Nama</TableHeadCell>
                <TableHeadCell>Alamat</TableHeadCell>
                <TableHeadCell>No. Telepon</TableHeadCell>
                <TableHeadCell>Saldo</TableHeadCell>
                <TableHeadCell>Rating</TableHeadCell>
                <TableHeadCell>Poin</TableHeadCell>
                <TableHeadCell>
                  <span className="sr-only">Edit</span>
                </TableHeadCell>
                <TableHeadCell>
                  <span className="sr-only">Delete</span>
                </TableHeadCell>
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
                data[0].map((penitip: Penitip, index: number) => (
                  <TableRow
                    key={penitip.id_penitip}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell>{(page - 1) * limit + index + 1}.</TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {penitip.id_penitip}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {penitip.email}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {penitip.nomor_ktp}
                    </TableCell>
                    <TableCell>{penitip.nama}</TableCell>
                    <TableCell>{penitip.alamat}</TableCell>
                    <TableCell>{penitip.nomor_telepon}</TableCell>
                    <TableCell>{penitip.saldo}</TableCell>
                    <TableCell>{penitip.rating.toFixed(1)}</TableCell>
                    <TableCell>{penitip.poin}</TableCell>
                    <TableCell>
                      <button
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        onClick={() => handleEdit(penitip)}
                      >
                        Edit
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          setSelectedPenitip(penitip);
                          setOpenDeleteModal(true);
                        }}
                        className="font-medium text-red-600 hover:underline dark:text-red-500"
                      >
                        Delete
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
      </div>
    </div>
  );
}
