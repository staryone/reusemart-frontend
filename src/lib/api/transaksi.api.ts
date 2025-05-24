import { ResponseAPI } from "../interface/response.interface";
import { TransaksiPayment } from "../interface/transaksi.interface";
import { DELETE, GET, PATCH, POST } from "./fetch";

export async function createTransaksi(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/transaksi`, data, accessToken);
}

export async function getTransaksi(
  idTransaksi: string,
  accessToken?: string
): Promise<TransaksiPayment> {
  return await GET(`/transaksi/${idTransaksi}`, accessToken);
}

export async function expiredTransaksi(
  idTransaksi: string,
  accessToken?: string
): Promise<ResponseAPI> {
  return await DELETE(`/transaksi/${idTransaksi}`, accessToken);
}

export async function uploadBuktiPembayaranTransaksi(
  idTransaksi: string,
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/transaksi/${idTransaksi}`, data, accessToken);
}

export async function verifPembayaran(
  idTransaksi: string,
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await PATCH(`/transaksi/${idTransaksi}/verif`, data, accessToken);
}
