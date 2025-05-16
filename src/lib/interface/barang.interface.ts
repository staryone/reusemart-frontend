import { Penitip } from "./penitip.interface";

export interface Barang {
  id_barang: string;
  nama_barang: string;
  deskripsi: string;
  harga: number;
  status: "TERSEDIA" | "TIDAK_TERSEDIA";
  garansi: string; // ISO date string
  berat: number;
  kategori: Kategori;
  gambar: Gambar[]; // Assuming URLs or base64 strings
  createdAt: string;
  updatedAt: string;
  penitip: Penitip;
  errors?: string;
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
