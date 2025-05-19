import { Pegawai } from "./pegawai.interface";
import { Penitip } from "./penitip.interface";

export interface Penitipan {
    id_penitipan: number,
    penitip: Penitip,
    hunter: Pegawai,
    pegawai_qc: Pegawai
}