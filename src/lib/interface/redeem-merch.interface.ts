import { Merchandise } from "./merchandise.interface";
import { Pembeli } from "./pembeli.interface";

export interface RedeemMerch {
  id_redeem_merch: number;
  tanggal_redeem: string;
  tanggal_ambil: string;
  pembeli: Pembeli;
  merchandise: Merchandise;
  jumlah_merch: number;
  status: string;
}
