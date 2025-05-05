"use client";

import SideBar from "@/app/components/SideBar";
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
import { useState } from "react";

import { HiSearch } from "react-icons/hi";

export default function PegawaiMaster() {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  function onCloseModal() {
    setOpenModal(false);
  }
  return (
    <div className="flex">
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Edit Data Pegawai
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nama">Nama Pegawai</Label>
              </div>
              <TextInput id="name" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="jabatan">Jabatan</Label>
              </div>
              <Select id="jabatan" required>
                <option value="">Pilih Jabatan</option>
                <option value="Owner">Owner</option>
                <option value="Admin">Admin</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Gudang">Gudang</option>
                <option value="Kurir">Kurir</option>
                <option value="Hunter">Hunter</option>
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email">Email</Label>
              </div>
              <TextInput id="email" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="telp">Nomor Telepon</Label>
              </div>
              <TextInput id="telp" required />
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              <a
                href="#"
                className="text-cyan-700 hover:underline dark:text-cyan-500"
              >
                Update Data
              </a>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        show={openDeleteModal}
        size="md"
        onClose={() => setOpenDeleteModal(false)}
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
                onClick={() => setOpenDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  // TODO: handle delete logic here
                  setOpenDeleteModal(false);
                }}
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
        <form className="flex gap-3 my-5">
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
              <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell>1.</TableCell>
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  Frendy
                </TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>fren@gmail.com</TableCell>
                <TableCell>08123123123</TableCell>
                <TableCell>
                  <button
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    onClick={() => setOpenModal(true)}
                  >
                    Edit
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => setOpenDeleteModal(true)}
                    className="font-medium text-red-600 hover:underline dark:text-red-500"
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
