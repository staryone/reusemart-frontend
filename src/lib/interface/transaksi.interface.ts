import { DetailTransaksi } from "./detail-transaksi.interface";
import { Pengiriman } from "./pengiriman.interface";

export interface Transaksi {
  id_transaksi: number;
  tanggal_transaksi: string;
  total_harga: number;
  status_Pembayaran: string;
  tanggal_pembayaran?: string;
  batas_pembayaran: string;
  bukti_transfer: string;
  potongan_poin: number;
  metode_pengiriman: string;
  ongkos_kirim: number;
  total_akhir: number;
  detail_transaksi: DetailTransaksi[];
  pengiriman: Pengiriman;
  errors?: string;
}

export interface TransaksiPayment {
  nomor_transaksi: string;
  id_transaksi: number;
  tanggal_transaksi: string;
  total_harga: number;
  status_Pembayaran: string;
  tanggal_pembayaran: string | null;
  batas_pembayaran: string;
  bukti_transfer: string | null;
  total_poin: number;
  potongan_poin: number;
  metode_pengiriman: string;
  ongkos_kirim: number;
  total_akhir: number;
  id_pembeli: number;
  id_alamat: number | null;
  id_cs_verif: number | null;
  updatedAt: string;
  errors?: string;
}

export interface TransaksiVerif {
  nomor_transaksi: string;
  id_transaksi: number;
  total_akhir: number;
  tanggal_transaksi: string;
  tanggal_pembayaran: string | null;
  status_Pembayaran: string;
  pembeli: {
    email: string;
    nama: string;
  };
  bukti_transfer: string;
  barang: [
    {
      id_barang: string;
      nama_barang: string;
      harga_barang: number;
    }
  ];
  cs?: {
    id_cs: string;
    nama_cs: string;
  };
}
