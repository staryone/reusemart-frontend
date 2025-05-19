export interface Keranjang {
  id_keranjang: number;
  id_barang: string;
  id_pembeli: number;
  id_penitip: number;
  is_selected: boolean;
  nama_penitip: string;
  nama_barang: string;
  harga_barang: number;
  gambar_barang: string;
  kategori_barang: string;
  createdAt: string;
  errors?: string;
}
