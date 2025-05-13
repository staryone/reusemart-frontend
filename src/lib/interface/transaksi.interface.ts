import { Barang } from "./barang.interface";

export interface Transaksi {
  id_transaksi: number;
  tanggal_transaksi: string;
  total_harga: number;
  status_pembayaran: string;
  tanggal_pembayaran: string;
  batas_pembayaran: string;
  bukti_transfer: string;
  potongan_poin: number;
  metode_pengiriman: string;
  ongkos_kirim: number;
  total_akhir: number;
  barang: Barang[];
}
