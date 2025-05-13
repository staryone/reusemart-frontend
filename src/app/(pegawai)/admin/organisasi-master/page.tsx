"use client";

import SideBar from "@/components/admin/sidebar";
import {
  deleteOrganisasi,
  getListOrganisasi,
  updateOrganisasi,
} from "@/lib/api/organisasi.api";
import { getToken } from "@/lib/auth/auth";
import { Organisasi } from "@/lib/interface/organisasi.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Textarea,
} from "flowbite-react";
import {
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import { useState, useMemo } from "react";
import { HiSearch } from "react-icons/hi";
import useSWR from "swr";

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getListOrganisasi(params, token);

export default function OrganisasiMaster() {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrganisasi, setSelectedOrganisasi] = useState<Organisasi | null>(null);
  
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
    setSelectedOrganisasi(null);
  }

  function onCloseDeleteModal() {
    setOpenDeleteModal(false);
    setSelectedOrganisasi(null);
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search-organisasi") as string;
    setSearchQuery(search);
    setPage(1);
  };

  const handleEdit = (organisasi: Organisasi) => {
    setSelectedOrganisasi(organisasi);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    if (!selectedOrganisasi) return;

    try {
      const res = await deleteOrganisasi(selectedOrganisasi.id_organisasi, token);

      if (res) {
        mutate(); // Revalidate data after deletion
        onCloseDeleteModal();
      } else {
        console.error("Failed to delete organisasi");
      }
    } catch (error) {
      console.error("Error deleting organisasi:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrganisasi) return;

    const formData = new FormData(e.currentTarget);
    const updateData = new FormData();

    if (formData.get("nama")) {
      updateData.set("nama_organisasi", formData.get("nama") as string);
    }

    if (formData.get("email")) {
      updateData.set("email", formData.get("email") as string);
    }
    
    if (formData.get("alamat")) {
      updateData.set("alamat", formData.get("alamat") as string);
    }

    if (formData.get("telp")) {
      updateData.set("nomor_telepon", formData.get("telp") as string);
    }

    if (formData.get("desc")) {
      updateData.set("deskripsi", formData.get("desc") as string);
    }

    try {
      const res = await updateOrganisasi(
        selectedOrganisasi.id_organisasi,
        updateData,
        token
      );

      if (res) {
        mutate();
        onCloseModal();
      } else {
        console.error("Failed to update organisasi");
      }
    } catch (error) {
      console.error("Error updating organisasi:", error);
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
              Edit Data Organisasi
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nama">Nama Organisasi</Label>
              </div>
              <TextInput
                id="nama"
                name="nama"
                defaultValue={selectedOrganisasi?.nama_organisasi}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email">Email</Label>
              </div>
              <TextInput
                id="email"
                name="email"
                defaultValue={selectedOrganisasi?.email}
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
                defaultValue={selectedOrganisasi?.alamat}
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
                defaultValue={selectedOrganisasi?.nomor_telepon}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="desc">Deskripsi</Label>
              </div>
              <Textarea id='desc' name='desc' defaultValue={selectedOrganisasi?.deskripsi} required></Textarea>
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
      
      <SideBar />
      <div className="flex-1 p-4 ml-64">
        <h1 className="text-4xl font-bold mt-12 mb-4">Data Organisasi</h1>
        <div className="flex justify-between items-center my-5">
          <form className="flex gap-3" onSubmit={handleSearch}>
            <input
              type="text"
              name="search-organisasi"
              id="search-organisasi"
              className="border rounded-md p-2 w-72"
              placeholder="Cari organisasi"
            />
            <button
              type="submit"
              className="p-3 bg-blue-500 text-white rounded-md"
            >
              <HiSearch />
            </button>
          </form>
          
        </div>
        <div className="w-full overflow-x-auto">
          <Table hoverable className="w-full border-1">
            <TableHead>
              <TableRow>
                <TableHeadCell>No.</TableHeadCell>
                <TableHeadCell>ID</TableHeadCell>
                <TableHeadCell>Nama Organisasi</TableHeadCell>
                <TableHeadCell>Alamat</TableHeadCell>
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
                data[0].map((organisasi: Organisasi, index: number) => (
                  <TableRow
                    key={organisasi.id_organisasi}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell>{(page - 1) * limit + index + 1}.</TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {organisasi.id_organisasi}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {organisasi.nama_organisasi}
                    </TableCell>
                    <TableCell>{organisasi.alamat}</TableCell>
                    <TableCell>{organisasi.nomor_telepon}</TableCell>
                    <TableCell>
                      <button
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        onClick={() => handleEdit(organisasi)}
                      >
                        Edit
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          setSelectedOrganisasi(organisasi);
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