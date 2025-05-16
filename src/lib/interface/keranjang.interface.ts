export interface Keranjang {
  id_keranjang: number;
  id_barang: string;
  id_pembeli: string;
  is_selected: boolean;
  nama_barang: string;
  harga_barang: number;
  gambar_barang: string;
  createdAt: string;
  errors?: string;
}
