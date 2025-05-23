"use client";

import { useUser } from "@/hooks/use-user";
import {
  createPenitip,
  deletePenitip,
  getListPenitip,
  updatePenitip,
} from "@/lib/api/penitip.api";
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
import toast, { Toaster } from "react-hot-toast";

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

  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createConfirmPassword, setCreateConfirmPassword] = useState("");
  const [createKtp, setCreateKtp] = useState("");
  const [createNama, setCreateNama] = useState("");
  const [createAlamat, setCreateAlamat] = useState("");
  const [createTelepon, setCreateTelepon] = useState("");
  const [createFotoKtp, setCreateFotoKtp] = useState<File | null>(null);
  const [createEmailError, setCreateEmailError] = useState("");
  const [createPasswordError, setCreatePasswordError] = useState("");
  const [createConfirmPasswordError, setCreateConfirmPasswordError] =
    useState("");
  const [createKtpError, setCreateKtpError] = useState("");
  const [createNamaError, setCreateNamaError] = useState("");
  const [createAlamatError, setCreateAlamatError] = useState("");
  const [createTeleponError, setCreateTeleponError] = useState("");
  const [createFotoKtpError, setCreateFotoKtpError] = useState("");
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const [updateEmail, setUpdateEmail] = useState("");
  const [updateNama, setUpdateNama] = useState("");
  const [updateAlamat, setUpdateAlamat] = useState("");
  const [updateTelepon, setUpdateTelepon] = useState("");
  const [updateEmailError, setUpdateEmailError] = useState("");
  const [updateNamaError, setUpdateNamaError] = useState("");
  const [updateAlamatError, setUpdateAlamatError] = useState("");
  const [updateTeleponError, setUpdateTeleponError] = useState("");
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

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

  // function onCloseModal() {
  //   setOpenModal(false);
  //   setSelectedPenitip(null);
  // }

  function onCloseModal() {
    setOpenModal(false);
    setSelectedPenitip(null);
    setUpdateEmail("");
    setUpdateNama("");
    setUpdateAlamat("");
    setUpdateTelepon("");
    setUpdateEmailError("");
    setUpdateNamaError("");
    setUpdateAlamatError("");
    setUpdateTeleponError("");
  }

  function onCloseDeleteModal() {
    setOpenDeleteModal(false);
    setSelectedPenitip(null);
  }

  // function onCloseCreateModal() {
  //   setOpenCreateModal(false);
  // }

  function onCloseCreateModal() {
    setOpenCreateModal(false);
    setCreateEmail("");
    setCreatePassword("");
    setCreateConfirmPassword("");
    setCreateKtp("");
    setCreateNama("");
    setCreateAlamat("");
    setCreateTelepon("");
    setCreateFotoKtp(null);
    setCreateEmailError("");
    setCreatePasswordError("");
    setCreateConfirmPasswordError("");
    setCreateKtpError("");
    setCreateNamaError("");
    setCreateAlamatError("");
    setCreateTeleponError("");
    setCreateFotoKtpError("");
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search-penitip") as string;
    setSearchQuery(search);
    setPage(1);
  };

  // const handleEdit = (penitip: Penitip) => {
  //   setSelectedPenitip(penitip);
  //   setOpenModal(true);
  // };

  const handleEdit = (penitip: Penitip) => {
    setSelectedPenitip(penitip);
    setUpdateEmail(penitip.email);
    setUpdateNama(penitip.nama);
    setUpdateAlamat(penitip.alamat);
    setUpdateTelepon(penitip.nomor_telepon);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    if (!selectedPenitip) return;

    try {
      const res = await deletePenitip(selectedPenitip.id_penitip, token);

      if (res) {
        toast.success("Penitip berhasil dihapus!");
        mutate();
        onCloseDeleteModal();
      } else {
        toast.error("Gagal menghapus penitip.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menghapus penitip.");
    }
  };

  const validateCreateForm = () => {
    let isValid = true;
    setCreateEmailError("");
    setCreatePasswordError("");
    setCreateConfirmPasswordError("");
    setCreateKtpError("");
    setCreateNamaError("");
    setCreateAlamatError("");
    setCreateTeleponError("");
    setCreateFotoKtpError("");

    if (!createEmail.trim()) {
      setCreateEmailError("Email harus diisi");
      isValid = false;
    }
    if (!createPassword) {
      setCreatePasswordError("Password harus diisi");
      isValid = false;
    } else if (createPassword.length < 8) {
      setCreatePasswordError("Password harus minimal 8 karakter");
      isValid = false;
    }
    if (!createConfirmPassword) {
      setCreateConfirmPasswordError("Konfirmasi password harus diisi");
      isValid = false;
    } else if (createConfirmPassword !== createPassword) {
      setCreateConfirmPasswordError("Konfirmasi password tidak cocok");
      isValid = false;
    }
    if (!createKtp.trim()) {
      setCreateKtpError("Nomor KTP harus diisi");
      isValid = false;
    }
    if (!createNama.trim()) {
      setCreateNamaError("Nama harus diisi");
      isValid = false;
    }
    if (!createAlamat.trim()) {
      setCreateAlamatError("Alamat harus diisi");
      isValid = false;
    }
    if (!createTelepon.trim()) {
      setCreateTeleponError("Nomor telepon harus diisi");
      isValid = false;
    }
    if (!createFotoKtp) {
      setCreateFotoKtpError("Foto KTP harus diunggah");
      isValid = false;
    }

    return isValid;
  };

  const validateUpdateForm = () => {
    let isValid = true;
    setUpdateEmailError("");
    setUpdateNamaError("");
    setUpdateAlamatError("");
    setUpdateTeleponError("");

    if (!updateEmail.trim()) {
      setUpdateEmailError("Email harus diisi");
      isValid = false;
    }
    if (!updateNama.trim()) {
      setUpdateNamaError("Nama harus diisi");
      isValid = false;
    }
    if (!updateAlamat.trim()) {
      setUpdateAlamatError("Alamat harus diisi");
      isValid = false;
    }
    if (!updateTelepon.trim()) {
      setUpdateTeleponError("Nomor telepon harus diisi");
      isValid = false;
    }

    return isValid;
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateCreateForm()) {
      return;
    }

    setIsCreateLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await createPenitip(formData, token);

      if (res.data) {
        toast.success("Penitip berhasil ditambahkan!");
        mutate();
        onCloseCreateModal();
      } else {
        toast.error("Gagal menambahkan penitip: " + res.errors);
      }
    } catch (error: unknown) {
      toast.error("Terjadi kesalahan saat menambahkan penitip.");
      console.error("Error creating penitip:", error);
    } finally {
      setIsCreateLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPenitip) return;

    if (!validateUpdateForm()) {
      return;
    }

    setIsUpdateLoading(true);

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
        toast.success("Penitip berhasil diperbarui!");
        mutate();
        onCloseModal();
      } else {
        toast.error("Gagal memperbarui penitip.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memperbarui penitip.");
      console.error("Error updating penitip:", error);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleCreateEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateEmail(e.target.value);
    if (e.target.value.trim()) setCreateEmailError("");
  };

  const handleCreatePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCreatePassword(e.target.value);
    if (e.target.value.length >= 8) setCreatePasswordError("");
  };

  const handleCreateConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCreateConfirmPassword(e.target.value);
    if (e.target.value === createPassword) setCreateConfirmPasswordError("");
  };

  const handleCreateKtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateKtp(e.target.value);
    if (e.target.value.trim()) setCreateKtpError("");
  };

  const handleCreateNamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateNama(e.target.value);
    if (e.target.value.trim()) setCreateNamaError("");
  };

  const handleCreateAlamatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateAlamat(e.target.value);
    if (e.target.value.trim()) setCreateAlamatError("");
  };

  const handleCreateTeleponChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCreateTelepon(e.target.value);
    if (e.target.value.trim()) setCreateTeleponError("");
  };

  const handleCreateFotoKtpChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setCreateFotoKtp(file);
    if (file) setCreateFotoKtpError("");
  };

  const handleUpdateEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateEmail(e.target.value);
    if (e.target.value.trim()) setUpdateEmailError("");
  };

  const handleUpdateNamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateNama(e.target.value);
    if (e.target.value.trim()) setUpdateNamaError("");
  };

  const handleUpdateAlamatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateAlamat(e.target.value);
    if (e.target.value.trim()) setUpdateAlamatError("");
  };

  const handleUpdateTeleponChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUpdateTelepon(e.target.value);
    if (e.target.value.trim()) setUpdateTeleponError("");
  };

  return (
    <div className="flex">
      <Toaster position="top-center" reverseOrder={false} />
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
                value={createEmail}
                onChange={handleCreateEmailChange}
                className={createEmailError ? "border-red-700" : ""}
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
                name="nomor_ktp"
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
                name="nomor_telepon"
                placeholder="Masukkan nomor telepon"
                required
              />
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              <Button
                type="submit"
                className="mt-2 rounded-[0.5rem] bg-[#72C678] text-white font-semibold hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300 w-full"
              >
                Tambah Penitip
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
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
              className="p-3 rounded-[0.5rem] bg-[#72C678] text-white font-semibold hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300"
            >
              <HiSearch />
            </button>
          </form>
          <Button
            onClick={() => setOpenCreateModal(true)}
            className="rounded-[0.5rem] bg-[#72C678] text-white font-semibold hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300"
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
