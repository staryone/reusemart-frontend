"use client";

import { useEffect, useMemo, useState } from "react";
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
import { HiSearch, HiX } from "react-icons/hi";
import {
  createPenitipan,
  getListPenitipan,
  updatePenitipan,
} from "@/lib/api/penitipan.api";
import { useUser } from "@/hooks/use-user";
import { getListPegawai } from "@/lib/api/pegawai.api";
import { Pegawai } from "@/lib/interface/pegawai.interface";
import { getListPenitip } from "@/lib/api/penitip.api";
import { Penitip } from "@/lib/interface/penitip.interface";
import useSWR from "swr";
import { DetailPenitipan } from "@/lib/interface/detail-penitipan.interface";
import jsPDF from "jspdf";

// Form-specific interfaces
interface BarangFormData {
  prefix: string;
  nama_barang: string;
  deskripsi: string;
  harga: string;
  berat: string;
  id_kategori: string;
  garansi: string;
  gambar: Array<
    File | { id_gambar: number; url_gambar: string; is_primary: boolean }
  >;
}

interface PenitipanFormData {
  penitip: Penitip | null;
  pegawai_qc: Pegawai | null;
  hunter: Pegawai | null;
}

type DetailPenitipanFormData = {
  tanggal_masuk: string;
  tanggal_akhir: string;
  batas_ambil: string;
  tanggal_laku: string | null;
  isDiperpanjang: boolean;
};

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
  { id: "8", name: "Peralatan Taman & Outdoor" },
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

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getListPenitipan(params, token);

