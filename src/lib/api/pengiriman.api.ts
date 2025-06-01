import { Pengiriman } from "../interface/pengiriman.interface";
import { ResponseAPI } from "../interface/response.interface";
import { Pegawai } from "../interface/pegawai.interface";
import { GET, POST, PATCH, DELETE } from "./fetch";

export async function getPengiriman(
  id: string,
  accessToken?: string
): Promise<Pengiriman> {
  return await GET(`/pengiriman/${id}`, accessToken);
}

export async function getListPengiriman(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[Pengiriman[], number]> {
  return await GET(`/pengiriman/lists?${params}`, accessToken);
}

export async function createPengiriman(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/pengiriman`, data, accessToken);
}

export async function updatePengiriman(
  id: string,
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await PATCH(`/pengiriman/${id}`, data, accessToken);
}

export async function deletePengiriman(
  id: string,
  accessToken?: string
): Promise<ResponseAPI> {
  return await DELETE(`/pengiriman/${id}`, accessToken);
}

export async function getListKurir(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[Pegawai[], number]> {
  const query = new URLSearchParams(params);
  query.append("id_jabatan", "5");
  return await GET(`/pegawai/lists?${query}`, accessToken);
}
