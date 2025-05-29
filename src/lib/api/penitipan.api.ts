import { DetailPenitipan } from "../interface/detail-penitipan.interface";
import { LaporanPenjualanBulanan } from "../interface/laporan.interface";
import { ResponseAPI } from "../interface/response.interface";
import { GET, POST, PATCH} from "./fetch";

export async function createPenitipan(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/penitipan`, data, accessToken);
}

export async function getListPenitipan(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[DetailPenitipan[], number]> {
  return await GET(`/penitipan/lists?${params}`, accessToken);
}

export async function getLaporanKomisi(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[DetailPenitipan[], number]> {
  return await GET(`/penitipan/laporan-komisi?${params}`, accessToken);
}

export async function getLaporanPenjualanBulanan(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[LaporanPenjualanBulanan[], number]> {
  return await GET(`/penitipan/laporan-penjualan?${params}`, accessToken);
}

export async function updatePenitipan(
  id: string,
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await PATCH(`/penitipan/${id}`, data, accessToken);
}