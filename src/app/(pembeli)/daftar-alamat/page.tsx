"use client";

import {
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Button,
  Select,
} from "flowbite-react";
import { Alamat } from "@/lib/interface/alamat.interface";
import {
  createAlamat,
  deleteAlamat,
  getListAlamat,
  updateAlamat,
} from "@/lib/api/alamat.api";
import { useState, useMemo, useEffect } from "react";
import { HiSearch } from "react-icons/hi";
import useSWR from "swr";
import { useUser } from "@/hooks/use-user";
import toast from "react-hot-toast";

interface Wilayah {
  id: string;
  name: string;
  province_id?: string;
  regency_id?: string;
}

export default function DaftarAlamat() {
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlamat, setSelectedAlamat] = useState<Alamat | null>(null);
  const [kabupatenList, setKabupatenList] = useState<Wilayah[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Wilayah[]>([]);
  const [kelurahanList, setKelurahanList] = useState<Wilayah[]>([]);
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedKelurahan, setSelectedKelurahan] = useState("");
  const [editJalan, setEditJalan] = useState("");
  const [editKelurahan, setEditKelurahan] = useState("");
  const [editKecamatan, setEditKecamatan] = useState("");
  const [editKabupaten, setEditKabupaten] = useState("");
  const currentUser = useUser();

  // Fungsi untuk mengubah format ke title case per kata
  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Validasi input jalan tidak mengandung koma
  const validateJalan = (jalan: string) => {
    if (jalan.includes(",")) {
      toast.error("Input jalan tidak boleh mengandung koma.");
      return false;
    }
    return true;
  };

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({});
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    return params;
  }, [searchQuery]);

  const fetcher = async ([queryParams, token]: [URLSearchParams, string]) => {
    if (!token) return null;
    return await getListAlamat(queryParams, token);
  };

  const { data, error, isLoading, mutate } = useSWR(
    [queryParams, currentUser !== null ? currentUser.token : null],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Fetch kabupaten for Yogyakarta (ID: 34)
  const fetchKabupaten = async () => {
    try {
      const response = await fetch(
        "https://staryone.github.io/api-wilayah-indonesia/api/regencies/34.json"
      );
      const data = await response.json();
      // Format nama kabupaten ke title case
      const formattedData = data.map((kab: Wilayah) => ({
        ...kab,
        name: toTitleCase(kab.name),
      }));
      setKabupatenList(formattedData);
    } catch {
      toast.error("Gagal memuat data kabupaten.");
    }
  };

  // Fetch kecamatan based on selected kabupaten
  const fetchKecamatan = async (kabupatenId: string) => {
    try {
      const response = await fetch(
        `https://staryone.github.io/api-wilayah-indonesia/api/districts/${kabupatenId}.json`
      );
      const data = await response.json();
      // Format nama kecamatan ke title case
      const formattedData = data.map((kec: Wilayah) => ({
        ...kec,
        name: toTitleCase(kec.name),
      }));
      setKecamatanList(formattedData);
    } catch {
      toast.error("Gagal memuat data kecamatan.");
    }
  };

  // Fetch kelurahan based on selected kecamatan
  const fetchKelurahan = async (kecamatanId: string) => {
    try {
      const response = await fetch(
        `https://staryone.github.io/api-wilayah-indonesia/api/villages/${kecamatanId}.json`
      );
      const data = await response.json();
      // Format nama kelurahan ke title case
      const formattedData = data.map((kel: Wilayah) => ({
        ...kel,
        name: toTitleCase(kel.name),
      }));
      setKelurahanList(formattedData);
    } catch {
      toast.error("Gagal memuat data kelurahan.");
    }
  };

  useEffect(() => {
    fetchKabupaten();
  }, []);

  useEffect(() => {
    if (selectedKabupaten) {
      fetchKecamatan(selectedKabupaten);
      setSelectedKecamatan("");
      setKelurahanList([]);
    }
  }, [selectedKabupaten]);

  useEffect(() => {
    if (selectedKecamatan) {
      fetchKelurahan(selectedKecamatan);
    }
  }, [selectedKecamatan]);

  // Initialize edit form with selected alamat data
  useEffect(() => {
    if (selectedAlamat && openModal) {
      const details = selectedAlamat.detail_alamat.split(", ");
      setEditJalan(details[0] || "");
      setEditKelurahan(details[1] ? toTitleCase(details[1]) : "");
      setEditKecamatan(details[2] ? toTitleCase(details[2]) : "");
      setEditKabupaten(details[3] ? toTitleCase(details[3]) : "");

      // Find kabupaten ID and fetch kecamatan
      const kabupaten = kabupatenList.find(
        (k) => k.name === toTitleCase(details[3] || "")
      )?.id;
      if (kabupaten) {
        setSelectedKabupaten(kabupaten);
      }
    }
  }, [selectedAlamat, openModal, kabupatenList]);

  // Handle kecamatan selection for edit form
  useEffect(() => {
    if (
      selectedAlamat &&
      openModal &&
      selectedKabupaten &&
      kecamatanList.length > 0
    ) {
      const details = selectedAlamat.detail_alamat.split(", ");
      const kecamatan = kecamatanList.find(
        (k) => k.name === toTitleCase(details[2] || "")
      )?.id;
      if (kecamatan) {
        setSelectedKecamatan(kecamatan);
      }
    }
  }, [selectedAlamat, openModal, selectedKabupaten, kecamatanList]);

  // Handle kelurahan selection for edit form
  useEffect(() => {
    if (
      selectedAlamat &&
      openModal &&
      selectedKecamatan &&
      kelurahanList.length > 0
    ) {
      const details = selectedAlamat.detail_alamat.split(", ");
      const kelurahan = kelurahanList.find(
        (k) => k.name === toTitleCase(details[1] || "")
      )?.id;
      if (kelurahan) {
        setSelectedKelurahan(kelurahan);
      }
    }
  }, [selectedAlamat, openModal, selectedKecamatan, kelurahanList]);

  function onCloseModal() {
    setOpenModal(false);
    setSelectedAlamat(null);
    setSelectedKabupaten("");
    setSelectedKecamatan("");
    setSelectedKelurahan("");
    setEditJalan("");
    setEditKelurahan("");
    setEditKecamatan("");
    setEditKabupaten("");
  }

  function onCloseDeleteModal() {
    setOpenDeleteModal(false);
    setSelectedAlamat(null);
  }

  function onCloseCreateModal() {
    setOpenCreateModal(false);
    setSelectedKabupaten("");
    setSelectedKecamatan("");
    setSelectedKelurahan("");
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search-alamat") as string;
    setSearchQuery(search);
  };

  const handleEdit = (alamat: Alamat) => {
    setSelectedAlamat(alamat);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    if (!selectedAlamat) return;

    try {
      const res = await deleteAlamat(
        selectedAlamat.id_alamat,
        currentUser?.token
      );

      if (res.data) {
        mutate();
        toast.success("Alamat berhasil dihapus.");
        onCloseDeleteModal();
      } else {
        toast.error("Gagal menghapus alamat.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menghapus alamat.");
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const createData = new FormData();

    if (formData.get("nama")) {
      createData.set("nama_alamat", formData.get("nama") as string);
    }

    const jalan = formData.get("jalan") as string;
    if (!validateJalan(jalan)) return;

    const kelurahan =
      kelurahanList.find((k) => k.id === selectedKelurahan)?.name || "";
    const kecamatan =
      kecamatanList.find((k) => k.id === selectedKecamatan)?.name || "";
    const kabupaten =
      kabupatenList.find((k) => k.id === selectedKabupaten)?.name || "";
    const detailAlamat = [
      jalan,
      kelurahan,
      kecamatan,
      kabupaten,
      "DI Yogyakarta",
    ]
      .filter(Boolean)
      .join(", ");

    if (detailAlamat) {
      createData.set("detail_alamat", detailAlamat);
    }

    try {
      const res = await createAlamat(createData, currentUser?.token);
      if (res.data) {
        mutate();
        toast.success("Alamat berhasil ditambahkan.");
        onCloseCreateModal();
      } else {
        toast.error("Gagal menambahkan alamat.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menambahkan alamat.");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAlamat) return;

    const formData = new FormData(e.currentTarget);
    const updateData = new FormData();

    if (formData.get("nama")) {
      updateData.set("nama_alamat", formData.get("nama") as string);
    }

    const jalan = formData.get("jalan") as string;
    if (!validateJalan(jalan)) return;

    const kelurahan =
      kelurahanList.find((k) => k.id === selectedKelurahan)?.name ||
      editKelurahan;
    const kecamatan =
      kecamatanList.find((k) => k.id === selectedKecamatan)?.name ||
      editKecamatan;
    const kabupaten =
      kabupatenList.find((k) => k.id === selectedKabupaten)?.name ||
      editKabupaten;
    const detailAlamat = [
      jalan,
      kelurahan,
      kecamatan,
      kabupaten,
      "DI Yogyakarta",
    ]
      .filter(Boolean)
      .join(", ");

    if (detailAlamat) {
      updateData.set("detail_alamat", detailAlamat);
    }

    try {
      const res = await updateAlamat(
        selectedAlamat.id_alamat,
        updateData,
        currentUser?.token
      );

      if (res.data) {
        mutate();
        toast.success("Alamat berhasil diperbarui.");
        onCloseModal();
      } else {
        toast.error("Gagal memperbarui alamat.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat memperbarui alamat.");
    }
  };

  const handleUpdateDefault = async (alamat: Alamat) => {
    const updateData = new FormData();
    updateData.set("status_default", "true");

    try {
      const res = await updateAlamat(
        alamat.id_alamat,
        updateData,
        currentUser?.token
      );

      if (res.data) {
        mutate();
        toast.success("Alamat utama berhasil diperbarui.");
      } else {
        toast.error("Gagal memperbarui alamat utama.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat memperbarui alamat utama.");
    } finally {
      setSelectedAlamat(null);
    }
  };

  const sortedData = data
    ? [...data].sort((a, b) => {
        if (a.status_default && !b.status_default) return -1;
        if (!a.status_default && b.status_default) return 1;
        return a.nama_alamat.localeCompare(b.nama_alamat);
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50 px-6 pb-10 pt-26">
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <form className="space-y-6" onSubmit={handleUpdate}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Data Alamat
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nama" className="text-gray-800 font-semibold">
                  Label Alamat
                </Label>
              </div>
              <TextInput
                id="nama"
                name="nama"
                defaultValue={selectedAlamat?.nama_alamat}
                required
                className="border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="jalan" className="text-gray-800 font-semibold">
                  Jalan
                </Label>
              </div>
              <TextInput
                id="jalan"
                name="jalan"
                defaultValue={editJalan}
                required
                className="border-gray-200 rounded-xl"
                placeholder="Contoh: Jalan Merdeka No. 20"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="kabupaten"
                  className="text-gray-800 font-semibold"
                >
                  Kabupaten
                </Label>
              </div>
              <Select
                id="kabupaten"
                name="kabupaten"
                value={selectedKabupaten}
                onChange={(e) => setSelectedKabupaten(e.target.value)}
                required
                className="border-gray-200 rounded-xl"
              >
                <option value="">Pilih Kabupaten</option>
                {kabupatenList.map((kab) => (
                  <option key={kab.id} value={kab.id}>
                    {kab.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="kecamatan"
                  className="text-gray-800 font-semibold"
                >
                  Kecamatan
                </Label>
              </div>
              <Select
                id="kecamatan"
                name="kecamatan"
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
                required
                className="border-gray-200 rounded-xl"
                disabled={!selectedKabupaten}
              >
                <option value="">Pilih Kecamatan</option>
                {kecamatanList.map((kec) => (
                  <option key={kec.id} value={kec.id}>
                    {kec.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="kelurahan"
                  className="text-gray-800 font-semibold"
                >
                  Kelurahan
                </Label>
              </div>
              <Select
                id="kelurahan"
                name="kelurahan"
                value={selectedKelurahan}
                onChange={(e) => setSelectedKelurahan(e.target.value)}
                required
                className="border-gray-200 rounded-xl"
                disabled={!selectedKecamatan}
              >
                <option value="">Pilih Kelurahan</option>
                {kelurahanList.map((kel) => (
                  <option key={kel.id} value={kel.id}>
                    {kel.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-[#72C678] rounded-xl hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300 font-semibold"
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
            <h3 className="mb-5 text-lg font-semibold text-gray-800">
              Apakah Anda yakin ingin menghapus data ini?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={onCloseDeleteModal}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-xl hover:bg-red-700 font-semibold"
              >
                Hapus
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        show={openCreateModal}
        size="md"
        onClose={onCloseCreateModal}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <form className="space-y-6" onSubmit={handleCreate}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Tambah Alamat Baru
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nama" className="text-gray-800 font-semibold">
                  Label Alamat
                </Label>
              </div>
              <TextInput
                id="nama"
                name="nama"
                placeholder="Contoh: Rumah, Kos, Kantor"
                required
                className="border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="jalan" className="text-gray-800 font-semibold">
                  Jalan
                </Label>
              </div>
              <TextInput
                id="jalan"
                name="jalan"
                placeholder="Contoh: Jalan Merdeka No. 20"
                required
                className="border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="kabupaten"
                  className="text-gray-800 font-semibold"
                >
                  Kabupaten
                </Label>
              </div>
              <Select
                id="kabupaten"
                name="kabupaten"
                value={selectedKabupaten}
                onChange={(e) => setSelectedKabupaten(e.target.value)}
                required
                className="border-gray-200 rounded-xl"
              >
                <option value="">Pilih Kabupaten</option>
                {kabupatenList.map((kab) => (
                  <option key={kab.id} value={kab.id}>
                    {kab.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="kecamatan"
                  className="text-gray-800 font-semibold"
                >
                  Kecamatan
                </Label>
              </div>
              <Select
                id="kecamatan"
                name="kecamatan"
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
                required
                className="border-gray-200 rounded-xl"
                disabled={!selectedKabupaten}
              >
                <option value="">Pilih Kecamatan</option>
                {kecamatanList.map((kec) => (
                  <option key={kec.id} value={kec.id}>
                    {kec.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="kelurahan"
                  className="text-gray-800 font-semibold"
                >
                  Kelurahan
                </Label>
              </div>
              <Select
                id="kelurahan"
                name="kelurahan"
                value={selectedKelurahan}
                onChange={(e) => setSelectedKelurahan(e.target.value)}
                required
                className="border-gray-200 rounded-xl"
                disabled={!selectedKecamatan}
              >
                <option value="">Pilih Kelurahan</option>
                {kelurahanList.map((kel) => (
                  <option key={kel.id} value={kel.id}>
                    {kel.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="px-4 py-2 text-white bg-[#72C678] rounded-xl hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300 font-semibold"
              >
                Tambah Alamat
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Daftar Alamat</h1>
        <div className="flex justify-between mb-4">
          <form className="flex gap-3" onSubmit={handleSearch}>
            <input
              type="text"
              name="search-alamat"
              id="search-alamat"
              className="border border-gray-200 rounded-xl p-2 w-72 text-gray-700"
              placeholder="Cari alamat"
            />
            <button
              type="submit"
              className="p-2 bg-[#72C678] text-white rounded-xl hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300"
            >
              <HiSearch />
            </button>
          </form>
          <Button
            onClick={() => setOpenCreateModal(true)}
            className="px-4 py-2 text-white bg-[#72C678] rounded-xl hover:bg-gradient-to-r hover:from-[#72C678] hover:to-[#008E6D] transition-all duration-300 font-semibold"
          >
            Tambah Alamat
          </Button>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-8">
          {isLoading ? (
            <div className="text-gray-700">Loading...</div>
          ) : error ? (
            <div className="text-gray-700">Error memuat data</div>
          ) : sortedData && sortedData.length > 0 ? (
            sortedData.map((alamat: Alamat) => (
              <div
                className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-3"
                key={alamat.id_alamat}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {alamat.nama_alamat}
                  </h3>
                  {alamat.status_default ? (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                      Utama
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
                <p className="text-gray-700">{alamat.detail_alamat}</p>
                <hr className="mt-3 border-gray-200" />
                <div className="flex gap-5 mt-2">
                  <button
                    className="text-[#72C678] hover:text-[#008E6D] font-semibold"
                    onClick={() => handleEdit(alamat)}
                  >
                    Edit
                  </button>
                  {!alamat.status_default ? (
                    <button
                      className="text-red-600 hover:text-red-700 font-semibold"
                      onClick={() => {
                        setSelectedAlamat(alamat);
                        setOpenDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  ) : (
                    <></>
                  )}
                  {!alamat.status_default ? (
                    <button
                      className="text-[#72C678] hover:text-[#008E6D] font-semibold"
                      onClick={() => handleUpdateDefault(alamat)}
                    >
                      Jadikan alamat utama
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-700">Tidak ada data</div>
          )}
        </div>
      </div>
    </div>
  );
}
