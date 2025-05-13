"use client";

import SideBar from "@/components/owner/sidebar";
import { getAllListRequestDonasi } from "@/lib/api/request-donasi.api";
import { getToken } from "@/lib/auth/auth";
import { RequestDonasi } from "@/lib/interface/request-donasi.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useState, useMemo } from "react";
import useSWR from "swr";

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getAllListRequestDonasi(params, token);

export default function RequestDonasiMaster() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  // const [token, setToken] = useState("");
  const token = getToken() || "";

  const searchQuery = "MENUNGGU";
  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    return params;
  }, [page, limit]);

  // ini nanti diganti sama token yang di session
  
      
  // ini penting
  const { data, error, isLoading } = useSWR(
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

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A"; // Handle missing dates
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  // console.log(data);
  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 p-4 ml-64">
        <h1 className="text-4xl font-bold mt-12 mb-4">Data Request Donasi</h1>
        <div className="flex justify-between items-center my-5">
        </div>
        <div className="w-full overflow-x-auto">
          <Table hoverable className="w-full border-1">
            <TableHead>
              <TableRow>
                <TableHeadCell>No.</TableHeadCell>
                <TableHeadCell>Nama Organisasi</TableHeadCell>
                <TableHeadCell>Deskripsi</TableHeadCell>
                <TableHeadCell>Tanggal</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
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
                data[0].map((requestDonasi: RequestDonasi, index: number) => (
                  <TableRow
                    key={requestDonasi.id_request}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell>{(page - 1) * limit + index + 1}.</TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {requestDonasi.nama_organisasi}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {requestDonasi.deskripsi}
                    </TableCell>
                    <TableCell>
                      {formatDate(requestDonasi.tanggal_request)}
                    </TableCell>
                    <TableCell>{requestDonasi.status}</TableCell>
                    <TableCell>
                      <a
                        href={`/owner/beri-donasi/${requestDonasi.id_organisasi}?request=${requestDonasi.id_request}`}
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                      >
                        Donasi
                      </a>
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
      </div>
    </div>
  );
}
