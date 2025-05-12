import { Alamat } from "./alamat.interface";

export interface Pembeli {
  id_pembeli: string;
  email: string;
  nama: string;
  nomor_telepon: string;
  poin_loyalitas: number;
  alamat: Alamat[];
  // transaksi: Transaksi[];
}
