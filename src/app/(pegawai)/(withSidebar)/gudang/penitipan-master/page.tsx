"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Label,
  FileInput,
  Select,
} from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { createPenitipan } from "@/lib/api/penitipan.api";

// import { DetailPenitipan } from "@/lib/interface/detail-penitipan.interface";
// import { Penitipan } from "@/lib/interface/penitipan.interface";
import { useUser } from "@/hooks/use-user";

// Form-specific interfaces
interface BarangFormData {
  prefix: string;
  nama_barang: string;
  deskripsi: string;
  harga: string;
  berat: string;
  id_kategori: string;
  garansi: string;
  gambar: File[];
}

interface PenitipanFormData {
  id_penitip: string;
  id_pegawai_qc: string;
  id_hunter: string;
}

type DetailPenitipanFormData = object

interface FormDataState {
  barangData: BarangFormData[];
  penitipanData: PenitipanFormData;
  detailPenitipanData: DetailPenitipanFormData[];
}

const categories = [
  { id: "1", name: "Elektronik & Gadget" },
  { id: "2", name: "Pakaian & Aksesori" },
  { id: "3", name: "Perabotan Rumah Tangga" },
  { id: "4", name: "Buku, Alat Tulis, & Peralatan Sekolah" },
  { id: "5", name: "Hobi, Mainan, & Koleksi" },
  { id: "6", name: "Peralengkapan Bayi & Anak" },
  { id: "7", name: "Otomotif & Aksesori" },
  { id: "8", name: "Peralengkapan Taman & Outdoor" },
  { id: "9", name: "Peralatan Kantor & Industri" },
  { id: "10", name: "Kosmetik & Perawatan Diri" },
];

interface FormErrors {
  [key: string]: string;
}

const computeTanggalAkhir = (tanggalMasuk: Date): string => {
  const tanggalAkhir = new Date(tanggalMasuk);
  tanggalAkhir.setDate(tanggalAkhir.getDate() + 30);
  return tanggalAkhir.toISOString();
};

const computeBatasAmbil = (tanggalAkhir: Date): string => {
  const batasAmbil = new Date(tanggalAkhir);
  batasAmbil.setDate(batasAmbil.getDate() + 7);
  return batasAmbil.toISOString();
};

