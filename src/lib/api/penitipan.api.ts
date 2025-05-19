import { DetailPenitipan } from "../interface/detail-penitipan.interface";
import { ResponseAPI } from "../interface/response.interface";
import { GET, POST} from "./fetch";

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
  console.log("MASUK FUNGSI API")
  return await GET(`/penitipan/lists?${params}`, accessToken);
}