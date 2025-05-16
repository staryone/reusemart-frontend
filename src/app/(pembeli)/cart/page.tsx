"use client";
import Navbar from "@/components/utama/navbar";
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
import toast, { Toaster } from "react-hot-toast";
import { User } from "@/types/auth";

const fetcher = async (url: string): Promise<User | null> => {
  const response = await fetch(url, { method: "GET" });
  if (response.ok) {
    return await response.json();
  }
  return null;
};

export default function Cart() {
  const [page] = useState(1);
  const [limit] = useState(10);
  const [, setTotalItems] = useState(0);

  const { data: currentUser } = useSWR("/api/auth/me", fetcher);
  const token = currentUser ? currentUser.token : "";

  const queryParams = useMemo(() => {
    return new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
  }, [page, limit]);

  const { data, mutate } = useSWR<[Keranjang[], number]>(
    token ? [queryParams, token] : "",
    async ([queryParams, token]) => await getListKeranjang(queryParams, token)
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
  const handleSelectAll = useCallback(async () => {
    if (!data?.[0]) return;

    const newStatus = !allSelected;
    const updatePromises = data[0].map((item) =>
      updateStatusKeranjang(item.id_keranjang, token).then(() => ({
        ...item,
        is_selected: newStatus,
      }))
    );

    try {
      await Promise.all(updatePromises);
      toast.success(
        `Successfully ${newStatus ? "selected" : "deselected"} all items`
      );
      mutate();
    } catch (error) {
      toast.error("Failed to update selection status");
      console.error("Failed to update selection status:", error);
    }
  }, [allSelected, data, token, mutate]);

  // Handle select by penitip
  const handleSelectPenitip = useCallback(
    async (penitipId: number, items: Keranjang[]) => {
      const allSelectedInGroup = items.every((item) => item.is_selected);
      const newStatus = !allSelectedInGroup;

      const updatePromises = items.map((item) =>
        updateStatusKeranjang(item.id_keranjang, token).then(() => ({
          ...item,
          is_selected: newStatus,
        }))
      );

      try {
        await Promise.all(updatePromises);
        toast.success(
          `Successfully ${
            newStatus ? "selected" : "deselected"
          } items from penitip`
        );
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
    async (item: Keranjang) => {
      try {
        await updateStatusKeranjang(item.id_keranjang, token);
        toast.success(
          `Item ${item.is_selected ? "deselected" : "selected"} successfully`
        );
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
        toast.success("Item deleted successfully");
        mutate();
      } catch (error) {
        toast.error("Failed to delete item");
        console.error("Failed to delete item:", error);
      }
    },
    [token, mutate]
  );

  // Calculate subtotal
  const subtotal = useMemo(() => {
    if (!data?.[0]) return 0;
    return data[0]
      .filter((item) => item.is_selected)
      .reduce((sum, item) => sum + item.harga_barang, 0);
  }, [data]);

  return (
    <div className="overflow-x-hidden bg-gray-100 min-h-screen pb-40 pt-16">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
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
                onChange={() =>
                  handleSelectPenitip(Number(penitipId), group.items)
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
                  onChange={() => handleSelectItem(item)}
                />
                <div className="flex justify-between ml-5 w-full">
                  <Link
                    href={`/pages/product-details/${item.id_barang}`}
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
                    <div>{item.nama_barang}</div>
                  </Link>
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-xl font-semibold">
                      Rp{item.harga_barang.toLocaleString()}
                    </div>
                    <LucideTrash2
                      className="text-gray-500 cursor-pointer"
                      onClick={() => handleDelete(item.id_keranjang)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="p-8 bg-white rounded-2xl flex items-center justify-between fixed bottom-16 right-20 left-24 shadow-lg shadow-blue-600/50">
          <div className="flex flex-col">
            <div>Subtotal:</div>
            <div className="text-xl font-semibold">
              Rp{subtotal.toLocaleString()}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-7 py-2 rounded-lg hover:bg-white hover:border-2 hover:border-blue-600 hover:text-blue-600 transition"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
