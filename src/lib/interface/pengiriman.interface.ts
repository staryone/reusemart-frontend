import { Pegawai } from "./pegawai.interface";
import { Transaksi } from "./transaksi.interface";

export interface Pengiriman {
  id_pengiriman: string;
  tanggal: string;
  status_pengiriman: string;
  kurir: Pegawai;
  transaksi: Transaksi;
  createdAt: string;
  updatedAt: string;
  errors?: string;
}
