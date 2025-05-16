export interface Pegawai {
  id_pegawai: string;
  email: string;
  nama: string;
  nomor_telepon: string;
  komisi: number;
  tgl_lahir: string;
  jabatan: Jabatan;
  errors?: string;
}

interface Jabatan {
  id_jabatan: number;
  nama_jabatan: string;
}
