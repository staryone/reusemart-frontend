"use client";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";
import Link from "next/link";
import { LucideTrash2 } from "lucide-react";
import useSWR from "swr";
import { useState, useMemo, useCallback } from "react";
import { Keranjang } from "@/lib/interface/keranjang.interface";
import {
  deleteKeranjang,
  getListKeranjang,
  updateStatusKeranjang,
} from "@/lib/api/keranjang.api";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/use-user";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";

const keranjangFetcher = async ([queryParams, token]: [
  URLSearchParams,
  string
]): Promise<[Keranjang[], number]> => {
  return await getListKeranjang(queryParams, token);
};

export default function Cart() {
  const [page] = useState(1);
  const [limit] = useState(10);
  const [, setTotalItems] = useState(0);
  const currentUser = useUser();
  const token = currentUser !== null ? currentUser.token : "";
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const queryParams: URLSearchParams = useMemo(() => {
    return new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
  }, [page, limit]);

  const { data, mutate } = useSWR<[Keranjang[], number]>(
    [queryParams, token],
    keranjangFetcher
  );

  useMemo(() => {
    if (data && data[1] !== undefined) {
      setTotalItems(data[1]);
    }
  }, [data]);

  // Group items by id_penitip
  const groupedItems = useMemo(() => {
    if (!data?.[0]) return {};
    return data[0].reduce((acc, item) => {
      if (!acc[item.id_penitip]) {
        acc[item.id_penitip] = {
          nama_penitip: item.nama_penitip,
          items: [],
        };
      }
      acc[item.id_penitip].items.push(item);
      return acc;
    }, {} as Record<number, { nama_penitip: string; items: Keranjang[] }>);
  }, [data]);

  // Check if all items are selected
  const allSelected = useMemo(() => {
    if (!data?.[0]) return false;
    return data[0].every((item) => item.is_selected);
  }, [data]);

  // Handle select all
  const handleSelectAll = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!data?.[0]) return;

      e.preventDefault();
      const newStatus = e.target.checked;
      const updateData = new FormData();
      updateData.set("is_selected", JSON.stringify(newStatus));

      const updatePromises = data[0].map((item) =>
        updateStatusKeranjang(item.id_keranjang, updateData, token).then(
          () => ({
            ...item,
            is_selected: newStatus,
          })
        )
      );

      try {
        await Promise.all(updatePromises);
        mutate();
      } catch (error) {
        toast.error("Failed to update selection status");
        console.error("Failed to update selection status:", error);
      }
    },
    [data, token, mutate]
  );

  // Handle select by penitip
  const handleSelectPenitip = useCallback(
    async (
      penitipId: number,
      items: Keranjang[],
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      e.preventDefault();
      const newStatus = e.target.checked;

      const updateData = new FormData();
      updateData.set("is_selected", JSON.stringify(newStatus));

      const updatePromises = items.map((item) =>
        updateStatusKeranjang(item.id_keranjang, updateData, token).then(
          () => ({
            ...item,
            is_selected: newStatus,
          })
        )
      );

      try {
        await Promise.all(updatePromises);
        mutate();
      } catch (error) {
        toast.error("Failed to update penitip selection");
        console.error("Failed to update penitip selection:", error);
      }
    },
    [token, mutate]
  );

  // Handle individual item selection
  const handleSelectItem = useCallback(
    async (item: Keranjang, e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const newStatus = e.target.checked;
      const updateData = new FormData();
      console.log(JSON.stringify(newStatus));
      updateData.set("is_selected", JSON.stringify(newStatus));
      try {
        const result = await updateStatusKeranjang(
          item.id_keranjang,
          updateData,
          token
        );
        if (result.errors) {
          toast.error(result.errors);
        }
        mutate();
      } catch (error) {
        toast.error("Failed to update item selection");
        console.error("Failed to update item selection:", error);
      }
    },
    [token, mutate]
  );

  // Handle delete item
  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteKeranjang(id, token);
        mutate();
        setShowDeleteModal(false);
        toast.success("Item deleted successfully");
      } catch (error) {
        toast.error("Failed to delete item");
        console.error("Failed to delete item:", error);
      }
    },
    [token, mutate]
  );

  // Handle opening delete modal
  const openDeleteModal = useCallback((id: number) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  }, []);

  // Handle closing delete modal
  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  }, []);

  // Calculate subtotal
  const subtotal = useMemo(() => {
    if (!data?.[0]) return 0;
    return data[0]
      .filter((item) => item.is_selected)
      .reduce((sum, item) => sum + item.harga_barang, 0);
  }, [data]);

  return (
    <div className="overflow-x-hidden bg-gray-100 min-h-screen pb-40 pt-16">
      <div className="overflow-x-hidden w-screen py-10 px-24">
        <h1 className="text-2xl font-bold mb-12">Keranjang</h1>
        <div className="p-8 bg-white rounded-2xl flex items-center">
          <input
            type="checkbox"
            name="chooseAll"
            id="chooseAll"
            className="w-5 h-5"
            checked={allSelected}
            onChange={handleSelectAll}
          />
          <label htmlFor="chooseAll" className="ml-5 font-bold">
            Pilih semua
          </label>
        </div>

        {Object.entries(groupedItems).map(([penitipId, group]) => (
          <div key={penitipId} className="p-8 bg-white rounded-2xl my-2">
            <div className="flex items-center mb-5">
              <input
                type="checkbox"
                name={`choosePenitip-${penitipId}`}
                id={`choosePenitip-${penitipId}`}
                className="w-5 h-5"
                checked={group.items.every((item) => item.is_selected)}
                onChange={(event) =>
                  handleSelectPenitip(Number(penitipId), group.items, event)
                }
              />
              <label
                htmlFor={`choosePenitip-${penitipId}`}
                className="ml-5 font-bold"
              >
                {group.nama_penitip}
              </label>
            </div>
            {group.items.map((item) => (
              <div key={item.id_keranjang} className="flex mb-4">
                <input
                  type="checkbox"
                  name={`chooseProduk-${item.id_keranjang}`}
                  id={`chooseProduk-${item.id_keranjang}`}
                  className="w-5 h-5"
                  checked={item.is_selected}
                  onChange={(event) => handleSelectItem(item, event)}
                />
                <div className="flex justify-between ml-5 w-full">
                  <Link
                    href={`/product-details/${item.id_barang}`}
                    className="flex gap-5"
                  >
                    <div className="w-18 h-18 relative">
                      <Image
                        src={item.gambar_barang}
                        alt={item.nama_barang}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="">{item.nama_barang}</div>
                      <div className="text-sm">{item.kategori_barang}</div>
                    </div>
                  </Link>
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-xl font-semibold">
                      Rp{item.harga_barang.toLocaleString()}
                    </div>
                    <LucideTrash2
                      className="text-gray-500 cursor-pointer"
                      onClick={() => openDeleteModal(item.id_keranjang)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        <Modal show={showDeleteModal} onClose={closeDeleteModal}>
          <ModalHeader>Konfirmasi Hapus</ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500">
                Apakah Anda yakin ingin menghapus item ini dari keranjang?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
                  onClick={closeDeleteModal}
                >
                  Batal
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => itemToDelete && handleDelete(itemToDelete)}
                >
                  Hapus
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <div className="p-8 bg-white rounded-2xl flex items-center justify-between fixed bottom-16 right-20 left-24 shadow-lg shadow-[#72C678]">
          <div className="flex flex-col">
            <div>Subtotal:</div>
            <div className="text-xl font-semibold">
              Rp{subtotal.toLocaleString()}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="bg-[#72C678] text-white px-7 py-2 rounded-lg hover:bg-white hover:border-2 hover:border-[#72C678] hover:text-[#72C678] transition"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
