import { Kategori } from "../interface/barang.interface";
import { Pegawai } from "../interface/pegawai.interface";
import { ResponseAPI } from "../interface/response.interface";
import { GET, POST, PATCH, DELETE } from "./fetch";

export async function getPegawai(
  id: string,
  accessToken?: string
): Promise<Pegawai> {
  return await GET(`/pegawai/${id}`, accessToken);
}

export async function getProfilPegawai(accessToken: string): Promise<Pegawai> {
  return await GET(`/pegawai/current`, accessToken);
}

export async function getListPegawai(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[Pegawai[], number]> {
  return await GET(`/pegawai/lists?${params}`, accessToken);
}

export async function createPegawai(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/pegawai`, data, accessToken);
}

export async function updatePegawai(
  id: string,
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await PATCH(`/pegawai/${id}`, data, accessToken);
}

export async function deletePegawai(
  id: string,
  accessToken?: string
): Promise<ResponseAPI> {
  return await DELETE(`/pegawai/${id}`, accessToken);
}

export async function resetPasswordPegawai(
  id: string,
  accessToken?: string
): Promise<ResponseAPI> {
  return await PATCH(`/pegawai/${id}/reset-password`, undefined, accessToken);
}

export async function updateBarangStatus(
  data: { id_barang: string; status: string },
  accessToken?: string
): Promise<ResponseAPI> {
  const formData = new FormData();
  formData.append("id_barang", data.id_barang);
  formData.append("status", data.status);
  return await PATCH(`/pegawai/status-barang`, formData, accessToken);
}

export async function getCategoryStats(
  year?: number,
  accessToken?: string
): Promise<Kategori[]> {
  const params = year
    ? new URLSearchParams({ year: year.toString() })
    : undefined;
  return await GET(
    `/owner/get-category-stats${params ? `?${params}` : ""}`,
    accessToken
  );
}

export async function getExpiredItems(accessToken?: string): Promise<any[]> {
  return await GET(`/owner/get-expired-items`, accessToken);
}
