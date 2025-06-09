// "use client";

// import { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeadCell,
//   TableRow,
//   Button,
// } from "flowbite-react";
// import { getExpiredItems } from "@/lib/api/pegawai.api";
// import { useUser } from "@/hooks/use-user";
// import useSWR from "swr";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { format } from "date-fns";
// import { id } from "date-fns/locale";

// const fetcher = async ([token]: [string]) => await getExpiredItems(token);

// export default function ExpiredItemsPage() {
//   const currentUser = useUser();
//   const token = currentUser !== null ? currentUser.token : "";
//   const [totalItems, setTotalItems] = useState(0);

//   const { data, error, isLoading, mutate } = useSWR([token], fetcher, {
//     revalidateIfStale: false,
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//   });

//   useEffect(() => {
//     if (data) {
//       setTotalItems(data.length);
//     }
//   }, [data]);

//   const generatePDF = () => {
//     try {
//       if (!data || data.length === 0) {
//         throw new Error("No data available to generate PDF");
//       }

//       const doc = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//       });

//       // Header: Store Name and Address
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(14);
//       doc.text("ReUse Mart", 10, 10);
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "normal");
//       doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 10, 15);

//       // Report Title and Date
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(12);
//       const title = "LAPORAN PENJUALAN PER KATEGORI BARANG";
//       const titleX = 10;
//       const titleY = 24;
//       doc.text(title, titleX, titleY);

//       // Calculate text width for underline
//       const textWidth = doc.getTextWidth(title);
//       doc.setLineWidth(0.5);
//       doc.line(titleX, titleY + 1, titleX + textWidth, titleY + 1);
//       doc.setFont("helvetica", "normal");
//       const cetakDate = format(new Date(), "dd MMMM yyyy", { locale: id });
//       doc.text(`Tanggal cetak: ${cetakDate}`, 10, 30);

//       // Prepare table data with fallback for invalid dates
//       const tableData = data.map((item) => [
//         item.kode_produk || "N/A",
//         item.nama_produk || "N/A",
//         item.id_penitip || "N/A",
//         item.nama_penitip || "N/A",
//         item.tanggal_masuk
//           ? format(new Date(item.tanggal_masuk), "dd/MM/yyyy", { locale: id })
//           : "N/A",
//         item.tanggal_akhir
//           ? format(new Date(item.tanggal_akhir), "dd/MM/yyyy", { locale: id })
//           : "N/A",
//         item.batas_ambil
//           ? format(new Date(item.batas_ambil), "dd/MM/yyyy", { locale: id })
//           : "N/A",
//       ]);

//       // Generate table
//       autoTable(doc, {
//         startY: 40,
//         head: [
//           [
//             "Kode Produk",
//             "Nama Produk",
//             "Id Penitip",
//             "Nama Penitip",
//             "Tanggal Masuk",
//             "Tanggal Akhir",
//             "Batas Ambil",
//           ],
//         ],
//         body: tableData,
//         theme: "grid",
//         headStyles: {
//           fillColor: [200, 200, 200],
//           textColor: [0, 0, 0],
//           fontSize: 10,
//           halign: "center",
//         },
//         bodyStyles: { fontSize: 8 },
//         columnStyles: {
//           0: { cellWidth: 20 },
//           1: { cellWidth: 40 },
//           2: { cellWidth: 20 },
//           3: { cellWidth: 30 },
//           4: { cellWidth: 25 },
//           5: { cellWidth: 25 },
//           6: { cellWidth: 25 },
//         },
//         margin: { top: 10 },
//       });

//       // Add footer (ReUse Mart address)
//       doc.setFontSize(8);
//       doc.text("ReUse Mart", 10, doc.internal.pageSize.height - 10);
//       doc.text(
//         "Jl. Green Eco Park No. 456 Yogyakarta",
//         10,
//         doc.internal.pageSize.height - 5
//       );

//       const pdfBlob = doc.output("blob");
//       const pdfUrl = URL.createObjectURL(pdfBlob);

