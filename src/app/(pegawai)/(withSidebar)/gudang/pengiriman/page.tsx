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
  Select,
} from "flowbite-react";
import { HiSearch, HiX } from "react-icons/hi";
import {
  getListPengiriman,
  updatePengiriman,
  getListKurir,
} from "@/lib/api/pengiriman.api";
import { useUser } from "@/hooks/use-user";
import { Pengiriman } from "@/lib/interface/pengiriman.interface";
import { Pegawai } from "@/lib/interface/pegawai.interface";
import { Transaksi } from "@/lib/interface/transaksi.interface";
import { DetailTransaksi } from "@/lib/interface/detail-transaksi.interface";
import useSWR from "swr";
import { tr, id } from "date-fns/locale";
import { format } from "date-fns";
import jsPDF from "jspdf";

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getListPengiriman(params, token);

export default function PengirimanMaster() {
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [editPengirimanId, setEditPengirimanId] = useState<string | null>(null);
  const [pengiriman, setPengiriman] = useState<Pengiriman | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [kurirSearch, setKurirSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("DIPROSES");
  const [allKurir, setAllKurir] = useState<Pegawai[]>([]);

  const [formData, setFormData] = useState({
    tanggal: "",
    status_pengiriman: "",
    id_kurir: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const currentUser = useUser();
  const token = currentUser !== null ? currentUser.token : "";

  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortField: "tanggal",
      sortOrder: "desc",
    });
    if (searchQuery) params.append("search", searchQuery);
    if (statusFilter) params.append("status", statusFilter);
    return params;
  }, [page, searchQuery, limit, statusFilter]);

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "DIPROSES", label: "Diproses" },
    { value: "SEDANG_DIKIRIM", label: "Sedang Dikirim" },
    { value: "SUDAH_DITERIMA", label: "Diterima" },
  ];

  const { data, error, isLoading, mutate } = useSWR(
    [queryParams, token],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (data && data[1] !== undefined) {
      setTotalItems(data[1]);
    }
  }, [data]);

  useEffect(() => {
    async function fetchKurir() {
      try {
        const params = new URLSearchParams({ all: "true" });
        const response = await getListKurir(params, token);
        if (response[0]) {
          setAllKurir(response[0]);
        } else {
          throw new Error("Tidak ada kurir tersedia");
        }
      } catch (error) {
        console.error("Gagal memuat kurir:", error);
      }
    }
    fetchKurir();
  }, [token]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.tanggal) newErrors["tanggal"] = "Tanggal is required";
    if (!formData.status_pengiriman)
      newErrors["status_pengiriman"] = "Status is required";
    if (!formData.id_kurir) newErrors["id_kurir"] = "Kurir is required";
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(null);

    if (!validateForm() || !editPengirimanId) return;

    const formDataToSend = new FormData();
    formDataToSend.append("id_pengiriman", editPengirimanId);
    formDataToSend.append("tanggal", formData.tanggal);
    formDataToSend.append("id_kurir", formData.id_kurir);

    try {
      const res = await updatePengiriman(formDataToSend, token);
      if (!res.errors) {
        setEditSuccess("Pengiriman updated successfully");
        mutate();
        setTimeout(() => setOpenEditModal(false), 2000);
      } else {
        throw new Error(res.errors || "Gagal memperbarui pengiriman");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memperbarui pengiriman";
      setEditError(errorMessage);
      console.error("Error updating pengiriman:", error);
    }
  };

  const handleOpenEditModal = (pengiriman: Pengiriman) => {
    setEditPengirimanId(pengiriman.id_pengiriman);
    setPengiriman(pengiriman);
    setFormData({
      tanggal: pengiriman.tanggal ?? "",
      status_pengiriman: pengiriman.status_pengiriman,
      id_kurir: pengiriman.kurir?.id_pegawai ?? "",
    });
    setOpenEditModal(true);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search-pengiriman") as string;
    const status = formData.get("status-filter") as string;
    setSearchQuery(search);
    setStatusFilter(status || "DIPROSES");
    setPage(1);
  };

  const totalPages = Math.ceil(totalItems / limit);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return format(new Date(date), "dd MMMM yyyy, HH:mm", { locale: id });
  };

  const filteredKurir = allKurir.filter(
    (kurir) =>
      kurir.nama.toLowerCase().includes(kurirSearch.toLowerCase()) ||
      kurir.email.toLowerCase().includes(kurirSearch.toLowerCase())
  );

  const formattedNomorTransaksi = (transaksi: Transaksi): string => {
    const date = new Date(transaksi.tanggal_transaksi);
    const year = format(date, "yyyy", { locale: id });
    const month = format(date, "MM", { locale: id });
    return `${year}.${month}.${transaksi.id_transaksi}`;
  };

  const generatePDF = (pengiriman: Pengiriman) => {
    try {
      // Validate input data
      if (!pengiriman || !pengiriman.transaksi) {
        throw new Error(
          "Invalid pengiriman data: Missing pengiriman or transaksi object"
        );
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Set font and size for the document
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);

      // Header: Store Name and Address
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("ReUse Mart", 10, 20, { align: "left" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 10, 25, {
        align: "left",
      });

      // Order Details (No Nota, Tanggal Pesan, Tanggal Kirim)
      doc.setFontSize(10);
      const noNota = formattedNomorTransaksi(pengiriman.transaksi) || "";
      doc.text(`No Nota`, 10, 35);
      doc.text(`: ${noNota}`, 40, 35);
      const tanggalPesan = pengiriman.transaksi.tanggal_transaksi
        ? formatDate(pengiriman.transaksi.tanggal_transaksi)
        : "";
      doc.text(`Tanggal pesan`, 10, 40);
      doc.text(`: ${tanggalPesan}`, 40, 40);
      const tanggalPembayaran = pengiriman.tanggal
        ? formatDate(pengiriman.transaksi.tanggal_pembayaran)
        : "";
      doc.text(`Lunas pada`, 10, 45);
      doc.text(`: ${tanggalPembayaran}`, 40, 45);
      const tanggalKirim = pengiriman.tanggal
        ? formatDate(pengiriman.tanggal)
        : "";
      doc.text(`Tanggal kirim`, 10, 50);
      doc.text(`: ${tanggalKirim}`, 40, 50);

      // Separator Line
      doc.setLineWidth(0.5);
      doc.line(10, 55, 200, 55);

      // Buyer Information (Static for now, replace with dynamic data if available)
      doc.setFont("helvetica", "bold");
      doc.text(`PEMBELI :`, 10, 60);
      doc.setFont("helvetica", "normal");
      doc.text(
        `${pengiriman.transaksi.pembeli.email} / ${pengiriman.transaksi.pembeli.nama}`,
        30,
        60
      );
      doc.setFont("helvetica", "normal");
      doc.text(`${pengiriman.transaksi.alamat.detail_alamat}`, 10, 65);
      const kurirNama = pengiriman.kurir?.nama || "";
      doc.text(`Delivery: Kurir ReUseMart (${kurirNama})`, 10, 70);

      // Items Section (Using detail_transaksi if available, otherwise static)
      let currentY = 80;
      doc.setFont("helvetica", "bold");
      let totalItemsPrice = 0;

      if (
        pengiriman.transaksi.detail_transaksi &&
        pengiriman.transaksi.detail_transaksi.length > 0
      ) {
        pengiriman.transaksi.detail_transaksi.forEach(
          (item: DetailTransaksi) => {
            doc.setFont("helvetica", "normal");
            doc.text(`${item.barang.nama_barang || ""}`, 10, currentY);
            const subtotal = item.barang.harga || 0;
            doc.text(`${subtotal.toLocaleString()}`, 200, currentY, {
              align: "right",
            });
            totalItemsPrice += subtotal;
            currentY += 5;
          }
        );
      }

      currentY += 5;

      // Total Items Price
      doc.setFont("helvetica", "normal");
      doc.text("Total", 10, currentY);
      doc.text(`${totalItemsPrice.toLocaleString()}`, 200, currentY, {
        align: "right",
      });
      currentY += 5;

      // Shipping Cost
      doc.setFont("helvetica", "normal");
      const ongkosKirim = pengiriman.transaksi.ongkos_kirim || 0;
      doc.text("Ongkos Kirim", 10, currentY);
      doc.text(`${ongkosKirim.toLocaleString()}`, 200, currentY, {
        align: "right",
      });
      currentY += 5;

      // Total Kirim
      const totalKirim = totalItemsPrice + ongkosKirim;
      doc.setFont("helvetica", "normal");
      doc.text("Total", 10, currentY);
      doc.text(`${totalKirim.toLocaleString()}`, 200, currentY, {
        align: "right",
      });
      currentY += 5;

      // Discount
      doc.setFont("helvetica", "normal");
      const potonganPoin = pengiriman.transaksi.potongan_poin || 0;
      const potonganValue = potonganPoin * 0.01 * 10000;
      doc.text(`Potongan ${potonganPoin} poin`, 10, currentY);
      doc.text(`- ${potonganValue.toLocaleString()}`, 200, currentY, {
        align: "right",
      });
      currentY += 5;

      // Final Total
      const totalAkhir =
        pengiriman.transaksi.total_akhir || totalKirim - potonganValue;
      doc.setFont("helvetica", "normal");
      doc.text("Total", 10, currentY);
      doc.text(`${totalAkhir.toLocaleString()}`, 200, currentY, {
        align: "right",
      });
      currentY += 10;

      // Points Information (Static for now, adjust with dynamic data if available)
      doc.setFont("helvetica", "normal");
      doc.text(
        `Poin dari pesanan ini: ${pengiriman.transaksi.total_poin}`,
        10,
        currentY
      );
      currentY += 5;
      doc.text(
        `Total poin customer: ${pengiriman.transaksi.pembeli.poin_loyalitas}`,
        10,
        currentY
      );
      currentY += 10;

      // QC Information
      // doc.text("QC oleh: Farida (P18)", 10, currentY);
      // currentY += 5;
      doc.setFont("helvetica", "normal");
      doc.text("QC oleh:", 10, currentY);
      currentY += 5;
      if (
        pengiriman.transaksi.detail_transaksi &&
        pengiriman.transaksi.detail_transaksi.length > 0
      ) {
        pengiriman.transaksi.detail_transaksi.forEach(
          (item: DetailTransaksi) => {
            doc.setFont("helvetica", "normal");
            doc.text(
              `${item.barang.nama_qc} (${item.barang.id_qc})`,
              10,
              currentY
            );
            currentY += 5;
          }
        );
      }

      currentY += 10;

      // Accepted By
      doc.text("Diterima oleh:", 20, currentY);
      currentY += 25;
      doc.text("(............................................)", 10, currentY);
      currentY += 5;
      doc.text("Tanggal: ...............................", 10, currentY);

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Attempt to open the PDF in a new tab for preview
      try {
        const newWindow = window.open(pdfUrl, "_blank");
        if (!newWindow) {
          throw new Error(
            "Failed to open new window. Popups may be blocked or there may be a network issue."
          );
        }
        // Clean up the URL object after a delay to ensure the window has time to load
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 5000);
      } catch (previewError) {
        console.warn("Preview failed:", previewError);
        // Fallback: Trigger a direct download if the preview fails
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `Nota_Pengiriman_${pengiriman.id_pengiriman}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
        alert(
          "Unable to preview the PDF due to a network issue or popup blocking. The PDF has been downloaded instead."
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error generating PDF:", errorMessage, error);
      alert(
        `An error occurred while generating the PDF: ${errorMessage}. Please check the console for more details and try again.`
      );
    }
  };

  const renderEditModal = () => (
    <Modal
      show={openEditModal}
      size="md"
      onClose={() => setOpenEditModal(false)}
      popup
    >
      <ModalHeader />
      <ModalBody>
        <form className="space-y-6" onSubmit={handleUpdate}>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Atur Pengiriman
          </h3>
          {editError && (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
              {editError}
            </div>
          )}
          {editSuccess && (
            <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">
              {editSuccess}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <Label htmlFor="tanggal">Tanggal Pengiriman</Label>
              <TextInput
                id="tanggal"
                type="datetime-local"
                value={formData.tanggal}
                onChange={(e) => handleInputChange("tanggal", e.target.value)}
                required
                color={formErrors["tanggal"] ? "failure" : undefined}
                min={
                  pengiriman?.transaksi?.tanggal_transaksi &&
                  new Date(pengiriman.transaksi.tanggal_transaksi).getHours() >=
                    16
                    ? new Date(
                        new Date(
                          pengiriman.transaksi.tanggal_transaksi
                        ).setDate(
                          new Date(
                            pengiriman.transaksi.tanggal_transaksi
                          ).getDate() + 1
                        )
                      )
                        .toISOString()
                        .slice(0, 16)
                    : new Date().toISOString().slice(0, 16)
                }
              />
              {formErrors["tanggal"] && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors["tanggal"]}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="id_kurir">Kurir</Label>
              <TextInput
                id="kurir_search"
                placeholder="Cari kurir (nama atau email)..."
                value={kurirSearch}
                onChange={(e) => setKurirSearch(e.target.value)}
                className="mb-2"
              />
              <Select
                id="id_kurir"
                value={formData.id_kurir}
                onChange={(e) => handleInputChange("id_kurir", e.target.value)}
                required
                color={formErrors["id_kurir"] ? "failure" : undefined}
              >
                <option value="">Pilih Kurir</option>
                {filteredKurir.map((kurir) => (
                  <option key={kurir.id_pegawai} value={kurir.id_pegawai}>
                    {`${kurir.nama} (${kurir.email})`}
                  </option>
                ))}
              </Select>
              {formErrors["id_kurir"] && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors["id_kurir"]}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#1980e6] hover:bg-[#1980e6]/80"
            >
              Atur Pengiriman
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );

  return (
    <div className="flex-1 p-4 ml-64">
      <h1 className="text-4xl font-bold mt-12 mb-4">Data Pengiriman</h1>
      <div className="flex justify-between items-center my-5">
        <form className="flex gap-3" onSubmit={handleSearch}>
          <TextInput
            type="text"
            name="search-pengiriman"
            id="search-pengiriman"
            className="w-72"
            placeholder="Cari pengiriman"
          />
          <Select
            name="status-filter"
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Button type="submit" className="p-3 bg-blue-500 text-white">
            <HiSearch />
          </Button>
        </form>
      </div>
      <div className="w-full overflow-x-auto">
        <Table hoverable className="w-full border-1">
          <TableHead>
            <TableRow>
              <TableHeadCell>No.</TableHeadCell>
              <TableHeadCell>Nomor Transaksi</TableHeadCell>
              <TableHeadCell>Tanggal Transaksi</TableHeadCell>
              <TableHeadCell>Tanggal Pengiriman</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Kurir</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Error memuat data
                </TableCell>
              </TableRow>
            ) : data && data[0]?.length > 0 ? (
              data[0].map((pengiriman: Pengiriman, index: number) => (
                <TableRow
                  key={pengiriman.id_pengiriman}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>{(page - 1) * limit + index + 1}.</TableCell>
                  <TableCell>
                    {formattedNomorTransaksi(pengiriman.transaksi)}
                  </TableCell>
                  <TableCell>
                    {formatDate(pengiriman.transaksi.tanggal_transaksi)}
                  </TableCell>
                  <TableCell>{formatDate(pengiriman.tanggal)}</TableCell>
                  <TableCell>
                    {pengiriman.status_pengiriman === "SEDANG_DIKIRIM"
                      ? "Dalam Pengiriman"
                      : pengiriman.status_pengiriman === "DIPROSES"
                      ? "Diproses"
                      : pengiriman.status_pengiriman === "SUDAH_DITERIMA"
                      ? "Diterima"
                      : pengiriman.status_pengiriman === "SIAP_DIAMBIL"
                      ? "Menunggu Diambil"
                      : pengiriman.status_pengiriman}
                  </TableCell>
                  <TableCell>{pengiriman.kurir?.nama}</TableCell>
                  <TableCell>
                    <button
                      className={`font-medium ${
                        pengiriman.status_pengiriman === "DIPROSES" ||
                        pengiriman.status_pengiriman === "SEDANG_DIKIRIM"
                          ? "text-cyan-600 hover:underline dark:text-cyan-500"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (pengiriman.status_pengiriman === "DIPROSES") {
                          handleOpenEditModal(pengiriman);
                        } else if (
                          pengiriman.status_pengiriman === "SEDANG_DIKIRIM"
                        ) {
                          generatePDF(pengiriman);
                        }
                      }}
                      disabled={
                        pengiriman.status_pengiriman !== "DIPROSES" &&
                        pengiriman.status_pengiriman !== "SEDANG_DIKIRIM"
                      }
                    >
                      {pengiriman.status_pengiriman === "DIPROSES"
                        ? "Atur Pengiriman"
                        : pengiriman.status_pengiriman === "SEDANG_DIKIRIM"
                        ? "Cetak Nota"
                        : ""}
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{(page - 1) * limit + 1}</span>{" "}
          to{" "}
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
      {renderEditModal()}
    </div>
  );

  function handlePageChange(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }
}
