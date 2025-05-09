import { Barang } from "../interface/barang.interface";
import { GET } from "./fetch";

export async function getBarang(
  id: number,
  accessToken?: string
): Promise<Barang> {
  return await GET(`/barang/${id}`, accessToken);
}

export async function getListBarang(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[Barang[], number]> {
  return await GET(`/barang/lists?${params}`, accessToken);
}