//       const newWindow = window.open(pdfUrl, "_blank");
//       if (!newWindow) {
//         throw new Error("Failed to open new window. Popups may be blocked.");
//       }
//       setTimeout(() => URL.revokeObjectURL(pdfUrl), 5000);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       alert("An error occurred while generating the PDF. Please try again.");
//     }
//   };

//   return (
//     <div className="flex-1 p-4 ml-64">
//       <h1 className="text-4xl font-bold mt-12 mb-4">
//         Laporan Barang yang Masa Penitipannya Sudah Habis
//       </h1>
//       <div className="flex justify-between items-center my-5">
//         <div className="flex gap-3">
//           <Button onClick={generatePDF} className="p-3 bg-blue-500 text-white">
//             Cetak PDF
//           </Button>
//         </div>
//       </div>
//       <div className="w-full overflow-x-auto">
//         <Table hoverable className="w-full border-1">
//           <TableHead>
//             <TableRow>
//               <TableHeadCell>Kode Produk</TableHeadCell>
//               <TableHeadCell>Nama Produk</TableHeadCell>
//               <TableHeadCell>Id Penitip</TableHeadCell>
//               <TableHeadCell>Nama Penitip</TableHeadCell>
//               <TableHeadCell>Tanggal Masuk</TableHeadCell>
//               <TableHeadCell>Tanggal Akhir</TableHeadCell>
//               <TableHeadCell>Batas Ambil</TableHeadCell>
//             </TableRow>
//           </TableHead>
//           <TableBody className="divide-y">
//             {isLoading ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center">
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : error ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center">
//                   Error memuat data: {error.message}
//                 </TableCell>
//               </TableRow>
//             ) : data && data.length > 0 ? (
//               data.map((item, index) => (
//                 <TableRow
//                   key={index}
//                   className="bg-white dark:border-gray-700 dark:bg-gray-800"
//                 >
//                   <TableCell>{item.kode_produk || "N/A"}</TableCell>
//                   <TableCell>{item.nama_produk || "N/A"}</TableCell>
//                   <TableCell>{item.id_penitip || "N/A"}</TableCell>
//                   <TableCell>{item.nama_penitip || "N/A"}</TableCell>
//                   <TableCell>
//                     {item.tanggal_masuk
//                       ? format(new Date(item.tanggal_masuk), "dd/MM/yyyy", {
//                           locale: id,
//                         })
//                       : "N/A"}
//                   </TableCell>
//                   <TableCell>
//                     {item.tanggal_akhir
//                       ? format(new Date(item.tanggal_akhir), "dd/MM/yyyy", {
//                           locale: id,
//                         })
//                       : "N/A"}
//                   </TableCell>
//                   <TableCell>
//                     {item.batas_ambil
//                       ? format(new Date(item.batas_ambil), "dd/MM/yyyy", {
//                           locale: id,
//                         })
//                       : "N/A"}
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center">
//                   Tidak ada data
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
} from "flowbite-react";
import { getExpiredItems } from "@/lib/api/pegawai.api";
import { useUser } from "@/hooks/use-user";
import useSWR from "swr";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const fetcher = async ([token]: [string]) => await getExpiredItems(token);

