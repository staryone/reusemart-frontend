import { Diskusi, DiskusiPublic } from "../interface/diskusi.interface";
import { ResponseAPI } from "../interface/response.interface";
import { GET, POST } from "./fetch";

export async function getDiskusi(
  id: number,
  accessToken?: string
): Promise<Diskusi> {
  return await GET(`/diskusi/${id}`, accessToken);
}

export async function getListDiskusi(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[Diskusi[], number]> {
  return await GET(`/diskusi/lists?${params}`, accessToken);
}

export async function getListByBarangId(
  idBarang?: string
): Promise<[DiskusiPublic[], number]> {
  return await GET(`/diskusi/lists/${idBarang}`);
}

export async function createDiskusi(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/diskusi`, data, accessToken);
}
