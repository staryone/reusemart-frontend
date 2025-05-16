export interface Diskusi {
  id_diskusi: number;
  tanggal_diskusi: string;
  pesan: string;
  id_barang: string;
  id_pembeli: number;
  nama_barang: string;
  nama: string;
  role: string;
  errors?: string;
}

export interface DiskusiPublic {
  id_diskusi: number;
  tanggal_diskusi: string;
  pesan: string;
  id_barang: string;
  id_pembeli?: number;
  id_cs?: number;
  nama: string;
  role: string;
  errors?: string;
}
