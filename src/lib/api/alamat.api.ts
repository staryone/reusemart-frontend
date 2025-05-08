import { Alamat } from "../interface/alamat.interface";
import { ResponseAPI } from "../interface/response.interface";
import { GET, POST, PATCH, DELETE } from "./fetch";

export async function getAlamat(
  id: number,
  accessToken?: string
): Promise<Alamat> {
  return await GET(`/alamat/${id}`, accessToken);
}

export async function getListAlamat(
  params?: URLSearchParams,
  accessToken?: string
): Promise<Alamat[]> {
  return await GET(`/alamat/lists?${params}`, accessToken);
}

export async function createAlamat(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/alamat`, data, accessToken);
}

export async function updateAlamat(
  id: number,
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await PATCH(`/alamat/${id}`, data, accessToken);
}

export async function deleteAlamat(
  id: number,
  accessToken?: string
): Promise<ResponseAPI> {
  return await DELETE(`/alamat/${id}`, accessToken);
}