export default function PenitipanMaster() {
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    barangData: [
      {
        prefix: "",
        nama_barang: "",
        deskripsi: "",
        harga: "",
        berat: "",
        id_kategori: "",
        garansi: "",
        gambar: [],
      },
    ],
    penitipanData: { id_penitip: "", id_pegawai_qc: "", id_hunter: "" },
    detailPenitipanData: [],
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const currentUser = useUser();

  const token = currentUser !== null ? currentUser.token : "";

  const onCloseCreateModal = (): void => {
    setOpenCreateModal(false);
    setCreateError(null);
    setCreateSuccess(null);
    setFormErrors({});
    setFormData({
      barangData: [
        {
          prefix: "",
          nama_barang: "",
          deskripsi: "",
          harga: "",
          berat: "",
          id_kategori: "",
          garansi: "",
          gambar: [],
        },
      ],
      penitipanData: { id_penitip: "", id_pegawai_qc: "", id_hunter: "" },
      detailPenitipanData: [{ tanggal_akhir: "", batas_ambil: "", tanggal_laku: "", isDiperpanjang: false }],
    });
  };

  const handleInputChange = (
    section: "barangData" | "penitipanData" | "detailPenitipanData",
    index: number,
    field: string,
    value: string | boolean
  ): void => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (section === "penitipanData") {
        newData.penitipanData = { ...newData.penitipanData, [field]: value };
      } else {
        newData[section][index] = { ...newData[section][index], [field]: value };
      }
      return newData;
    });
    setFormErrors((prev) => ({ ...prev, [`${section}_${index}_${field}`]: "" }));
  };

  const handleFileChange = (index: number, files: FileList | null): void => {
    const fileArray: File[] = files ? Array.from(files) : [];
    if (fileArray.length < 2) {
      setFormErrors((prev) => ({
        ...prev,
        [`barangData_${index}_gambar`]: "At least 2 images are required",
      }));
      return;
    }
    const validTypes = ["image/jpeg", "image/png"];
    const invalidFiles = fileArray.filter((file) => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        [`barangData_${index}_gambar`]: "Only JPEG and PNG images are allowed",
      }));
      return;
    }
    setFormData((prev) => {
      const newData = { ...prev };
      newData.barangData[index].gambar = fileArray;
      return newData;
    });
    setFormErrors((prev) => ({ ...prev, [`barangData_${index}_gambar`]: "" }));
  };

  const addBarang = (): void => {
    setFormData((prev) => ({
      ...prev,
      barangData: [
        ...prev.barangData,
        {
          prefix: "",
          nama_barang: "",
          deskripsi: "",
          harga: "",
          berat: "",
          id_kategori: "",
          garansi: "",
          gambar: [],
        },
      ],
      detailPenitipanData: [
        ...prev.detailPenitipanData,
      ],
    }));
  };

  const removeBarang = (index: number): void => {
    setFormData((prev) => {
      const newData = { ...prev };
      newData.barangData.splice(index, 1);
      newData.detailPenitipanData.splice(index, 1);
      return newData;
    });
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`barangData_${index}_`) || key.startsWith(`detailPenitipanData_${index}_`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    formData.barangData.forEach((barang, index) => {
      if (!barang.prefix || barang.prefix.length !== 1) {
        newErrors[`barangData_${index}_prefix`] = "Prefix must be a single character";
      }
      if (!barang.nama_barang) newErrors[`barangData_${index}_nama_barang`] = "Nama barang is required";
      if (!barang.deskripsi) newErrors[`barangData_${index}_deskripsi`] = "Deskripsi is required";
      if (!barang.harga || isNaN(Number(barang.harga)) || Number(barang.harga) <= 0) {
        newErrors[`barangData_${index}_harga`] = "Harga must be a positive number";
      }
      if (!barang.berat || isNaN(Number(barang.berat)) || Number(barang.berat) <= 0) {
        newErrors[`barangData_${index}_berat`] = "Berat must be a positive number";
      }
      if (!barang.id_kategori || isNaN(Number(barang.id_kategori)) || Number(barang.id_kategori) <= 0) {
        newErrors[`barangData_${index}_id_kategori`] = "ID Kategori must be a positive number";
      }
      if (barang.gambar.length < 2) {
        newErrors[`barangData_${index}_gambar`] = "At least 2 images are required";
      }
    });
    if (
      !formData.penitipanData.id_penitip ||
      isNaN(Number(formData.penitipanData.id_penitip)) ||
      Number(formData.penitipanData.id_penitip) <= 0
    ) {
      newErrors["penitipanData_0_id_penitip"] = "ID Penitip is required and must be a positive number";
    }
    if (
      !formData.penitipanData.id_pegawai_qc ||
      isNaN(Number(formData.penitipanData.id_pegawai_qc)) ||
      Number(formData.penitipanData.id_pegawai_qc) <= 0
    ) {
      newErrors["penitipanData_0_id_pegawai_qc"] =
        "ID Pegawai QC is required and must be a positive number";
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    if (!validateForm()) {
      return;
    }

    const tanggalMasuk = new Date(); 

    const tanggalAkhir = computeTanggalAkhir(tanggalMasuk); 

    const batasAmbil = computeBatasAmbil(new Date(tanggalAkhir)); 

    const formDataToSend = new FormData();
    formDataToSend.append(
      "barangData",
      JSON.stringify(
        formData.barangData.map((item) => ({
          prefix: item.nama_barang.charAt(0),
          nama_barang: item.nama_barang,
          deskripsi: item.deskripsi,
          harga: Number(item.harga),
          berat: Number(item.berat),
          id_kategori: Number(item.id_kategori),
          garansi: item.garansi,
        }))
      )
    );
    formDataToSend.append(
      "penitipanData",
      JSON.stringify({
        id_penitip: Number(formData.penitipanData.id_penitip),
        id_pegawai_qc: Number(formData.penitipanData.id_pegawai_qc),
        id_hunter: formData.penitipanData.id_hunter ? Number(formData.penitipanData.id_hunter) : null,
      })
    );
    formDataToSend.append(
      "detailPenitipanData",
      JSON.stringify(
        formData.detailPenitipanData.map(() => ({
          tanggal_masuk: tanggalMasuk.toISOString(),
          tanggal_akhir: tanggalAkhir,
          batas_ambil: batasAmbil,
          tanggal_laku: null,
          isDiperpanjang: false,
        }))
      )
    );

    formData.barangData.forEach((barang, index) => {
      barang.gambar.forEach((file) => {
        formDataToSend.append(`gambar[${index}]`, file);
      });
    });

    try {
      const res = await createPenitipan(formDataToSend, token);
      if (!res.errors) {
        setCreateSuccess("Penitipan created successfully");
        setTimeout(() => {
          onCloseCreateModal();
        }, 2000);
      } else {
        throw new Error(res.errors || "Gagal membuat penitipan");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan saat membuat penitipan";
      setCreateError(errorMessage);
      console.error("Error creating penitipan:", error);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Search:", e.currentTarget["search-pegawai"].value);
  };

  return (
    <div className="flex">
      <div className="flex-1 p-4 ml-64">
        <h1 className="text-4xl font-bold mt-12 mb-4">Data Penitipan</h1>
        <div className="flex justify-between items-center my-5">
          <form className="flex gap-3" onSubmit={handleSearch}>
            <input
              type="text"
              name="search-pegawai"
              id="search-pegawai"
              className="border rounded-md p-2 w-72"
              placeholder="Cari penitipan"
            />
            <button type="submit" className="p-3 bg-blue-500 text-white rounded-md">
              <HiSearch />
            </button>
          </form>
          <Button
            onClick={() => setOpenCreateModal(true)}
            className="bg-[#1980e6] hover:bg-[#1980e6]/80"
          >
            Tambah Penitipan
          </Button>
        </div>
        <div className="w-full overflow-x-auto">
          <Table hoverable className="w-full border-1">
            <TableHead>
              <TableRow>
                <TableHeadCell>No.</TableHeadCell>
                <TableHeadCell>Barang</TableHeadCell>
                <TableHeadCell>Penitip</TableHeadCell>
                <TableHeadCell>Harga</TableHeadCell>
                <TableHeadCell>Tanggal Masuk</TableHeadCell>
                <TableHeadCell>Tanggal Akhir</TableHeadCell>
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
                  Vacuum Cleaner
                </TableCell>
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  Jono Rusdi
                </TableCell>
                <TableCell>Rp2.500.000</TableCell>
                <TableCell>20-03-2025</TableCell>
                <TableCell>20-04-2025</TableCell>
                <TableCell>
                  <button className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                    Edit
                  </button>
                </TableCell>
                <TableCell>
                  <button className="font-medium text-red-600 hover:underline dark:text-red-500">
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal show={openCreateModal} size="2xl" onClose={onCloseCreateModal} popup>
        <ModalHeader />
        <ModalBody>
          <form className="space-y-6" onSubmit={handleCreate}>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Tambah Penitipan Baru</h3>
            {createError && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{createError}</div>
            )}
            {createSuccess && (
              <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">{createSuccess}</div>
            )}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Penitipan Data</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="id_penitip">ID Penitip</Label>
                  <TextInput
                    id="id_penitip"
                    type="number"
                    value={formData.penitipanData.id_penitip}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("penitipanData", 0, "id_penitip", e.target.value)
                    }
                    required
                    color={formErrors["penitipanData_0_id_penitip"] ? "failure" : undefined}
                  />
                  {formErrors["penitipanData_0_id_penitip"] && (
                    <p className="mt-1 text-sm text-red-600">{formErrors["penitipanData_0_id_penitip"]}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="id_pegawai_qc">ID Pegawai QC</Label>
                  <TextInput
                    id="id_pegawai_qc"
                    type="number"
                    value={formData.penitipanData.id_pegawai_qc}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("penitipanData", 0, "id_pegawai_qc", e.target.value)
                    }
                    required
                    color={formErrors["penitipanData_0_id_pegawai_qc"] ? "failure" : undefined}
                  />
                  {formErrors["penitipanData_0_id_pegawai_qc"] && (
                    <p className="mt-1 text-sm text-red-600">{formErrors["penitipanData_0_id_pegawai_qc"]}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="id_hunter">ID Hunter (Optional)</Label>
                  <TextInput
                    id="id_hunter"
                    type="number"
                    value={formData.penitipanData.id_hunter}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("penitipanData", 0, "id_hunter", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            {formData.barangData.map((barang, index) => (
              <div key={index} className="space-y-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium">Barang {index + 1}</h4>
                  {index > 0 && (
                    <Button color="failure" onClick={() => removeBarang(index)}>
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`nama_barang_${index}`}>Nama Barang</Label>
                    <TextInput
                      id={`nama_barang_${index}`}
                      value={barang.nama_barang}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("barangData", index, "nama_barang", e.target.value)
                      }
                      required
                      color={formErrors[`barangData_${index}_nama_barang`] ? "failure" : undefined}
                    />
                    {formErrors[`barangData_${index}_nama_barang`] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors[`barangData_${index}_nama_barang`]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`deskripsi_${index}`}>Deskripsi</Label>
                    <TextInput
                      id={`deskripsi_${index}`}
                      value={barang.deskripsi}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("barangData", index, "deskripsi", e.target.value)
                      }
                      required
                      color={formErrors[`barangData_${index}_deskripsi`] ? "failure" : undefined}
                    />
                    {formErrors[`barangData_${index}_deskripsi`] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors[`barangData_${index}_deskripsi`]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`harga_${index}`}>Harga</Label>
                    <TextInput
                      id={`harga_${index}`}
                      type="number"
                      value={barang.harga}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("barangData", index, "harga", e.target.value)
                      }
                      required
                      color={formErrors[`barangData_${index}_harga`] ? "failure" : undefined}
                    />
                    {formErrors[`barangData_${index}_harga`] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors[`barangData_${index}_harga`]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`berat_${index}`}>Berat (kg)</Label>
                    <TextInput
                      id={`berat_${index}`}
                      type="number"
                      value={barang.berat}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("barangData", index, "berat", e.target.value)
                      }
                      required
                      color={formErrors[`barangData_${index}_berat`] ? "failure" : undefined}
                    />
                    {formErrors[`barangData_${index}_berat`] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors[`barangData_${index}_berat`]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`id_kategori_${index}`}>Kategori</Label>
                    <Select
                      id={`id_kategori_${index}`}
                      value={barang.id_kategori}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleInputChange("barangData", index, "id_kategori", e.target.value)
                      }
                      required
                      color={formErrors[`barangData_${index}_id_kategori`] ? "failure" : undefined}
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                    {formErrors[`barangData_${index}_id_kategori`] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors[`barangData_${index}_id_kategori`]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`garansi_${index}`}>Garansi (Optional)</Label>
                    <TextInput
                      id={`garansi_${index}`}
                      type="datetime-local"
                      value={barang.garansi}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("barangData", index, "garansi", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`gambar_${index}`}>Images (Min 2, JPEG/PNG)</Label>
                    <FileInput
                      id={`gambar_${index}`}
                      multiple
                      accept="image/jpeg,image/png"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFileChange(index, e.target.files)
                      }
                      color={formErrors[`barangData_${index}_gambar`] ? "failure" : undefined}
                    />
                    {formErrors[`barangData_${index}_gambar`] && (
                      <p className="mt-1 text-sm text-red-600">{formErrors[`barangData_${index}_gambar`]}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      {barang.gambar.map((file: File, i: number) => (
                        <img
                          key={i}
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${i}`}
                          className="w-20 h-20 object-cover"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button color="blue" onClick={addBarang} className="mt-4">
              Add Barang
            </Button>
            <div className="flex justify-end">
              <Button type="submit" className="bg-[#1980e6] hover:bg-[#1980e6]/80">
                Tambah Penitipan
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}