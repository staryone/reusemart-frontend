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
import { HiSearch } from "react-icons/hi";
import {
  getListPengirimanDiambil,
  updatePengambilan,
  konfirmasiPengambilan,
} from "@/lib/api/pengiriman.api";
import { useUser } from "@/hooks/use-user";
import { Pengiriman } from "@/lib/interface/pengiriman.interface";
import { DetailTransaksi } from "@/lib/interface/detail-transaksi.interface";
import { Transaksi } from "@/lib/interface/transaksi.interface";
import useSWR from "swr";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import jsPDF from "jspdf";
import DetailPengambilanModal from "@/components/gudang/detail-pengambilan-modal";

const fetcher = async ([params, token]: [URLSearchParams, string]) =>
  await getListPengirimanDiambil(params, token);

export default function PengambilanMaster() {
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [editPengirimanId, setEditPengirimanId] = useState<string | null>(null);
  const [selectedPengiriman, setSelectedPengiriman] =
    useState<Pengiriman | null>(null);
  const [pengambilan, setPengambilan] = useState<Pengiriman>();
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [confirmSuccess, setConfirmSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("DIPROSES");

  const [formData, setFormData] = useState({
    tanggal: "",
    status_pengiriman: "",
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
    { value: "SIAP_DIAMBIL", label: "Menunggu Diambil" },
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

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.tanggal) newErrors["tanggal"] = "Tanggal is required";
    if (!formData.status_pengiriman)
      newErrors["status_pengiriman"] = "Status is required";
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

    try {
      const res = await updatePengambilan(formDataToSend, token);
      if (!res.errors) {
        setEditSuccess("Pengambilan updated successfully");
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

  const handleConfirm = async () => {
    setConfirmError(null);
    setConfirmSuccess(null);

    if (!editPengirimanId) return;

    const formDataToSend = new FormData();
    formDataToSend.append("id_pengiriman", editPengirimanId);
    formDataToSend.append("tanggal", formData.tanggal);

    try {
      const res = await konfirmasiPengambilan(formDataToSend, token);
      if (!res.errors) {
        setConfirmSuccess("Pengambilan berhasil dikonfirmasi");
        mutate();
        setTimeout(() => setOpenConfirmModal(false), 2000);
      } else {
        throw new Error(res.errors || "Gagal mengkonfirmasi pengambilan");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengkonfirmasi pengambilan";
      setConfirmError(errorMessage);
      console.error("Error confirming pengambilan:", error);
    }
  };

  const handleOpenEditModal = (pengiriman: Pengiriman) => {
    setEditPengirimanId(pengiriman.id_pengiriman);
    setPengambilan(pengiriman);
    setFormData({
      tanggal: pengiriman.tanggal ?? "",
      status_pengiriman: pengiriman.status_pengiriman,
    });
    setOpenEditModal(true);
  };

  const handleOpenConfirmModal = (pengiriman: Pengiriman) => {
    setEditPengirimanId(pengiriman.id_pengiriman);
    setPengambilan(pengiriman);
    setFormData({
      tanggal: pengiriman.tanggal ?? "",
      status_pengiriman: pengiriman.status_pengiriman,
    });
    setOpenConfirmModal(true);
  };

  const handleOpenDetailModal = (pengiriman: Pengiriman) => {
    setSelectedPengiriman(pengiriman);
    setOpenDetailModal(true);
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

  const formattedNomorTransaksi = (transaksi: Transaksi): string => {
    const date = new Date(transaksi.tanggal_transaksi);
    const year = format(date, "yy", { locale: id });
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
      doc.text(`Tanggal ambil`, 10, 50);
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
      doc.text(`Delivery: - (diambil sendiri)`, 10, 65);

      let currentY = 75;
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
      doc.text("Ongkos Kirim", 10, currentY);
      doc.text(`0`, 200, currentY, {
        align: "right",
      });
      currentY += 5;

      // Total Kirim
      doc.setFont("helvetica", "normal");
      doc.text("Total", 10, currentY);
      doc.text(`${totalItemsPrice}`, 200, currentY, {
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
        pengiriman.transaksi.total_akhir || totalItemsPrice - potonganValue;
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
            Atur Pengambilan
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
                  pengambilan?.transaksi?.tanggal_transaksi &&
                  new Date(
                    pengambilan.transaksi.tanggal_transaksi
                  ).getHours() >= 16
                    ? new Date(
                        new Date(
                          pengambilan.transaksi.tanggal_transaksi
                        ).setDate(
                          new Date(
                            pengambilan.transaksi.tanggal_transaksi
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
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#1980e6] hover:bg-[#1980e6]/80"
            >
              Atur Pengambilan
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );

  const renderConfirmModal = () => (
    <Modal
      show={openConfirmModal}
      size="md"
      onClose={() => setOpenConfirmModal(false)}
      popup
    >
      <ModalHeader />
      <ModalBody>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Konfirmasi Pengambilan
          </h3>
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Apakah Anda yakin ingin mengkonfirmasi pengambilan ini?
          </p>
          {confirmError && (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
              {confirmError}
            </div>
          )}
          {confirmSuccess && (
            <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">
              {confirmSuccess}
            </div>
          )}
          <div className="flex justify-end gap-4">
            <Button color="gray" onClick={() => setOpenConfirmModal(false)}>
              Batal
            </Button>
            <Button
              className="bg-[#1980e6] hover:bg-[#1980e6]/80"
              onClick={handleConfirm}
            >
              Konfirmasi
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );

  return (
    <div className="flex-1 p-4 ml-64">
      <h1 className="text-4xl font-bold mt-12 mb-4">Data Pengambilan</h1>
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
              <TableHeadCell>Tanggal Pengambilan</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
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
                    {pengiriman.status_pengiriman === "DIPROSES"
                      ? "Diproses"
                      : pengiriman.status_pengiriman === "SUDAH_DITERIMA"
                      ? "Diterima"
                      : pengiriman.status_pengiriman === "SIAP_DIAMBIL"
                      ? "Menunggu Diambil"
                      : pengiriman.status_pengiriman}
                  </TableCell>
                  <TableCell>
                    <button
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                      onClick={() => {
                        if (pengiriman.status_pengiriman === "DIPROSES") {
                          handleOpenEditModal(pengiriman);
                        } else if (
                          pengiriman.status_pengiriman === "SIAP_DIAMBIL"
                        ) {
                          handleOpenConfirmModal(pengiriman);
                        } else if (
                          pengiriman.status_pengiriman === "SUDAH_DITERIMA"
                        ) {
                          generatePDF(pengiriman);
                        }
                      }}
                    >
                      {pengiriman.status_pengiriman === "DIPROSES"
                        ? "Atur Pengambilan"
                        : pengiriman.status_pengiriman === "SIAP_DIAMBIL"
                        ? "Konfirmasi"
                        : "Cetak Nota"}
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                      onClick={() => handleOpenDetailModal(pengiriman)}
                    >
                      Lihat Detail
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
      {renderConfirmModal()}
      <DetailPengambilanModal
        isOpen={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        pengiriman={selectedPengiriman}
      />
    </div>
  );

  function handlePageChange(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }
}