export default function ExpiredItemsPage() {
  const currentUser = useUser();
  const token = currentUser !== null ? currentUser.token : "";
  const [totalItems, setTotalItems] = useState(0);

  const { data, error, isLoading, mutate } = useSWR([token], fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (data) {
      setTotalItems(data.length);
    }
  }, [data]);

  const generatePDF = () => {
    try {
      if (!data || data.length === 0) {
        throw new Error("No data available to generate PDF");
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Header: Store Name and Address
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("ReUse Mart", 10, 10);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 10, 15);

      // Report Title and Date
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      const title = "LAPORAN Barang yang Masa Penitipannya Sudah Habis";
      const titleX = 10;
      const titleY = 24;
      doc.text(title, titleX, titleY);

      // Calculate text width for underline
      const textWidth = doc.getTextWidth(title);
      doc.setLineWidth(0.5);
      doc.line(titleX, titleY + 1, titleX + textWidth, titleY + 1);
      doc.setFont("helvetica", "normal");
      const cetakDate = format(new Date(), "dd MMMM yyyy", { locale: id });
      doc.text(`Tanggal cetak: ${cetakDate}`, 10, 30);

      // Prepare table data with fallback for invalid dates
      const tableData = data.map((item) => [
        item.kode_produk || "N/A",
        item.nama_produk || "N/A",
        item.id_penitip || "N/A",
        item.nama_penitip || "N/A",
        item.tanggal_masuk
          ? format(new Date(item.tanggal_masuk), "dd/MM/yyyy", { locale: id })
          : "N/A",
        item.tanggal_akhir
          ? format(new Date(item.tanggal_akhir), "dd/MM/yyyy", { locale: id })
          : "N/A",
        item.batas_ambil
          ? format(new Date(item.batas_ambil), "dd/MM/yyyy", { locale: id })
          : "N/A",
      ]);

      // Generate table
      autoTable(doc, {
        startY: 35,
        head: [
          [
            "Kode Produk",
            "Nama Produk",
            "Id Penitip",
            "Nama Penitip",
            "Tanggal Masuk",
            "Tanggal Akhir",
            "Batas Ambil",
          ],
        ],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [200, 200, 200],
          textColor: [0, 0, 0],
          fontSize: 10,
          halign: "center",
        },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 20, halign: "center" }, // Kode Produk
          1: { cellWidth: 40, halign: "left" }, // Nama Produk
          2: { cellWidth: 20, halign: "center" }, // Id Penitip
          3: { cellWidth: 30, halign: "left" }, // Nama Penitip
          4: { cellWidth: 25, halign: "center" }, // Tanggal Masuk
          5: { cellWidth: 25, halign: "center" }, // Tanggal Akhir
          6: { cellWidth: 25, halign: "center" }, // Batas Ambil
        },
        margin: { top: 10 },
      });

      // Add footer (ReUse Mart address)
      doc.setFontSize(8);
      doc.text("ReUse Mart", 10, doc.internal.pageSize.height - 10);
      doc.text(
        "Jl. Green Eco Park No. 456 Yogyakarta",
        10,
        doc.internal.pageSize.height - 5
      );

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const newWindow = window.open(pdfUrl, "_blank");
      if (!newWindow) {
        throw new Error("Failed to open new window. Popups may be blocked.");
      }
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 5000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    }
  };

  return (
    <div className="flex-1 p-4 ml-64">
      <h1 className="text-4xl font-bold mt-12 mb-4">
        Laporan Barang yang Masa Penitipannya Sudah Habis
      </h1>
      <div className="flex justify-between items-center my-5">
        <div className="flex gap-3">
          <Button onClick={generatePDF} className="p-3 bg-blue-500 text-white">
            Cetak PDF
          </Button>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <Table hoverable className="w-full border-1">
          <TableHead>
            <TableRow>
              <TableHeadCell className="text-center">Kode Produk</TableHeadCell>
              <TableHeadCell>Nama Produk</TableHeadCell>
              <TableHeadCell className="text-center">Id Penitip</TableHeadCell>
              <TableHeadCell>Nama Penitip</TableHeadCell>
              <TableHeadCell className="text-center">
                Tanggal Masuk
              </TableHeadCell>
              <TableHeadCell className="text-center">
                Tanggal Akhir
              </TableHeadCell>
              <TableHeadCell className="text-center">Batas Ambil</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Error memuat data: {error.message}
                </TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map((item, index) => (
                <TableRow
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell className="text-center">
                    {item.kode_produk || "N/A"}
                  </TableCell>
                  <TableCell>{item.nama_produk || "N/A"}</TableCell>
                  <TableCell className="text-center">
                    {item.id_penitip || "N/A"}
                  </TableCell>
                  <TableCell>{item.nama_penitip || "N/A"}</TableCell>
                  <TableCell className="text-center">
                    {item.tanggal_masuk
                      ? format(new Date(item.tanggal_masuk), "dd/MM/yyyy", {
                          locale: id,
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.tanggal_akhir
                      ? format(new Date(item.tanggal_akhir), "dd/MM/yyyy", {
                          locale: id,
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.batas_ambil
                      ? format(new Date(item.batas_ambil), "dd/MM/yyyy", {
                          locale: id,
                        })
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
