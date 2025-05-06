import { Pegawai } from "../interface/pegawai.interface";
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
): Promise<Pegawai> {
  return await POST(`/pegawai`, data, accessToken);
}

export async function updatePegawai(
  id: string,
  data: FormData,
  accessToken?: string
): Promise<Pegawai> {
  return await PATCH(`/pegawai/${id}`, data, accessToken);
}

export async function deletePegawai(
  id: string,
  accessToken?: string
): Promise<Pegawai> {
  return await DELETE(`/pegawai/${id}`, accessToken);
}

export async function resetPasswordPegawai(
  id: string,
  accessToken?: string
): Promise<Pegawai> {
  return await PATCH(`/pegawai/${id}/reset-password`, undefined, accessToken);
}
