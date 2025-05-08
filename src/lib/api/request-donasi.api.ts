import { RequestDonasi } from "../interface/request-donasi.interface";
import { ResponseAPI } from "../interface/response.interface";
import { GET, POST, PATCH, DELETE } from "./fetch";

export async function getRequestDonasi(
  id: number,
  accessToken?: string
): Promise<RequestDonasi> {
  return await GET(`/request-donasi/${id}`, accessToken);
}

export async function getListRequestDonasi(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[RequestDonasi[], number]> {
  return await GET(`/request-donasi/lists?${params}`, accessToken);
}

export async function getAllListRequestDonasi(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[RequestDonasi[], number]> {
  return await GET(`/request-donasi/allLists`, accessToken);
}

export async function createRequestDonasi(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/request-donasi`, data, accessToken);
}

export async function updateRequestDonasi(
  id: number,
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await PATCH(`/request-donasi/${id}`, data, accessToken);
}

export async function deleteRequestDonasi(
  id: number,
  accessToken?: string
): Promise<ResponseAPI> {
  return await DELETE(`/request-donasi/${id}`, accessToken);
}
