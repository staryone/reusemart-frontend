import { Barang } from "../interface/barang.interface";
import { GET } from "./fetch";

export async function getBarang(
  id?: string,
): Promise<Barang> {
  return await GET(`/barang/${id}`);
}

export async function getListBarang(
  params?: URLSearchParams,
): Promise<[Barang[], number]> {
  return await GET(`/barang/lists?${params}`);
}
