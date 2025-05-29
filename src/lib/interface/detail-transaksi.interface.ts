import { Barang } from "./barang.interface";

export interface DetailTransaksi {
  is_rating: boolean;
  komisi_hunter: number;
  komisi_penitip: number;
  komisi_reusemart: number;
  barang: Barang;
}
