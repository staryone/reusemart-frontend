import { ResponseAPI } from "../interface/response.interface";
import { POST } from "./fetch";

export async function createTransaksi(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/transaksi`, data, accessToken);
}
