import { Pembeli } from "../interface/pembeli.interface";
import { ResponseAPI } from "../interface/response.interface";
import { GET, POST, DELETE } from "./fetch";

// export async function getPegawai(
//   id: string,
//   accessToken?: string
// ): Promise<Pembeli> {
//   return await GET(`/pembeli/${id}`, accessToken);
// }

export async function getProfilPembeli(accessToken: string): Promise<Pembeli> {
  return await GET(`/pembeli/current`, accessToken);
}

// export async function getListPembeli(
//   params?: URLSearchParams,
//   accessToken?: string
// ): Promise<[Pembeli[], number]> {
//   return await GET(`/pembeli/lists?${params}`, accessToken);
// }

export async function createPembeli(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/pembeli`, data, accessToken);
}

// export async function updatePembeli(
//   id: string,
//   data: FormData,
//   accessToken?: string
// ): Promise<ResponseAPI> {
//   return await PATCH(`/pembeli/${id}`, data, accessToken);
// }

export async function deletePembeli(
  accessToken?: string
): Promise<ResponseAPI> {
  return await DELETE(`/pembeli/logout`, accessToken);
}

// export async function resetPasswordPembeli(
//   id: string,
//   accessToken?: string
// ): Promise<ResponseAPI> {
//   return await PATCH(`/pembeli/${id}/reset-password`, undefined, accessToken);
// }
