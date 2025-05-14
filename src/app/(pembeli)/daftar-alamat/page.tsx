"use client";

import Navbar from "@/components/utama/navbar";
import {
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Button,
} from "flowbite-react";
import { Alamat } from "@/lib/interface/alamat.interface";
import {
  createAlamat,
  deleteAlamat,
  getListAlamat,
  updateAlamat,
} from "@/lib/api/alamat.api";

import { useState, useMemo } from "react";
import { HiSearch } from "react-icons/hi";
import useSWR from "swr";
import { User } from "@/types/auth";

export default function ProfilePage() {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlamat, setSelectedAlamat] = useState<Alamat | null>(null);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({});
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    return params;
  }, [searchQuery]);

  const fetcherUser = async (url: string): Promise<User | null> => {
    const response = await fetch(url, { method: "GET" });
    if (response.ok) {
      return await response.json();
    }
    return null;
  };

  const { data: currentUser } = useSWR("/api/auth/me", fetcherUser);

  const fetcher = async ([params, token]: [URLSearchParams, string]) => {
    if (!token) return null;
    return await getListAlamat(params, token);
  };

  const { data, error, isLoading, mutate } = useSWR(
    [queryParams, currentUser ? currentUser.token : null],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  function onCloseModal() {
    setOpenModal(false);
    setSelectedAlamat(null);
  }

  function onCloseDeleteModal() {
    setOpenDeleteModal(false);
    setSelectedAlamat(null);
  }

  function onCloseCreateModal() {
    setOpenCreateModal(false);
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search-alamat") as string;
    setSearchQuery(search);
  };

  const handleEdit = (alamat: Alamat) => {
    setSelectedAlamat(alamat);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    if (!selectedAlamat) return;

    try {
      const res = await deleteAlamat(
        selectedAlamat.id_alamat,
        currentUser?.token
      );

      if (res) {
        mutate(); // Revalidate data after deletion
        onCloseDeleteModal();
      } else {
        console.error("Failed to delete alamat");
      }
    } catch (error) {
      console.error("Error deleting alamat:", error);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const createData = new FormData();

    if (formData.get("nama")) {
      createData.set("nama_alamat", formData.get("nama") as string);
    }

    if (formData.get("detail")) {
      createData.set("detail_alamat", formData.get("detail") as string);
    }
    try {
      const res = await createAlamat(createData, currentUser?.token);

      if (res) {
        mutate(); // Revalidate data after creation
        onCloseCreateModal();
      } else {
        console.error("Failed to create alamat");
      }
    } catch (error) {
      console.error("Error creating alamat:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAlamat) return;

    const formData = new FormData(e.currentTarget);
    const updateData = new FormData();

    if (formData.get("nama")) {
      updateData.set("nama_alamat", formData.get("nama") as string);
    }

    if (formData.get("detail")) {
      updateData.set("detail_alamat", formData.get("detail") as string);
    }

    try {
      const res = await updateAlamat(
        selectedAlamat.id_alamat,
        updateData,
        currentUser?.token
      );

      if (res) {
        mutate();
        onCloseModal();
      } else {
        console.error("Failed to update alamat");
      }
    } catch (error) {
      console.error("Error updating alamat:", error);
    }
  };
  const handleUpdateDefault = async (alamat: Alamat) => {
    const updateData = new FormData();

    updateData.set("status_default", "true");

    try {
      const res = await updateAlamat(
        alamat.id_alamat,
        updateData,
        currentUser?.token
      );

      if (res) {
        mutate();
      } else {
        console.error("Failed to update alamat");
      }
    } catch (error) {
      console.error("Error updating alamat:", error);
    } finally {
      setSelectedAlamat(null);
    }
  };
  const sortedData = data
    ? [...data].sort((a, b) => {
        if (a.status_default && !b.status_default) return -1;
        if (!a.status_default && b.status_default) return 1;
        return a.nama_alamat.localeCompare(b.nama_alamat);
      })
    : [];
  return (
    <div className="min-h-screen bg-gray-50 px-6 pb-10 pt-26 overflow-x-hidden">
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <form className="space-y-6" onSubmit={handleUpdate}>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Edit Data Alamat
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nama">Label Alamat</Label>
              </div>
              <TextInput
                id="nama"
                name="nama"
                defaultValue={selectedAlamat?.nama_alamat}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="detail">Detail Alamat</Label>
              </div>
              <TextInput
                id="detail"
                name="detail"
                defaultValue={selectedAlamat?.detail_alamat}
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
              Tambah Alamat Baru
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nama">Label Alamat</Label>
              </div>
              <TextInput
                id="nama"
                name="nama"
                placeholder="Contoh: Rumah, Kos, Kantor"
                required
              />
            </div>
            <div>
              <div className="mb-2 block ">
                <Label htmlFor="detail">Detail Alamat</Label>
              </div>
              <TextInput
                id="detail"
                name="detail"
                placeholder="Contoh: Jalan Merdeka, No. 20, Caturtunggal, Depok, Sleman"
                required
              />
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              <Button
                type="submit"
                className="px-4 py-2 text-white bg-[#1980e6] hover:bg-[#1980e6]/80 "
              >
                Tambah Alamat
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
      <Navbar />
      <div className="overflow-x-hidden w-screen px-24">
        <h1 className="text-2xl font-bold mb-8">Daftar Alamat</h1>
        <div className="flex justify-between">
          <form className="flex gap-3 mb-4" onSubmit={handleSearch}>
            <input
              type="text"
              name="search-alamat"
              id="search-alamat"
              className="border rounded-md p-2 w-72"
              placeholder="Cari alamat"
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
            Tambah Alamat
          </Button>
        </div>
        <div className="bg-white rounded-2xl p-8">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error memuat data</div>
          ) : sortedData && sortedData.length > 0 ? (
            sortedData.map((alamat: Alamat) => (
              <div
                className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-3"
                key={alamat.id_alamat}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {alamat.nama_alamat}
                  </h3>
                  {alamat.status_default ? (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                      Utama
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
                <p className="text-gray-700">{alamat.detail_alamat}</p>
                <hr className=" mt-3" />
                <div className="flex gap-5 mt-2">
                  <button
                    className="text-cyan-600 hover:underline "
                    onClick={() => handleEdit(alamat)}
                  >
                    Edit
                  </button>
                  {!alamat.status_default ? (
                    <button
                      className="text-red-600 hover:underline "
                      onClick={() => {
                        setSelectedAlamat(alamat);
                        setOpenDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  ) : (
                    <></>
                  )}
                  {!alamat.status_default ? (
                    <button
                      className="text-cyan-600 hover:underline "
                      onClick={() => handleUpdateDefault(alamat)}
                    >
                      Jadikan alamat utama
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>Tidak ada data</div>
          )}
        </div>
      </div>
    </div>
  );
}
