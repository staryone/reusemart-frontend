"use client";

import {
  getRequestDonasi,
  getListRequestDonasi,
  getAllListRequestDonasi,
  createRequestDonasi,
  updateRequestDonasi,
  deleteRequestDonasi,
} from "@/lib/api/request-donasi.api";
import { RequestDonasi } from "@/lib/interface/request-donasi.interface";
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
  await getListRequestDonasi(params, token);

export default function RequestDonasiMaster() {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReqDonasi, setSelectedReqDonasi] =
    useState<RequestDonasi | null>(null);

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
    setSelectedReqDonasi(null);
  }

  function onCloseDeleteModal() {
    setOpenDeleteModal(false);
    setSelectedReqDonasi(null);
  }

  function onCloseCreateModal() {
    setOpenCreateModal(false);
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search-req-donasi") as string;
    setSearchQuery(search);
    setPage(1);
  };

  const handleEdit = (reqDonasi: RequestDonasi) => {
    setSelectedReqDonasi(reqDonasi);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    if (!selectedReqDonasi) return;

    try {
      const res = await deleteRequestDonasi(
        selectedReqDonasi.id_request,
        token
      );

      if (res) {
        mutate(); // Revalidate data after deletion
        onCloseDeleteModal();
      } else {
        console.error("Failed to delete request donasi");
      }
    } catch (error) {
      console.error("Error deleting request donasi:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedReqDonasi) return;

    const formData = new FormData(e.currentTarget);
    const updateData = new FormData();

    if (formData.get("deskripsi")) {
      updateData.set("deskripsi", formData.get("deskripsi") as string);
    }

    try {
      const res = await updateRequestDonasi(
        selectedReqDonasi.id_request,
        updateData,
        token
      );

      if (res) {
        mutate();
        onCloseModal();
      } else {
        console.error("Failed to update request donasi");
      }
    } catch (error) {
      console.error("Error updating request donasi:", error);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const createData = new FormData();

    if (formData.get("deskripsi")) {
      createData.set("deskripsi", formData.get("deskripsi") as string);
    }

    try {
      const res = await createRequestDonasi(createData, token);

      if (res) {
        mutate(); // Revalidate data after creation
        onCloseCreateModal();
      } else {
        console.error("Failed to create request donasi");
      }
    } catch (error) {
      console.error("Error creating request donasi:", error);
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
              Edit Request Donasi
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="deskripsi">Deskripsi</Label>
              </div>
              <TextInput
                id="deskripsi"
                name="deskripsi"
                defaultValue={selectedReqDonasi?.deskripsi}
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

      {/* <SideBar /> */}
      <div className="flex-1 p-4 ml-64">
        <h1 className="text-4xl font-bold mt-12 mb-4">Requst Donasi</h1>
        <div className="flex justify-between items-center my-5">
          <form className="flex gap-3" onSubmit={handleSearch}>
            <input
              type="text"
              name="search-req-donasi"
              id="search-req-donasi"
              className="border rounded-md p-2 w-72"
              placeholder="Cari request donasi"
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
                <TableHeadCell>Deskripsi</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
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
                data[0].map((reqDonasi: RequestDonasi, index: number) => (
                  <TableRow
                    key={reqDonasi.id_organisasi}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell>{(page - 1) * limit + index + 1}.</TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {reqDonasi.id_request}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {reqDonasi.deskripsi}
                    </TableCell>
                    <TableCell>{reqDonasi.status}</TableCell>
                    <TableCell>
                      <button
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        onClick={() => handleEdit(reqDonasi)}
                      >
                        Edit
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          setSelectedReqDonasi(reqDonasi);
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
