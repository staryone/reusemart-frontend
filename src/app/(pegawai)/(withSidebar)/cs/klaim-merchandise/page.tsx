"use client";

import { useUser } from "@/hooks/use-user";
import { getAllListRedeemMerch, updateRedeemMerch } from "@/lib/api/redeem-merch.api";

import { RedeemMerch } from "@/lib/interface/redeem-merch.interface";

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useState, useMemo } from "react";
import { HiSearch } from "react-icons/hi";
import useSWR from "swr";

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getAllListRedeemMerch(params, token);

export default function KlaimMerchandise() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMerch, setSelectedMerch] = useState<RedeemMerch | null>(null);

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
  }, [page, limit, searchQuery]);

  // ini nanti diganti sama token yang di session

  // ini penting
  const { data, error, isLoading, mutate } = useSWR([queryParams, token], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useMemo(() => {
    if (data && data[1] !== undefined) {
      setTotalItems(data[1]);
    }
  }, [data]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search-data") as string;
    setSearchQuery(search);
    setPage(1);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A"; // Handle missing dates
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const sortedData = useMemo(() => {
    if (data && data[0]?.length > 0) {
      return [...data[0]].sort((a: RedeemMerch, b: RedeemMerch) => {
        return (
          new Date(b.tanggal_redeem).getTime() -
          new Date(a.tanggal_redeem).getTime()
        );
      });
    }
    return data ? data[0] : [];
  }, [data]);

  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleOpenModal = (redeemMerch: RedeemMerch) => {
    setSelectedMerch(redeemMerch);
    setShowModal(true);
  };

  const handleConfirmClaim = async () => {
    if (!selectedMerch || !token) return;
    try {
      const formData = new FormData();

      formData.append("status", "SUDAH_DIAMBIL");
      await updateRedeemMerch(selectedMerch.id_redeem_merch, formData, token);
      setShowModal(false);
      setSelectedMerch(null);
      mutate(); // Refresh the data
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Gagal mengkonfirmasi klaim. Silakan coba lagi.");
    }
  };
  // console.log(data);
  return (
    <div className="flex">
      <div className="flex-1 p-4 ml-64">
        <h1 className="text-4xl font-bold mt-12 mb-4">Data Claim Merchandise</h1>
        <div className="flex justify-between items-center my-5">
          <form className="flex gap-3" onSubmit={handleSearch}>
            <input
              type="text"
              name="search-data"
              id="search-data"
              className="border rounded-md p-2 w-72"
              placeholder="Cari data"
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
                <TableHeadCell>Nama Pembeli</TableHeadCell>
                <TableHeadCell>Merchandise</TableHeadCell>
                <TableHeadCell>Jumlah</TableHeadCell>
                <TableHeadCell>Tanggal Claim</TableHeadCell>
                <TableHeadCell>
                  <span className="sr-only">Claim Merch</span>
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
              ) : data && sortedData.length > 0 ? (
                sortedData.map((redeemMerch: RedeemMerch, index: number) => (
                  <TableRow
                    key={redeemMerch.id_redeem_merch}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell>{(page - 1) * limit + index + 1}.</TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {redeemMerch.pembeli.nama}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {redeemMerch.merchandise.nama_merch}
                    </TableCell>
                    <TableCell>{redeemMerch.jumlah_merch}</TableCell>
                    <TableCell>
                      {formatDate(redeemMerch.tanggal_redeem)}
                    </TableCell>
                    <TableCell>
                      {redeemMerch.status === "SUDAH_DIAMBIL"
                        ? "Sudah diambil"
                        : <button className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" onClick={() => handleOpenModal(redeemMerch)}>
                            Konfirmasi klaim
                          </button>}
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
        <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
          <ModalHeader>Konfirmasi Klaim Merchandise</ModalHeader>
          <ModalBody>
            <p>
              Apakah Anda yakin ingin mengkonfirmasi klaim untuk{" "}
              <strong>{selectedMerch?.merchandise.nama_merch}</strong> atas nama{" "}
              <strong>{selectedMerch?.pembeli.nama}</strong>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button color="blue" onClick={handleConfirmClaim}>
              Konfirmasi
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
