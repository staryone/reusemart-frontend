import { DetailTransaksi } from "./detail-transaksi.interface";
import { Pengiriman } from "./pengiriman.interface";

export interface Transaksi {
  id_transaksi: number;
  tanggal_transaksi: string;
  total_harga: number;
  status_Pembayaran: string;
  tanggal_pembayaran: string;
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
