import { Keranjang } from "../interface/keranjang.interface";
import { ResponseAPI } from "../interface/response.interface";
import { GET, POST, PATCH, DELETE } from "./fetch";

export async function getListKeranjang(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[Keranjang[], number]> {
  return await GET(`/keranjang/lists?${params}`, accessToken);
}

export async function createKeranjang(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/keranjang`, data, accessToken);
}

export async function updateStatusKeranjang(
  id: number,
  accessToken?: string
): Promise<ResponseAPI> {
  return await PATCH(`/keranjang/${id}`, undefined, accessToken);
}

export async function deleteKeranjang(
  id: number,
  accessToken?: string
): Promise<ResponseAPI> {
  return await DELETE(`/keranjang/${id}`, accessToken);
}
