import { Organisasi } from "./organisasi.interface";


export interface RequestDonasi {
  id_request: number;
  deskripsi: string;
  tanggal_request: string;
  status: string;
  nama_organisasi: string;
  id_organisasi: number;
  organisasi: Organisasi;
}
