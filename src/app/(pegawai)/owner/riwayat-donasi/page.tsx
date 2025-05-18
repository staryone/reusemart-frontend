"use client";

import { getAllListDonasi, updateDonasi } from "@/lib/api/donasi.api";
import { Donasi } from "@/lib/interface/donasi.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  TextInput,
  ModalFooter,
} from "flowbite-react";
import { HiArrowDown, HiArrowUp } from "react-icons/hi";
import { useState, useMemo } from "react";
import useSWR from "swr";
import { useUser } from "@/hooks/use-user";

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getAllListDonasi(params, token);

export default function RiwayatDonasi() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [openModal, setOpenModal] = useState(false);
  const [selectedDonasi, setSelectedDonasi] = useState<Donasi | null>(null);
  const [formData, setFormData] = useState({
    nama_penerima: "",
    tanggal_donasi: "",
  });
  const [formError, setFormError] = useState("");

  const currentUser = useUser();

  const token = currentUser !== null ? currentUser.token : "";

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return params;
  }, [page, limit]);

  const { data, error, isLoading, mutate } = useSWR(
    [queryParams, token],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const sortedData = useMemo(() => {
    if (!data || !data[0]) return [];
    return [...data[0]].sort((a, b) => {
      const dateA = new Date(a.tanggal_donasi).getTime();
      const dateB = new Date(b.tanggal_donasi).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [data, sortOrder]);

  useMemo(() => {
    if (data && data[1] !== undefined) {
      setTotalItems(data[1]);
    }
  }, [data]);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    setPage(1);
  };

  const handleEditClick = (donasi: Donasi) => {
    setSelectedDonasi(donasi);
    setFormData({
      nama_penerima: donasi.nama_penerima || "",
      tanggal_donasi: donasi.tanggal_donasi
        ? new Date(donasi.tanggal_donasi).toISOString().split("T")[0]
        : "",
    });
    setFormError("");
    setOpenModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.nama_penerima.trim()) {
      setFormError("Nama penerima is required");
      return false;
    }
    if (!formData.tanggal_donasi) {
      setFormError("Tanggal donasi is required");
      return false;
    }
    const date = new Date(formData.tanggal_donasi);
    if (isNaN(date.getTime())) {
      setFormError("Invalid date format");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async () => {
    if (!selectedDonasi || !validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_penerima", formData.nama_penerima);
      formDataToSend.append(
        "tanggal_donasi",
        new Date(formData.tanggal_donasi).toISOString()
      );

      await updateDonasi(selectedDonasi.id_donasi, formDataToSend, token);
      setOpenModal(false);
      mutate(); // Re-fetch data to reflect changes
    } catch (error) {
      setFormError("Failed to update donation: " + error);
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 p-4 ml-64">
        <h1 className="text-4xl font-bold mt-12 mb-4">Data Request Donasi</h1>
        <div className="w-full overflow-x-auto">
          <Table hoverable className="w-full border-1">
            <TableHead>
              <TableRow>
                <TableHeadCell>No.</TableHeadCell>
                <TableHeadCell>Barang</TableHeadCell>
                <TableHeadCell>Nama Organisasi</TableHeadCell>
                <TableHeadCell>Nama Penerima</TableHeadCell>
                <TableHeadCell className="flex justify-center items-center">
                  Tanggal
                  <button
                    onClick={handleSortToggle}
                    className="ml-2 text-lg hover:bg-gray-200 p-1 rounded-md"
                  >
                    {sortOrder === "desc" ? <HiArrowDown /> : <HiArrowUp />}
                  </button>
                </TableHeadCell>
                <TableHeadCell>
                  <span className="sr-only">Edit</span>
                </TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Error loading data
                  </TableCell>
                </TableRow>
              ) : data && sortedData.length > 0 ? (
                sortedData.map((donasi: Donasi, index: number) => (
                  <TableRow
                    key={donasi.id_donasi}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell>{(page - 1) * limit + index + 1}.</TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {donasi.barang.nama_barang}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {donasi.request.organisasi.nama_organisasi}
                    </TableCell>
                    <TableCell>{donasi.nama_penerima}</TableCell>
                    <TableCell>{formatDate(donasi.tanggal_donasi)}</TableCell>
                    <TableCell>
                      <button
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        onClick={() => handleEditClick(donasi)}
                      >
                        Edit
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
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

        {/* Edit Modal */}
        <Modal show={openModal} onClose={() => setOpenModal(false)} size="md">
          <ModalHeader>Edit Donasi</ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              {formError && <p className="text-red-500 text-sm">{formError}</p>}
              <div>
                <label
                  htmlFor="nama_penerima"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Nama Penerima
                </label>
                <TextInput
                  id="nama_penerima"
                  name="nama_penerima"
                  value={formData.nama_penerima}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="tanggal_donasi"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Tanggal Donasi
                </label>
                <TextInput
                  id="tanggal_donasi"
                  name="tanggal_donasi"
                  type="date"
                  value={formData.tanggal_donasi}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleFormSubmit}>Save</Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
