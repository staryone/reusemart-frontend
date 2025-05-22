"use client";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";
import Link from "next/link";
import { LucideTrash2 } from "lucide-react";
import useSWR from "swr";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Keranjang } from "@/lib/interface/keranjang.interface";
import {
  deleteKeranjang,
  getListKeranjang,
  updateStatusKeranjang,
} from "@/lib/api/keranjang.api";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/use-user";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const queryParams: URLSearchParams = useMemo(() => {
    return new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
  }, [page, limit]);

  const { data, error, isLoading, mutate } = useSWR<[Keranjang[], number]>(
    token ? [queryParams, token] : null,
    keranjangFetcher,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (data && data[1] !== undefined) {
      setTotalItems(data[1]);
    }
  }, [data]);

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

  const allSelected = useMemo(() => {
    if (!data?.[0] || data[0].length === 0) return false;
    return data[0].every((item) => item.is_selected);
  }, [data]);

  const handleSelectAll = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!data?.[0] || !token) return;

      const newStatus = e.target.checked;
      const updateData = new FormData();
      updateData.set("is_selected", JSON.stringify(newStatus));

      const previousData = data ? [...data[0]] : [];
      const updatedItemsOptimistic = data[0].map((item) => ({
        ...item,
        is_selected: newStatus,
      }));
      mutate([updatedItemsOptimistic, data[1]], false);

      try {
        const updatePromises = data[0].map((item) =>
          updateStatusKeranjang(item.id_keranjang, updateData, token)
        );
        await Promise.all(updatePromises);
      } catch (error) {
        toast.error("Gagal memperbarui status semua item.");
        console.error("Failed to update selection status:", error);
        mutate([previousData, data[1]], false);
      } finally {
        mutate();
      }
    },
    [data, token, mutate]
  );

  const handleSelectPenitip = useCallback(
    async (
      penitipId: number,
      itemsToUpdate: Keranjang[],
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      if (!itemsToUpdate.length || !token) return;

      const newStatus = e.target.checked;
      const updateData = new FormData();
      updateData.set("is_selected", JSON.stringify(newStatus));

      const previousData = data ? [...data[0]] : [];
      const updatedDataArray = data?.[0].map((cartItem) => {
        if (
          itemsToUpdate.some(
            (itemToUpdate) =>
              itemToUpdate.id_keranjang === cartItem.id_keranjang
          )
        ) {
          return { ...cartItem, is_selected: newStatus };
        }
        return cartItem;
      });
      mutate([updatedDataArray || [], data?.[1] || 0], false);

      try {
        const updatePromises = itemsToUpdate.map((item) =>
          updateStatusKeranjang(item.id_keranjang, updateData, token)
        );
        await Promise.all(updatePromises);
      } catch (error) {
        toast.error("Gagal memperbarui status pilihan penitip.");
        console.error("Failed to update penitip selection:", error);
        mutate([previousData, data?.[1] || 0], false);
      } finally {
        mutate();
      }
    },
    [data, token, mutate]
  );

  const handleSelectItem = useCallback(
    async (item: Keranjang, e: React.ChangeEvent<HTMLInputElement>) => {
      if (!token) return;
      const newStatus = e.target.checked;
      const updateData = new FormData();
      updateData.set("is_selected", JSON.stringify(newStatus));

      const previousData = data ? [...data[0]] : [];
      const updatedDataArray = data?.[0].map((cartItem) =>
        cartItem.id_keranjang === item.id_keranjang
          ? { ...cartItem, is_selected: newStatus }
          : cartItem
      );
      mutate([updatedDataArray || [], data?.[1] || 0], false);

      try {
        const result = await updateStatusKeranjang(
          item.id_keranjang,
          updateData,
          token
        );
        if (result.errors) {
          toast.error(String(result.errors));
          mutate([previousData, data?.[1] || 0], false);
        }
      } catch (error) {
        toast.error("Gagal memperbarui status item.");
        console.error("Failed to update item selection:", error);
        mutate([previousData, data?.[1] || 0], false);
      } finally {
        mutate();
      }
    },
    [data, token, mutate]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      if (!token) return;

      const previousData = data ? [...data[0]] : [];
      const updatedDataArray = data?.[0].filter(
        (item) => item.id_keranjang !== id
      );
      const newTotalItems = (data?.[1] || 0) - 1;
      mutate(
        [updatedDataArray || [], newTotalItems < 0 ? 0 : newTotalItems],
        false
      );

      try {
        await deleteKeranjang(id, token);
        setShowDeleteModal(false);
        toast.success("Item berhasil dihapus");
      } catch (error) {
        toast.error("Gagal menghapus item");
        console.error("Failed to delete item:", error);
        mutate([previousData, data?.[1] || 0], false);
      } finally {
        setItemToDelete(null);
        mutate();
      }
    },
    [data, token, mutate]
  );

  const openDeleteModal = useCallback((id: number) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  }, []);

  const subtotal = useMemo(() => {
    if (!data?.[0]) return 0;
    return data[0]
      .filter((item) => item.is_selected)
      .reduce((sum, item) => sum + item.harga_barang, 0);
  }, [data]);

  const handleProceedToCheckout = () => {
    if (!data?.[0]) {
      toast.error("Keranjang Anda kosong.");
      return;
    }
    const selectedItems = data[0].filter((item) => item.is_selected);

    if (selectedItems.length === 0) {
      toast.error("Pilih setidaknya satu item untuk checkout.");
      return;
    }

    try {
      localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));
      router.push("/checkout");
    } catch (e) {
      console.error("Gagal menyimpan item ke localStorage:", e);
      toast.error("Terjadi kesalahan saat memproses checkout.");
    }
  };

  return (
    <div className="overflow-x-hidden bg-gray-100 min-h-screen pb-40 pt-16">
      <div className="overflow-x-hidden w-screen py-10 px-4 md:px-12 lg:px-24">
        <h1 className="text-2xl font-bold mb-8 md:mb-12">Keranjang</h1>

        {(!data?.[0] || data[0].length === 0) && !isLoading ? (
          <div className="p-8 bg-white rounded-2xl text-center">
            <p className="text-gray-600 text-lg">
              Keranjang belanja Anda kosong.
            </p>
            <Link href="/" legacyBehavior>
              <a className="mt-4 inline-block bg-[#72C678] text-white px-6 py-2 rounded-lg hover:bg-[#5da060] transition">
                Mulai Belanja
              </a>
            </Link>
          </div>
        ) : isLoading && !data ? (
          <div className="text-center py-20">Memuat keranjang...</div>
        ) : error && !data ? (
          <div className="text-center py-20 text-red-500">
            Gagal memuat keranjang. Coba lagi nanti.
          </div>
        ) : !token ? (
          <div className="text-center py-20">
            Silakan login untuk melihat keranjang Anda.
          </div>
        ) : (
          data?.[0] && (
            <>
              <div className="p-4 md:p-8 bg-white rounded-2xl flex items-center">
                <input
                  type="checkbox"
                  name="chooseAll"
                  id="chooseAll"
                  className="w-5 h-5 accent-[#72C678]"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  disabled={!data?.[0] || data[0].length === 0}
                />
                <label
                  htmlFor="chooseAll"
                  className="ml-3 md:ml-5 font-bold text-sm md:text-base"
                >
                  Pilih semua ({data?.[0]?.length || 0} item)
                </label>
              </div>

              {Object.entries(groupedItems).map(([penitipId, group]) => (
                <div
                  key={penitipId}
                  className="p-4 md:p-8 bg-white rounded-2xl my-2"
                >
                  <div className="flex items-center mb-5">
                    <input
                      type="checkbox"
                      name={`choosePenitip-${penitipId}`}
                      id={`choosePenitip-${penitipId}`}
                      className="w-5 h-5 accent-[#72C678]"
                      checked={group.items.every((item) => item.is_selected)}
                      onChange={(event) =>
                        handleSelectPenitip(
                          Number(penitipId),
                          group.items,
                          event
                        )
                      }
                    />
                    <label
                      htmlFor={`choosePenitip-${penitipId}`}
                      className="ml-3 md:ml-5 font-bold text-sm md:text-base"
                    >
                      {group.nama_penitip}
                    </label>
                  </div>
                  {group.items.map((item) => (
                    <div
                      key={item.id_keranjang}
                      className="flex mb-4 items-start"
                    >
                      <input
                        type="checkbox"
                        name={`chooseProduk-${item.id_keranjang}`}
                        id={`chooseProduk-${item.id_keranjang}`}
                        className="w-5 h-5 mt-1 md:mt-2 accent-[#72C678]"
                        checked={item.is_selected}
                        onChange={(event) => handleSelectItem(item, event)}
                      />
                      <div className="flex flex-col md:flex-row justify-between ml-3 md:ml-5 w-full">
                        <Link
                          href={`/product-details/${item.id_barang}`}
                          className="flex gap-3 md:gap-5 mb-2 md:mb-0"
                        >
                          <div className="w-16 h-16 md:w-20 md:h-20 relative flex-shrink-0">
                            <Image
                              src={
                                item.gambar_barang || "/placeholder-image.jpg"
                              }
                              alt={item.nama_barang}
                              fill
                              style={{ objectFit: "cover" }}
                              className="rounded-xl"
                              sizes="(max-width: 768px) 64px, 80px"
                            />
                          </div>
                          <div className="flex flex-col">
                            <div className="text-sm md:text-base font-medium line-clamp-2">
                              {item.nama_barang}
                            </div>
                            <div className="text-xs md:text-sm text-gray-500">
                              {item.kategori_barang}
                            </div>
                          </div>
                        </Link>
                        <div className="flex flex-row md:flex-col items-end md:items-end justify-between md:justify-start w-full md:w-auto mt-2 md:mt-0">
                          <div className="text-base md:text-lg font-semibold text-gray-800 mb-0 md:mb-2">
                            Rp{item.harga_barang.toLocaleString()}
                          </div>
                          <LucideTrash2
                            className="text-gray-500 cursor-pointer hover:text-red-500 transition-colors"
                            size={20}
                            onClick={() => openDeleteModal(item.id_keranjang)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )
        )}

        <Modal show={showDeleteModal} onClose={closeDeleteModal} size="md">
          <ModalHeader>Konfirmasi Hapus</ModalHeader>
          <ModalBody>
            <div className="text-center">
              <LucideTrash2 className="mx-auto mb-4 h-14 w-14 text-gray-400" />
              <h3 className="mb-5 text-lg font-normal text-gray-500">
                Apakah Anda yakin ingin menghapus item ini dari keranjang?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                  onClick={() => {
                    if (itemToDelete !== null) {
                      handleDelete(itemToDelete);
                    }
                  }}
                >
                  Ya, Hapus
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300 border border-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100"
                  onClick={closeDeleteModal}
                >
                  Batal
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        {data?.[0] && data[0].length > 0 && (
          <div className="p-4 md:p-6 bg-white rounded-t-2xl md:rounded-2xl flex flex-col md:flex-row items-center justify-between fixed bottom-0 left-0 right-0 md:bottom-10 md:left-12 md:right-12 lg:left-24 lg:right-20 shadow-top md:shadow-lg md:shadow-[#72C678]/50 z-50">
            <div className="flex flex-col items-start md:items-end text-sm md:text-base mb-3 md:mb-0">
              <div>
                Subtotal ({data[0].filter((item) => item.is_selected).length}{" "}
                item):
              </div>
              <div className="text-lg md:text-xl font-semibold text-gray-800">
                Rp{subtotal.toLocaleString()}
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full md:w-auto bg-[#72C678] text-white px-6 py-2.5 md:px-7 md:py-3 rounded-lg font-semibold hover:bg-[#5da060] transition text-sm md:text-base"
                disabled={
                  (data?.[0]?.filter((item) => item.is_selected).length ||
                    0) === 0
                }
              >
                Checkout (
                {data?.[0]?.filter((item) => item.is_selected).length || 0})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
