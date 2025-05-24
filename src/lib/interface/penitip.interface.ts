import { Penitipan } from "./penitipan.interface";

export interface Penitip {
  id_penitip: string;
  email: string;
  nomor_ktp: string;
  foto_ktp: string;
  nama: string;
  alamat: string;
  nomor_telepon: string;
  saldo: number;
  rating: number;
  total_review: number;
  jumlah_review: number;
  is_top_seller: boolean;
  total_per_bulan: number;
  poin: number;
  transaksi: [];
  penitipan: Penitipan[];
  errors?: string;
}
