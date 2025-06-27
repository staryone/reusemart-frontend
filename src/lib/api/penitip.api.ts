import { Penitip } from "../interface/penitip.interface";
import { ResponseAPI } from "../interface/response.interface";
import { DetailPenitipan } from "../interface/detail-penitipan.interface";
import { GET, POST, PATCH, DELETE } from "./fetch";

export async function getPegawai(
  id: string,
  accessToken?: string
): Promise<Penitip> {
  return await GET(`/penitip/${id}`, accessToken);
}

export async function getProfilPenitip(accessToken: string): Promise<Penitip> {
  return await GET(`/penitip/current`, accessToken);
}

export async function getListPenitip(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[Penitip[], number]> {
  return await GET(`/penitip/lists?${params}`, accessToken);
}

export async function getListHistoryPenjualan(
  accessToken: string
): Promise<any> {
  return await GET(`/penitip/history-penjualan`, accessToken);
}

export async function createPenitip(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/penitip`, data, accessToken);
}

export async function updatePenitip(
  id: string,
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await PATCH(`/penitip/${id}`, data, accessToken);
}

export async function deletePenitip(
  id: string,
  accessToken?: string
): Promise<ResponseAPI> {
  return await DELETE(`/penitip/${id}`, accessToken);
}

export async function extendPenitipan(
  id_dtl_penitipan: number,
  accessToken?: string
): Promise<DetailPenitipan> {
  return await PATCH(
    `/penitipan/extend/${id_dtl_penitipan}`,
    undefined,
    accessToken
  );
}

export async function updateBarangStatus(
  data: { id_barang: string; status: string },
  accessToken?: string
): Promise<ResponseAPI> {
  const formData = new FormData();
  formData.append("id_barang", data.id_barang);
  formData.append("status", data.status);
  return await PATCH(`/barang/status`, formData, accessToken);
}

// export async function resetPasswordPenitip(
//   id: string,
//   accessToken?: string
// ): Promise<ResponseAPI> {
//   return await PATCH(`/penitip/${id}/reset-password`, undefined, accessToken);
// }
