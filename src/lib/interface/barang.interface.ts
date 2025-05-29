import { DetailTransaksi } from "./detail-transaksi.interface";
import { Penitip } from "./penitip.interface";

export interface Barang {
  id_barang: string;
  nama_barang: string;
  deskripsi: string;
  harga: number;
  status: string;
  garansi: string;
  berat: number;
  kategori: Kategori;
  gambar: Gambar[];
  createdAt: string;
  updatedAt: string;
  penitip: Penitip;
  errors?: string;
  detail_transaksi: DetailTransaksi;
}

export interface Gambar {
  id_gambar: number;
  url_gambar: string;
  is_primary: boolean;
  id_barang: number;
}

export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
}
