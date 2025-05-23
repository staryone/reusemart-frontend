import { Pegawai } from "./pegawai.interface";
import { Penitip } from "./penitip.interface";
import { DetailPenitipan } from "./detail-penitipan.interface";

export interface Penitipan {
  id_penitipan: number;
  penitip: Penitip;
  hunter: Pegawai;
  pegawai_qc: Pegawai;
  detail_penitipan: DetailPenitipan[];
}
