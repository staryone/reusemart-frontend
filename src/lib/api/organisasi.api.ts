import { Organisasi } from "../interface/organisasi.interface";
import { ResponseAPI } from "../interface/response.interface";
import { GET, POST, PATCH, DELETE } from "./fetch";

export async function getOrganisasi(
  id: string,
  accessToken?: string
): Promise<Organisasi> {
  return await GET(`/organisasi/${id}`, accessToken);
}

export async function getProfilOrganisasi(accessToken: string): Promise<Organisasi> {
  return await GET(`/organisasi/current`, accessToken);
}

export async function getListOrganisasi(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[Organisasi[], number]> {
  return await GET(`/organisasi/lists?${params}`, accessToken);
}

export async function createOrganisasi(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/organisasi`, data, accessToken);
}

export async function updateOrganisasi(
  id: string,
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await PATCH(`/organisasi/${id}`, data, accessToken);
}

export async function deleteOrganisasi(
  id: string,
  accessToken?: string
): Promise<ResponseAPI> {
  return await DELETE(`/organisasi/${id}`, accessToken);
}
