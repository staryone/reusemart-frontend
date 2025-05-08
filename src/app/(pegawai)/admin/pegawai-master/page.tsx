"use client";

import SideBar from "@/components/admin/sidebar";
import {
  createPegawai,
  deletePegawai,
  getListPegawai,
  updatePegawai,
} from "@/lib/api/pegawai.api";
import { Pegawai } from "@/lib/interface/pegawai.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import {
  Select,
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
  await getListPegawai(params, token);

export default function PegawaiMaster() {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);

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

  // ini nanti diganti sama token yang di session
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUEVHQVdBSSIsImphYmF0YW4iOiJBZG1pbiIsImlhdCI6MTc0NjY3NjM5OCwiZXhwIjoxNzQ3MjgxMTk4fQ.ZTPJ7IdJa-6LYmB6yUx5CmKy6t6chRTb7Jpp9CgTeCg";

  // ini penting
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
    setSelectedPegawai(null);
  }

  function onCloseDeleteModal() {
    setOpenDeleteModal(false);
    setSelectedPegawai(null);
  }

  function onCloseCreateModal() {
    setOpenCreateModal(false);
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search-pegawai") as string;
    setSearchQuery(search);
    setPage(1);
  };

  const handleEdit = (pegawai: Pegawai) => {
    setSelectedPegawai(pegawai);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    if (!selectedPegawai) return;

    try {
      const res = await deletePegawai(selectedPegawai.id_pegawai, token);

      if (res) {
        mutate(); // Revalidate data after deletion
        onCloseDeleteModal();
      } else {
        console.error("Failed to delete pegawai");
      }
    } catch (error) {
      console.error("Error deleting pegawai:", error);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const createData = new FormData();

    if (formData.get("nama")) {
      createData.set("nama", formData.get("nama") as string);
    }

    if (formData.get("email")) {
      createData.set("email", formData.get("email") as string);
    }

    if (formData.get("telp")) {
      createData.set("nomor_telepon", formData.get("telp") as string);
    }

    if (formData.get("jabatan")) {
      createData.set("id_jabatan", formData.get("jabatan") as string);
    }
    
    if (formData.get("tgl_lahir")) {
      createData.set("tgl_lahir", formData.get("tgl_lahir") as string);
    }
    try {
      const res = await createPegawai(createData, token);

      if (res) {
        mutate(); // Revalidate data after creation
        onCloseCreateModal();
      } else {
        console.error("Failed to create pegawai");
      }
    } catch (error) {
      console.error("Error creating pegawai:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPegawai) return;

    const formData = new FormData(e.currentTarget);
    const updateData = new FormData();

    if (formData.get("nama")) {
      updateData.set("nama", formData.get("nama") as string);
    }

    if (formData.get("email")) {
      updateData.set("email", formData.get("email") as string);
    }

    if (formData.get("telp")) {
      updateData.set("nomor_telepon", formData.get("telp") as string);
    }

    if (formData.get("jabatan")) {
      updateData.set("id_jabatan", formData.get("jabatan") as string);
    }

    try {
      const res = await updatePegawai(
        selectedPegawai.id_pegawai,
        updateData,
        token
      );

      if (res) {
        mutate();
        onCloseModal();
      } else {
        console.error("Failed to update pegawai");
      }
    } catch (error) {
      console.error("Error updating pegawai:", error);
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
              Edit Data Pegawai
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nama">Nama Pegawai</Label>
              </div>
              <TextInput
                id="nama"
                name="nama"
                defaultValue={selectedPegawai?.nama}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="jabatan">Jabatan</Label>
              </div>
              <Select
                id="jabatan"
                name="jabatan"
                defaultValue={selectedPegawai?.jabatan?.id_jabatan?.toString()}
                required
              >
                <option value="">Pilih Jabatan</option>
                <option value="1">Owner</option>
                <option value="2">Admin</option>
                <option value="3">Customer Service</option>
                <option value="4">Gudang</option>
                <option value="5">Kurir</option>
                <option value="6">Hunter</option>
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email">Email</Label>
              </div>
              <TextInput
                id="email"
                name="email"
                defaultValue={selectedPegawai?.email}
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
                defaultValue={selectedPegawai?.nomor_telepon}
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
          <form className="space-y-6" onSubmit={handleCreate}>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Tambah Pegawai Baru
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nama">Nama Pegawai</Label>
              </div>
              <TextInput
                id="nama"
                name="nama"
                placeholder="Masukkan nama pegawai"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="jabatan">Jabatan</Label>
              </div>
              <Select id="jabatan" name="jabatan" required>
                <option value="">Pilih Jabatan</option>
                <option value="1">Owner</option>
                <option value="2">Admin</option>
                <option value="3">Customer Service</option>
                <option value="4">Gudang</option>
                <option value="5">Kurir</option>
                <option value="6">Hunter</option>
              </Select>
            </div>
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
                <Label htmlFor="tgl_lahir">Tanggal Lahir</Label>
              </div>
              <TextInput
                id="tgl_lahir"
                name="tgl_lahir"
                placeholder="Masukkan tgl_lahir"
                type="date"
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
                className="px-4 py-2 text-white bg-[#1980e6] hover:bg-[#1980e6]/80 "
              >
                Tambah Pegawai
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
      <SideBar />
      <div className="flex-1 p-4 ml-64">
        <h1 className="text-4xl font-bold mt-12 mb-4">Data Pegawai</h1>
        <div className="flex justify-between items-center my-5">
          <form className="flex gap-3" onSubmit={handleSearch}>
            <input
              type="text"
              name="search-pegawai"
              id="search-pegawai"
              className="border rounded-md p-2 w-72"
              placeholder="Cari pegawai"
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
            className="bg-[#1980e6] hover:bg-[#1980e6]/80 "
          >
            Tambah Pegawai
          </Button>
        </div>
        <div className="w-full overflow-x-auto">
          <Table hoverable className="w-full border-1">
            <TableHead>
              <TableRow>
                <TableHeadCell>No.</TableHeadCell>
                <TableHeadCell>ID</TableHeadCell>
                <TableHeadCell>Nama</TableHeadCell>
                <TableHeadCell>Jabatan</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>No. Telepon</TableHeadCell>
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
              ) : data && data[0].length > 0 ? (
                data[0].map((pegawai: Pegawai, index: number) => (
                  <TableRow
                    key={pegawai.id_pegawai}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell>{(page - 1) * limit + index + 1}.</TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {pegawai.id_pegawai}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {pegawai.nama}
                    </TableCell>
                    <TableCell>{pegawai.jabatan?.nama_jabatan}</TableCell>
                    <TableCell>{pegawai.email}</TableCell>
                    <TableCell>{pegawai.nomor_telepon}</TableCell>
                    <TableCell>
                      <button
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        onClick={() => handleEdit(pegawai)}
                      >
                        Edit
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          setSelectedPegawai(pegawai);
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