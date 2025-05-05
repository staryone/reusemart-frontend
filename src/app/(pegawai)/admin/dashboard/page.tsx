"use client";
type Pegawai = {
  id_pegawai: string;
  email: string;
  nama: string;
  nomor_telepon: string;
  komisi: number;
  tgl_lahir: string;
  jabatan: {
    id_jabatan: number;
    nama_jabatan: string;
  };
};

import SideBar from "@/components/admin/sidebar";
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
} from "flowbite-react";
import { useState, useEffect } from "react";
import { HiSearch } from "react-icons/hi";
// import { useRouter } from "next/navigation";

export default function PegawaiMaster() {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [data, setData] = useState<Pegawai[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);
  // const router = useRouter();

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
      });
      const res = await fetch(
        `http://localhost:3001/api/pegawai/lists?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUEVHQVdBSSIsImphYmF0YW4iOiJBZG1pbiIsImlhdCI6MTc0NjQyODcwNywiZXhwIjoxNzQ3MDMzNTA3fQ.MoeYbRjrD1aLqNv06-YGs1Ig4dYLrkXkVs953EjPmuQ`,
          },
        }
      );

      const json = await res.json();
      setData(json.data);
      setTotalItems(json.totalItems || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [page, searchQuery]);

  function onCloseModal() {
    setOpenModal(false);
    setSelectedPegawai(null);
    fetchData();
  }

  function onCloseDeleteModal() {
    setOpenDeleteModal(false);
    setSelectedPegawai(null);
    fetchData();
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
      const res = await fetch(
        `http://localhost:3001/api/pegawai/${selectedPegawai.id_pegawai}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUEVHQVdBSSIsImphYmF0YW4iOiJBZG1pbiIsImlhdCI6MTc0NjQyODcwNywiZXhwIjoxNzQ3MDMzNTA3fQ.MoeYbRjrD1aLqNv06-YGs1Ig4dYLrkXkVs953EjPmuQ`,
          },
        }
      );

      if (res.ok) {
        setTotalItems(totalItems - 1);
        onCloseDeleteModal();
      } else {
        console.error("Failed to delete pegawai");
      }
    } catch (error) {
      console.error("Error deleting pegawai:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPegawai) return;

    const formData = new FormData(e.currentTarget);
    const updateData = {
      id_pegawai: selectedPegawai.id_pegawai,
      nama: formData.get("nama") as string,
      email: formData.get("email") as string,
      nomor_telepon: formData.get("telp") as string,
      id_jabatan: parseInt(formData.get("jabatan") as string),
    };

    try {
      const res = await fetch(
        `http://localhost:3001/api/pegawai/${selectedPegawai.id_pegawai}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUEVHQVdBSSIsImphYmF0YW4iOiJBZG1pbiIsImlhdCI6MTc0NjQyODcwNywiZXhwIjoxNzQ3MDMzNTA3fQ.MoeYbRjrD1aLqNv06-YGs1Ig4dYLrkXkVs953EjPmuQ`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (res.ok) {
        const updatedPegawai = await res.json();
        setData(
          data.map((p) =>
            p.id_pegawai === updatedPegawai.id_pegawai ? updatedPegawai : p
          )
        );
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
      <SideBar />
      <div className="flex-1 p-4 ml-64">
        <h1 className="text-4xl font-bold mt-12 mb-4">Data Pegawai</h1>
        <form className="flex gap-3 my-5" onSubmit={handleSearch}>
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
              {data?.map((pegawai: Pegawai, index: number) => (
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
              ))}
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
