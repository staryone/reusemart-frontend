import { Penitip } from "./penitip.interface";

export interface Barang {
    id_barang: string;
    nama_barang: string;
    deskripsi: string;
    harga: number;
    status: 'TERSEDIA' | 'TIDAK_TERSEDIA';
    garansi: string; // ISO date string
    berat: number;
    kategori: Kategori;
    gambar: string[]; // Assuming URLs or base64 strings
    createdAt: string;
    updatedAt: string;
    penitip: Penitip;
  }

export interface Kategori {
    id_kategori: number;
    nama_kategori: string;
}