// Component to render the receipt for PDF generation
const PenitipanReceipt = ({
  penitipan,
  onGeneratePDF,
}: {
  penitipan: DetailPenitipan;
  onGeneratePDF: () => void;
}) => {
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Tanggal tidak valid";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateWithTime = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Tanggal tidak valid";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleGeneratePDF = () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set font and styles
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(16);

    // Title
    pdf.text("NOTA PENITIPAN BARANG", 105, 20, { align: "center" });

    // Store Info
    pdf.setFontSize(12);
    pdf.text("REUse Mart", 20, 40);
    pdf.text("Jl. Green Eco Park No. 456 Yogyakarta", 20, 45);
    pdf.line(20, 50, 190, 50); // Horizontal line

    // Receipt Details
    pdf.text(`No Nota: ${penitipan.nomorNota}`, 20, 60);
    pdf.text(
      `Tanggal penitipan: ${formatDateWithTime(penitipan.tanggal_masuk)}`,
      20,
      65
    );
    pdf.text(
      `Masa penitipan sampai: ${formatDate(penitipan.tanggal_akhir)}`,
      20,
      70
    );
    pdf.line(20, 75, 190, 75); // Horizontal line

    // Penitip Info
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      `PENITIP: ${penitipan.penitipan.penitip.id_penitip} / ${penitipan.penitipan.penitip.nama}`,
      20,
      85
    );
    pdf.setFont("helvetica", "normal");
    pdf.text(`${penitipan.penitipan.penitip.alamat}`, 20, 90);
    // pdf.text("Caturunggl, Depok, Sleman", 20, 95);

    // Item Details
    const hargaFormatted = new Intl.NumberFormat("id-ID").format(
      penitipan.barang.harga
    );
    const itemLine = `${penitipan.barang.nama_barang}`;
    const hargaLine = `${hargaFormatted}`;
    pdf.text(itemLine, 20, 110);
    pdf.text(hargaLine, 190 - pdf.getTextWidth(hargaLine), 110); // Right-align harga

    let yPosition = 115;
    if (penitipan.barang.garansi) {
      pdf.text(
        `Garansi ON ${new Date(penitipan.barang.garansi).toLocaleString(
          "id-ID",
          { month: "long", year: "numeric" }
        )}`,
        20,
        yPosition
      );
      yPosition += 5;
    }
    pdf.text(`Berat barang: ${penitipan.barang.berat} kg`, 20, yPosition);
    yPosition += 5;

    // QC Info
    pdf.setFont("helvetica", "italic");
    pdf.text("Diterima dan QC oleh:", 20, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.line(20, yPosition + 2, 190, yPosition + 2); // Horizontal line
    pdf.text(
      `P${penitipan.penitipan.pegawai_qc.id_pegawai} - ${penitipan.penitipan.pegawai_qc.nama}`,
      20,
      yPosition + 7
    );

    // Save the PDF
    pdf.save(`nota_penitipan_${penitipan.id_dtl_penitipan}.pdf`);
    if (onGeneratePDF) onGeneratePDF();
  };

  useEffect(() => {
    if (penitipan) {
      handleGeneratePDF();
    }
  }, [penitipan]);

  // Since we're not rendering to the DOM, return null
  return null;
};
export default function PenitipanMaster() {
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [editPenitipanId, setEditPenitipanId] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [semuaHunter, setSemuaHunter] = useState<Pegawai[]>([]);
  const [semuaQC, setSemuaQC] = useState<Pegawai[]>([]);
  const [semuaPenitip, setSemuaPenitip] = useState<Penitip[]>([]);
  const [penitipSearch, setPenitipSearch] = useState<string>("");
  const [qcSearch, setQCSearch] = useState<string>("");
  const [hunterSearch, setHunterSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [selectedPenitipan, setSelectedPenitipan] =
    useState<DetailPenitipan | null>(null);
  const [pdfPenitipan, setPdfPenitipan] = useState<DetailPenitipan | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string>("");
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
    penitipanData: { penitip: null, pegawai_qc: null, hunter: null },
    detailPenitipanData: [
      {
        tanggal_masuk: "",
        tanggal_akhir: "",
        batas_ambil: "",
        tanggal_laku: null,
        isDiperpanjang: false,
      },
    ],
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const currentUser = useUser();
  const token = currentUser !== null ? currentUser.token : "";

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "TERSEDIA", label: "Tersedia" },
    { value: "TERJUAL", label: "Terjual" },
    { value: "DIDONASIKAN", label: "Didonasikan" },
    // Add other possible statuses based on your data model
  ];

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortField: "tanggal_masuk",
      sortOrder: "desc",
    });
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    if (statusFilter) {
      params.append("status", statusFilter); // Add status to query params
    }
    return params;
  }, [page, searchQuery, limit, statusFilter]);

  const { data, error, isLoading, mutate } = useSWR(
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

  const paramsHunter = useMemo(
    () => new URLSearchParams({ search: "HUNTER" }),
    []
  );
  const paramsQC = useMemo(() => new URLSearchParams({ search: "GUDANG" }), []);
  const paramsPenitip = useMemo(() => new URLSearchParams({ all: "true" }), []);

  useEffect(() => {
    async function fetchHunter() {
      try {
        const response = await getListPegawai(paramsHunter, token);
        if (response[0]) {
          setSemuaHunter(response[0]);
        } else {
          throw new Error("Tidak ada hunter tersedia");
        }
      } catch (error: unknown) {
        console.error("Gagal memuat hunter:", error);
      }
    }
    async function fetchQC() {
      try {
        const response = await getListPegawai(paramsQC, token);
        if (response[0]) {
          setSemuaQC(response[0]);
        } else {
          throw new Error("Tidak ada QC tersedia");
        }
      } catch (error: unknown) {
        console.error("Gagal memuat barang:", error);
      }
    }
    async function fetchPenitip() {
      try {
        const response = await getListPenitip(paramsPenitip, token);
        if (response[0]) {
          setSemuaPenitip(response[0]);
        } else {
          throw new Error("Tidak ada penitip tersedia");
        }
      } catch (error: unknown) {
        console.error("Gagal memuat penitip:", error);
      }
    }

    fetchHunter();
    fetchQC();
    fetchPenitip();
  }, [paramsHunter, paramsQC, paramsPenitip, token]);

  const resetForm = () => {
    // Revoke existing object URLs
    formData.barangData.forEach((barang) => {
      barang.gambar.forEach((item) => {
        if (item instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(item));
        }
      });
    });

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
      penitipanData: { penitip: null, pegawai_qc: null, hunter: null },
      detailPenitipanData: [
        {
          tanggal_masuk: "",
          tanggal_akhir: "",
          batas_ambil: "",
          tanggal_laku: null,
          isDiperpanjang: false,
        },
      ],
    });
    setFormErrors({});
    setPenitipSearch("");
    setQCSearch("");
    setHunterSearch("");
    setCreateError(null);
    setCreateSuccess(null);
    setEditError(null);
    setEditSuccess(null);
  };

  const onCloseCreateModal = () => {
    setOpenCreateModal(false);
    resetForm();
  };

  const onCloseEditModal = () => {
    setOpenEditModal(false);
    setEditPenitipanId(null);
    resetForm();
  };

  const handleInputChange = (
    section: "barangData" | "penitipanData" | "detailPenitipanData",
    index: number,
    field: string,
    value: string | Penitip | Pegawai | null | boolean
  ): void => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (section === "penitipanData") {
        newData.penitipanData = { ...newData.penitipanData, [field]: value };
      } else {
        newData[section][index] = {
          ...newData[section][index],
          [field]: value,
        };
      }
      return newData;
    });
    setFormErrors((prev) => ({
      ...prev,
      [`${section}_${index}_${field}`]: "",
    }));
  };

  const handleFileChange = (index: number, files: FileList | null): void => {
    const fileArray: File[] = files ? Array.from(files) : [];
    const validTypes = ["image/jpeg", "image/png"];
    const invalidFiles = fileArray.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        [`barangData_${index}_gambar`]: "Only JPEG and PNG images are allowed",
      }));
      return;
    }

    // Compute existingFiles outside the setFormData callback
    const existingFiles = formData.barangData[index].gambar.filter(
      (item) => !(item instanceof File) // Keep existing server images
    );

    // Filter out duplicates by file name and size
    const newFiles = fileArray.filter(
      (newFile) =>
        !existingFiles.some(
          (existing) =>
            existing instanceof File &&
            existing.name === newFile.name &&
            existing.size === newFile.size
        )
    );

    // Update formData with new and existing files
    setFormData((prev) => {
      const newData = { ...prev };
      newData.barangData[index].gambar = [...existingFiles, ...newFiles];
      return newData;
    });

    // Update form errors based on total images
    setFormErrors((prev) => ({
      ...prev,
      [`barangData_${index}_gambar`]:
        existingFiles.length + newFiles.length < 2
          ? "At least 2 images are required"
          : "",
    }));

    // Reset file input
    const fileInput = document.getElementById(
      `gambar_${index}`
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  useEffect(() => {
    return () => {
      // Clean up all object URLs when component unmounts or modal closes
      formData.barangData.forEach((barang) => {
        barang.gambar.forEach((item) => {
          if (item instanceof File) {
            URL.revokeObjectURL(URL.createObjectURL(item));
          }
        });
      });
    };
  }, [formData.barangData, openCreateModal, openEditModal]);

  const handleRemoveImage = (barangIndex: number, imageIndex: number): void => {
    setFormData((prev) => {
      const newData = { ...prev };
      const removedItem = newData.barangData[barangIndex].gambar[imageIndex];
      if (removedItem instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(removedItem));
      }
      newData.barangData[barangIndex].gambar.splice(imageIndex, 1);
      return newData;
    });

    const remainingImages = formData.barangData[barangIndex].gambar.length - 1;
    setFormErrors((prev) => ({
      ...prev,
      [`barangData_${barangIndex}_gambar`]:
        remainingImages < 2 ? "At least 2 images are required" : "",
    }));
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
        {
          tanggal_masuk: "",
          tanggal_akhir: "",
          batas_ambil: "",
          tanggal_laku: null,
          isDiperpanjang: false,
        },
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
        if (
          key.startsWith(`barangData_${index}_`) ||
          key.startsWith(`detailPenitipanData_${index}_`)
        ) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    formData.barangData.forEach((barang, index) => {
      if (!barang.nama_barang)
        newErrors[`barangData_${index}_nama_barang`] =
          "Nama barang is required";
      if (!barang.deskripsi)
        newErrors[`barangData_${index}_deskripsi`] = "Deskripsi is required";
      if (
        !barang.harga ||
        isNaN(Number(barang.harga)) ||
        Number(barang.harga) <= 0
      ) {
        newErrors[`barangData_${index}_harga`] =
          "Harga must be a positive number";
      }
      if (
        !barang.berat ||
        isNaN(Number(barang.berat)) ||
        Number(barang.berat) <= 0
      ) {
        newErrors[`barangData_${index}_berat`] =
          "Berat must be a positive number";
      }
      if (
        !barang.id_kategori ||
        isNaN(Number(barang.id_kategori)) ||
        Number(barang.id_kategori) <= 0
      ) {
        newErrors[`barangData_${index}_id_kategori`] =
          "ID Kategori must be a positive number";
      }
      if (barang.gambar.length < 2) {
        newErrors[`barangData_${index}_gambar`] =
          "At least 2 images are required";
      }
    });
    if (!formData.penitipanData.penitip) {
      newErrors["penitipanData_0_penitip"] = "Penitip is required";
    }
    if (!formData.penitipanData.pegawai_qc) {
      newErrors["penitipanData_0_pegawai_qc"] = "Pegawai QC is required";
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
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
          garansi: item.garansi == "" ? undefined : item.garansi,
        }))
      )
    );
    formDataToSend.append(
      "penitipanData",
      JSON.stringify({
        id_penitip: formData.penitipanData.penitip?.id_penitip,
        id_pegawai_qc: formData.penitipanData.pegawai_qc?.id_pegawai,
        id_hunter: formData.penitipanData.hunter
          ? formData.penitipanData.hunter.id_pegawai
          : undefined,
      })
    );
    formDataToSend.append(
      "detailPenitipanData",
      JSON.stringify(
        formData.barangData.map(() => ({
          tanggal_masuk: tanggalMasuk.toISOString(),
          tanggal_akhir: tanggalAkhir,
          batas_ambil: batasAmbil,
          tanggal_laku: null,
          isDiperpanjang: false,
        }))
      )
    );

    formData.barangData.forEach((barang, index) => {
      barang.gambar.forEach((item) => {
        if (item instanceof File) {
          formDataToSend.append(`gambar[${index}]`, item);
        }
      });
    });

    try {
      const res = await createPenitipan(formDataToSend, token);
      if (!res.errors) {
        setCreateSuccess("Penitipan created successfully");
        mutate();
        setTimeout(() => {
          onCloseCreateModal();
        }, 2000);
      } else {
        throw new Error(res.errors || "Gagal membuat penitipan");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membuat penitipan";
      setCreateError(errorMessage);
      console.error("Error creating penitipan:", error);
    }
  };

  const handleOpenEditModal = (penitipan: DetailPenitipan): void => {
    setEditPenitipanId(penitipan.id_dtl_penitipan.toString());
    setFormData({
      barangData: [
        {
          prefix: penitipan.barang.nama_barang.charAt(0),
          nama_barang: penitipan.barang.nama_barang,
          deskripsi: penitipan.barang.deskripsi,
          harga: penitipan.barang.harga.toString(),
          berat: penitipan.barang.berat.toString(),
          id_kategori: penitipan.barang.kategori.id_kategori.toString(),
          garansi: penitipan.barang.garansi || "",
          gambar: penitipan.barang.gambar.map((g) => ({
            id_gambar: g.id_gambar,
            url_gambar: g.url_gambar,
            is_primary: g.is_primary,
          })),
        },
      ],
      penitipanData: {
        penitip: penitipan.penitipan.penitip,
        pegawai_qc: penitipan.penitipan.pegawai_qc,
        hunter: penitipan.penitipan.hunter || null,
      },
      detailPenitipanData: [
        {
          tanggal_masuk: penitipan.tanggal_masuk,
          tanggal_akhir: penitipan.tanggal_akhir,
          batas_ambil: penitipan.batas_ambil,
          tanggal_laku: penitipan.tanggal_laku || null,
          isDiperpanjang: penitipan.is_perpanjang,
        },
      ],
    });
    console.log("Penitipan data", penitipan);
    console.log("Form data", formData);
    setOpenEditModal(true);
  };

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(null);

    if (!validateForm() || !editPenitipanId) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append(
      "barangData",
      JSON.stringify(
        formData.barangData.map((item) => ({
          nama_barang: item.nama_barang,
          deskripsi: item.deskripsi,
          harga: Number(item.harga),
          berat: Number(item.berat),
          id_kategori: Number(item.id_kategori),
          garansi: item.garansi == "" ? undefined : item.garansi,
        }))
      )
    );
    formDataToSend.append(
      "penitipanData",
      JSON.stringify({
        id_penitip: formData.penitipanData.penitip?.id_penitip,
        id_pegawai_qc: formData.penitipanData.pegawai_qc?.id_pegawai,
        id_hunter: formData.penitipanData.hunter
          ? formData.penitipanData.hunter.id_pegawai
          : undefined,
      })
    );
    formDataToSend.append(
      "detailPenitipanData",
      JSON.stringify(formData.detailPenitipanData)
    );

    console.log(formData.barangData);

    formData.barangData.forEach((barang, index) => {
      const existingImages: { id_gambar: number }[] = [];
      barang.gambar.forEach((item) => {
        if (item instanceof File) {
          formDataToSend.append(`gambar[${index}]`, item);
        } else {
          existingImages.push({ id_gambar: item.id_gambar });
        }
      });
      formDataToSend.append(
        `existingGambar[${index}]`,
        JSON.stringify(existingImages)
      );
    });

    try {
      const res = await updatePenitipan(editPenitipanId, formDataToSend, token);
      if (!res.errors) {
        setEditSuccess("Penitipan updated successfully");
        mutate();
        setTimeout(() => {
          onCloseEditModal();
        }, 2000);
      } else {
        throw new Error(res.errors || "Gagal memperbarui penitipan");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memperbarui penitipan";
      setEditError(errorMessage);
      console.error("Error updating penitipan:", error);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search-penitipan") as string;
    const status = formData.get("status-filter") as string;
    setSearchQuery(search);
    setStatusFilter(status);
    setPage(1);
  };

  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleOpenDetailModal = (penitipan: DetailPenitipan): void => {
    setSelectedPenitipan(penitipan);
    setOpenDetailModal(true);
  };

  const handleGeneratePDF = (penitipan: DetailPenitipan) => {
    setPdfPenitipan(penitipan);
  };

  const filteredPenitip = semuaPenitip.filter(
    (penitip) =>
      penitip.nama.toLowerCase().includes(penitipSearch.toLowerCase()) ||
      penitip.email.toLowerCase().includes(penitipSearch.toLowerCase())
  );
  const filteredQC = semuaQC.filter(
    (qc) =>
      qc.nama.toLowerCase().includes(qcSearch.toLowerCase()) ||
      qc.email.toLowerCase().includes(qcSearch.toLowerCase())
  );
  const filteredHunter = semuaHunter.filter(
    (hunter) =>
      hunter.nama.toLowerCase().includes(hunterSearch.toLowerCase()) ||
      hunter.email.toLowerCase().includes(hunterSearch.toLowerCase())
  );

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Tanggal tidak valid";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const renderModal = (isEditMode: boolean) => (
    <Modal
      show={isEditMode ? openEditModal : openCreateModal}
      size="2xl"
      onClose={isEditMode ? onCloseEditModal : onCloseCreateModal}
      popup
    >
      <ModalHeader />
      <ModalBody>
        <form
          className="space-y-6"
          onSubmit={isEditMode ? handleUpdate : handleCreate}
        >
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {isEditMode ? "Edit Penitipan" : "Tambah Penitipan Baru"}
          </h3>
          {isEditMode
            ? editError && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                  {editError}
                </div>
              )
            : createError && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                  {createError}
                </div>
              )}
          {isEditMode
            ? editSuccess && (
                <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">
                  {editSuccess}
                </div>
              )
            : createSuccess && (
                <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">
                  {createSuccess}
                </div>
              )}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Penitipan Data</h4>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="penitip">Penitip</Label>
                <TextInput
                  id="penitip_search"
                  placeholder="Cari penitip (nama atau email)..."
                  value={penitipSearch}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPenitipSearch(e.target.value)
                  }
                  className="mb-2"
                />
                <Select
                  id="penitip"
                  value={formData.penitipanData.penitip?.id_penitip || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedPenitip = semuaPenitip.find(
                      (p) => p.id_penitip.toString() === e.target.value
                    );
                    handleInputChange(
                      "penitipanData",
                      0,
                      "penitip",
                      selectedPenitip || null
                    );
                  }}
                  required
                  color={
                    formErrors["penitipanData_0_penitip"]
                      ? "failure"
                      : undefined
                  }
                >
                  <option value="">Pilih Penitip</option>
                  {filteredPenitip.map((penitip) => (
                    <option key={penitip.id_penitip} value={penitip.id_penitip}>
                      {`${penitip.nama} (${penitip.email})`}
                    </option>
                  ))}
                </Select>
                {formErrors["penitipanData_0_penitip"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors["penitipanData_0_penitip"]}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="pegawai_qc">Pegawai QC</Label>
                <TextInput
                  id="qc_search"
                  placeholder="Cari QC (nama atau email)..."
                  value={qcSearch}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setQCSearch(e.target.value)
                  }
                  className="mb-2"
                />
                <Select
                  id="pegawai_qc"
                  value={formData.penitipanData.pegawai_qc?.id_pegawai || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedQC = semuaQC.find(
                      (q) => q.id_pegawai.toString() === e.target.value
                    );
                    handleInputChange(
                      "penitipanData",
                      0,
                      "pegawai_qc",
                      selectedQC || null
                    );
                  }}
                  required
                  color={
                    formErrors["penitipanData_0_pegawai_qc"]
                      ? "failure"
                      : undefined
                  }
                >
                  <option value="">Pilih Pegawai QC</option>
                  {filteredQC.map((qc) => (
                    <option key={qc.id_pegawai} value={qc.id_pegawai}>
                      {`${qc.nama} (${qc.email}) - ${qc.jabatan.nama_jabatan}`}
                    </option>
                  ))}
                </Select>
                {formErrors["penitipanData_0_pegawai_qc"] && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors["penitipanData_0_pegawai_qc"]}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="hunter">Hunter (Optional)</Label>
                <TextInput
                  id="hunter_search"
                  placeholder="Cari Hunter (nama atau email)..."
                  value={hunterSearch}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHunterSearch(e.target.value)
                  }
                  className="mb-2"
                />
                <Select
                  id="hunter"
                  value={formData.penitipanData.hunter?.id_pegawai || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedHunter = semuaHunter.find(
                      (h) => h.id_pegawai.toString() === e.target.value
                    );
                    handleInputChange(
                      "penitipanData",
                      0,
                      "hunter",
                      selectedHunter || null
                    );
                  }}
                >
                  <option value="">Pilih Hunter (Opsional)</option>
                  {filteredHunter.map((hunter) => (
                    <option key={hunter.id_pegawai} value={hunter.id_pegawai}>
                      {`${hunter.nama} (${hunter.email}) - ${hunter.jabatan.nama_jabatan}`}
                    </option>
                  ))}
                </Select>
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
                      handleInputChange(
                        "barangData",
                        index,
                        "nama_barang",
                        e.target.value
                      )
                    }
                    required
                    color={
                      formErrors[`barangData_${index}_nama_barang`]
                        ? "failure"
                        : undefined
                    }
                  />
                  {formErrors[`barangData_${index}_nama_barang`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors[`barangData_${index}_nama_barang`]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor={`deskripsi_${index}`}>Deskripsi</Label>
                  <TextInput
                    id={`deskripsi_${index}`}
                    value={barang.deskripsi}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(
                        "barangData",
                        index,
                        "deskripsi",
                        e.target.value
                      )
                    }
                    required
                    color={
                      formErrors[`barangData_${index}_deskripsi`]
                        ? "failure"
                        : undefined
                    }
                  />
                  {formErrors[`barangData_${index}_deskripsi`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors[`barangData_${index}_deskripsi`]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor={`harga_${index}`}>Harga</Label>
                  <TextInput
                    id={`harga_${index}`}
                    type="number"
                    value={barang.harga}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(
                        "barangData",
                        index,
                        "harga",
                        e.target.value
                      )
                    }
                    required
                    color={
                      formErrors[`barangData_${index}_harga`]
                        ? "failure"
                        : undefined
                    }
                  />
                  {formErrors[`barangData_${index}_harga`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors[`barangData_${index}_harga`]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor={`berat_${index}`}>Berat (kg)</Label>
                  <TextInput
                    id={`berat_${index}`}
                    type="number"
                    value={barang.berat}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(
                        "barangData",
                        index,
                        "berat",
                        e.target.value
                      )
                    }
                    required
                    color={
                      formErrors[`barangData_${index}_berat`]
                        ? "failure"
                        : undefined
                    }
                  />
                  {formErrors[`barangData_${index}_berat`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors[`barangData_${index}_berat`]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor={`id_kategori_${index}`}>Kategori</Label>
                  <Select
                    id={`id_kategori_${index}`}
                    value={barang.id_kategori}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleInputChange(
                        "barangData",
                        index,
                        "id_kategori",
                        e.target.value
                      )
                    }
                    required
                    color={
                      formErrors[`barangData_${index}_id_kategori`]
                        ? "failure"
                        : undefined
                    }
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                  {formErrors[`barangData_${index}_id_kategori`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors[`barangData_${index}_id_kategori`]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor={`garansi_${index}`}>Garansi (Optional)</Label>
                  <TextInput
                    id={`garansi_${index}`}
                    type="datetime-local"
                    value={barang.garansi}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(
                        "barangData",
                        index,
                        "garansi",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor={`gambar_${index}`}>
                    Images (Min 2, JPEG/PNG)
                  </Label>
                  <FileInput
                    id={`gambar_${index}`}
                    multiple
                    accept="image/jpeg,image/png"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleFileChange(index, e.target.files)
                    }
                    color={
                      formErrors[`barangData_${index}_gambar`]
                        ? "failure"
                        : undefined
                    }
                  />
                  {formErrors[`barangData_${index}_gambar`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors[`barangData_${index}_gambar`]}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {barang.gambar.map((item, i) => (
                      <div
                        key={
                          item instanceof File
                            ? `${item.name}-${item.size}`
                            : item.id_gambar
                        }
                        className="relative"
                      >
                        <img
                          src={
                            item instanceof File
                              ? URL.createObjectURL(item)
                              : item.url_gambar
                          }
                          alt={`Preview ${i}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                        {(item instanceof File || item.is_primary) && (
                          <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            {item instanceof File ? "New" : "Primary"}
                          </span>
                        )}
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          onClick={() => handleRemoveImage(index, i)}
                        >
                          <HiX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isEditMode ? (
            <></>
          ) : (
            <Button color="blue" onClick={addBarang} className="mt-4">
              Add Barang
            </Button>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#1980e6] hover:bg-[#1980e6]/80"
            >
              {isEditMode ? "Update Penitipan" : "Tambah Penitipan"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );

  return (
    <div className="flex">
      <div className="flex-1 p-4 ml-64">
        <h1 className="text-4xl font-bold mt-12 mb-4">Data Pengiriman</h1>
        <div className="flex justify-between items-center my-5">
          <form className="flex gap-3" onSubmit={handleSearch}>
            <input
              type="text"
              name="search-penitipan"
              id="search-penitipan"
              className="border rounded-md p-2 w-72"
              placeholder="Cari penitipan"
            />
            <Select
              name="status-filter"
              id="status-filter"
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setStatusFilter(e.target.value)
              }
              className="w-48"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <button
              type="submit"
              className="p-3 bg-blue-500 text-white rounded-md"
            >
              <HiSearch />
            </button>
          </form>
          {/* <Button
            onClick={() => setOpenCreateModal(true)}
            className="bg-[#1980e6] hover:bg-[#1980e6]/80"
          >
            Tambah Penitipan
          </Button> */}
        </div>
        <div className="w-full overflow-x-auto">
          <Table hoverable className="w-full border-1">
            <TableHead>
              <TableRow>
                <TableHeadCell>No.</TableHeadCell>
                <TableHeadCell>Nomor Nota</TableHeadCell>
                <TableHeadCell>Tanggal Pesan</TableHeadCell>
                <TableHeadCell>Pembeli</TableHeadCell>
                <TableHeadCell>Alamat</TableHeadCell>
                <TableHeadCell>Kurir</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>
                  <span className="sr-only">Detail</span>
                </TableHeadCell>
                <TableHeadCell>
                  <span className="sr-only">Edit</span>
                </TableHeadCell>
                <TableHeadCell>
                  <span className="sr-only">Edit</span>
                </TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Error memuat data
                  </TableCell>
                </TableRow>
              ) : data && data[0]?.length > 0 ? (
                data[0].map((dtlPenitipan: DetailPenitipan, index: number) => (
                  <TableRow
                    key={dtlPenitipan.id_dtl_penitipan}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell>{(page - 1) * limit + index + 1}.</TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {dtlPenitipan.barang.nama_barang}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {dtlPenitipan.penitipan.penitip.nama}
                    </TableCell>
                    <TableCell>
                      Rp
                      {new Intl.NumberFormat("id-ID").format(
                        dtlPenitipan.barang.harga
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDate(dtlPenitipan.tanggal_masuk)}
                    </TableCell>
                    <TableCell>
                      {formatDate(dtlPenitipan.tanggal_akhir)}
                    </TableCell>
                    <TableCell>{dtlPenitipan.barang.status}</TableCell>
                    <TableCell>
                      <button
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        onClick={() => handleOpenDetailModal(dtlPenitipan)}
                      >
                        Lihat Detail
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        onClick={() => handleOpenEditModal(dtlPenitipan)}
                      >
                        Edit
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Tidak ada data
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

      {renderModal(false)}
      {renderModal(true)}

      {pdfPenitipan && (
        <PenitipanReceipt
          penitipan={pdfPenitipan}
          onGeneratePDF={() => setPdfPenitipan(null)}
        />
      )}

      <Modal
        show={openDetailModal}
        size="3xl"
        onClose={() => setOpenDetailModal(false)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Detail Penitipan
            </h3>
            {selectedPenitipan && (
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="text-lg font-medium mb-2">
                    Informasi Penitipan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold">ID Penitipan</p>
                      <p>{selectedPenitipan.penitipan.id_penitipan}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Penitip</p>
                      <p>{selectedPenitipan.penitipan.penitip.nama}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Pegawai QC</p>
                      <p>
                        {selectedPenitipan.penitipan.pegawai_qc.nama} (P
                        {selectedPenitipan.penitipan.pegawai_qc.id_pegawai})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Hunter</p>
                      <p>
                        {selectedPenitipan.penitipan.hunter?.nama ||
                          "Tidak ada hunter"}{" "}
                        (P
                        {selectedPenitipan.penitipan.hunter?.id_pegawai || "-"})
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-b pb-4">
                  <h4 className="text-lg font-medium mb-2">Informasi Barang</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold">Nama Barang</p>
                      <p>{selectedPenitipan.barang.nama_barang}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Kategori</p>
                      <p>{selectedPenitipan.barang.kategori.nama_kategori}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Harga</p>
                      <p>
                        Rp
                        {new Intl.NumberFormat("id-ID").format(
                          selectedPenitipan.barang.harga
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Berat</p>
                      <p>{selectedPenitipan.barang.berat} kg</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Status</p>
                      <p>{selectedPenitipan.barang.status}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Garansi</p>
                      <p>
                        {selectedPenitipan.barang.garansi
                          ? formatDate(selectedPenitipan.barang.garansi)
                          : "Tidak ada"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-semibold">Deskripsi</p>
                      <p>{selectedPenitipan.barang.deskripsi}</p>
                    </div>
                  </div>
                </div>
                <div className="border-b pb-4">
                  <h4 className="text-lg font-medium mb-2">Gambar Barang</h4>
                  <div className="flex flex-wrap gap-4">
                    {selectedPenitipan.barang.gambar.map((gambar, index) => (
                      <div key={gambar.id_gambar} className="relative">
                        <img
                          src={gambar.url_gambar}
                          alt={`Gambar ${index + 1}`}
                          className="w-32 h-32 object-cover rounded"
                        />
                        {gambar.is_primary && (
                          <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-2">Detail Tanggal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold">Tanggal Masuk</p>
                      <p>{formatDate(selectedPenitipan.tanggal_masuk)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Tanggal Akhir</p>
                      <p>{formatDate(selectedPenitipan.tanggal_akhir)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Batas Ambil</p>
                      <p>{formatDate(selectedPenitipan.batas_ambil)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Tanggal Laku</p>
                      <p>
                        {selectedPenitipan.tanggal_laku
                          ? formatDate(selectedPenitipan.tanggal_laku)
                          : "Belum laku"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Diperpanjang</p>
                      <p>{selectedPenitipan.is_perpanjang ? "Ya" : "Tidak"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                color="blue"
                onClick={() =>
                  selectedPenitipan && handleGeneratePDF(selectedPenitipan)
                }
              >
                Download PDF
              </Button>
              <Button color="gray" onClick={() => setOpenDetailModal(false)}>
                Tutup
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
