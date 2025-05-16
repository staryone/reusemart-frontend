import { Alamat } from "./alamat.interface";
import { Transaksi } from "./transaksi.interface";

export interface Pembeli {
  id_pembeli: string;
  email: string;
  nama: string;
  nomor_telepon: string;
  poin_loyalitas: number;
  alamat: Alamat[];
  transaksi: Transaksi[];
  errors?: string;
}
