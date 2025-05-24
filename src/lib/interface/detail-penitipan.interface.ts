import { Barang } from "./barang.interface";
import { Penitipan } from "./penitipan.interface";

export interface DetailPenitipan {
  id_dtl_penitipan: number;
    penitipan: Penitipan;
  barang: Barang;
  tanggal_masuk: string;
  tanggal_akhir: string;
  tanggal_laku: string;
  batas_ambil: string;
  is_perpanjang: boolean;
  // gambar: Gambar[];
}
