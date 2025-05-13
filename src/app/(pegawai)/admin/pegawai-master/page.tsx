"use client";

import SideBar from "@/components/admin/sidebar";
import {
  createPegawai,
  deletePegawai,
  getListPegawai,
  resetPasswordPegawai,
  updatePegawai,
} from "@/lib/api/pegawai.api";
import { getToken } from "@/lib/auth/auth";
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
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

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

  function onCloseModal() {
    setOpenModal(false);
    setSelectedPegawai(null);
    setUpdateError(null);
  }

  function onCloseDeleteModal() {
    setOpenDeleteModal(false);
    setSelectedPegawai(null);
  }

  function onCloseResetPasswordModal() {
    setOpenResetPasswordModal(false);
    setSelectedPegawai(null);
  }

  function onCloseCreateModal() {
    setOpenCreateModal(false);
    setCreateError(null);
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
        mutate();
        onCloseDeleteModal();
      } else {
        console.error("Gagal menghapus pegawai");
      }
    } catch (error: unknown) {
      console.error("Error menghapus pegawai:", error);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedPegawai) return;

    try {
      const res = await resetPasswordPegawai(selectedPegawai.id_pegawai, token);

      if (res) {
        mutate();
        onCloseResetPasswordModal();
      } else {
        console.error("Gagal reset password pegawai");
      }
    } catch (error: unknown) {
      console.error("Error reset password pegawai:", error);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateError(null);

    const formData = new FormData(e.currentTarget);
    const createData = new FormData();

    try {
      // Validasi input
      const nama = formData.get("nama") as string;
      const email = formData.get("email") as string;
      const telp = formData.get("telp") as string;
      const jabatan = formData.get("jabatan") as string;
      const tglLahir = formData.get("tgl_lahir") as string;

      if (!nama || nama.trim().length < 2) {
        throw new Error("Nama harus diisi dan minimal 2 karakter");
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Email tidak valid");
      }
      if (!telp || !/^\d{10,13}$/.test(telp)) {
        throw new Error("Nomor telepon tidak valid (10-13 digit)");
      }
      if (!jabatan) {
        throw new Error("Jabatan harus dipilih");
      }
      if (!tglLahir) {
        throw new Error("Tanggal lahir harus diisi");
      }

      if (nama) createData.set("nama", nama);
      if (email) createData.set("email", email);
      if (telp) createData.set("nomor_telepon", telp);
      if (jabatan) createData.set("id_jabatan", jabatan);
      if (tglLahir) createData.set("tgl_lahir", tglLahir);

      const res = await createPegawai(createData, token);

      if (res) {
        mutate();
        onCloseCreateModal();
      } else {
        throw new Error("Gagal membuat pegawai");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membuat pegawai";
      setCreateError(errorMessage);
      console.error("Error creating pegawai:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPegawai) return;
    setUpdateError(null);

    const formData = new FormData(e.currentTarget);
    const updateData = new FormData();

    try {
      // Validasi input
      const nama = formData.get("nama") as string;
      const email = formData.get("email") as string;
      const telp = formData.get("telp") as string;
      const jabatan = formData.get("jabatan") as string;

      if (!nama || nama.trim().length < 2) {
        throw new Error("Nama harus diisi dan minimal 2 karakter");
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Email tidak valid");
      }
      if (!telp || !/^\d{10,13}$/.test(telp)) {
        throw new Error("Nomor telepon tidak valid (10-13 digit)");
      }
      if (!jabatan) {
        throw new Error("Jabatan harus dipilih");
      }

      if (nama) updateData.set("nama", nama);
      if (email) updateData.set("email", email);
      if (telp) updateData.set("nomor_telepon", telp);
      if (jabatan) updateData.set("id_jabatan", jabatan);

      const res = await updatePegawai(
        selectedPegawai.id_pegawai,
        updateData,
        token
      );

      if (res) {
        mutate();
        onCloseModal();
      } else {
        throw new Error("Gagal memperbarui pegawai");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memperbarui pegawai";
      setUpdateError(errorMessage);
      console.error("Error updating pegawai:", error);
    }
  };

  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChangeKILLME = (newPage: number) => {
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
            {updateError && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                {updateError}
              </div>
            )}
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
        show={openResetPasswordModal}
        size="md"
        onClose={onCloseResetPasswordModal}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Apakah Anda yakin ingin reset password data ini?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={onCloseResetPasswordModal}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Reset Password
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
            {createError && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                {createError}
              </div>
            )}
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
                className="px-4 py-2 text-white bg-[#1980e6] hover:bg-[#1980e6]/80"
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
            className="bg-[#1980e6] hover:bg-[#1980e6]/80"
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
                <TableHeadCell>
                  <span className="sr-only">Reset Password</span>
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
                    Error memuat data
                  </TableCell>
                </TableRow>
              ) : data && data[0]?.length > 0 ? (
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
                    <TableCell>
                      <button
                        onClick={() => {
                          setSelectedPegawai(pegawai);
                          setOpenResetPasswordModal(true);
                        }}
                        className="font-medium text-yellow-600 hover:underline dark:text-yellow-500"
                      >
                        Reset Password
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Tidak ada data
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
              onClick={() => handlePageChangeKILLME(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChangeKILLME(page + 1)}
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