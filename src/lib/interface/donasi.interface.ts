import { Barang } from "./barang.interface";
import { RequestDonasi } from "./request-donasi.interface";

export interface Donasi {
  id_donasi: number;
  tanggal_donasi: string;
  nama_penerima: string;
  poin_penitip: number;
  barang: Barang;
  request: RequestDonasi
}
