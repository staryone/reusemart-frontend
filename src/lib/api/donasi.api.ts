import { DonasiBarang } from "@/app/(pegawai)/(withSidebar)/owner/laporan/donasi-barang/page";
import { Donasi } from "../interface/donasi.interface";
import { ResponseAPI } from "../interface/response.interface";
import { GET, POST, PATCH } from "./fetch";

export async function getDonasi(
  id: number,
  accessToken?: string
): Promise<Donasi> {
  return await GET(`/donasi/${id}`, accessToken);
}

export async function getListDonasi(
  org?: string,
  params?: URLSearchParams,
  accessToken?: string
): Promise<[Donasi[], number]> {
  return await GET(`/donasi/lists/${org}?${params}`, accessToken);
}

export async function getAllListDonasi(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[Donasi[], number]> {
  return await GET(`/donasi/allLists?${params}`, accessToken);
}

export async function getLaporanDonasiBarang(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[DonasiBarang[], number]> {
  return await GET(`/donasi/getLaporanDonasiBarang?${params}`, accessToken);
}

export async function createDonasi(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/donasi`, data, accessToken);
}

export async function updateDonasi(
  id: number,
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await PATCH(`/donasi/${id}`, data, accessToken);
}
