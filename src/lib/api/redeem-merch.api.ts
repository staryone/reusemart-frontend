import { RedeemMerch } from "../interface/redeem-merch.interface";
import { ResponseAPI } from "../interface/response.interface";
import { GET, POST, PATCH } from "./fetch";

export async function getRequestDonasi(
  id: number,
  accessToken?: string
): Promise<RedeemMerch> {
  return await GET(`/redeem-merch/${id}`, accessToken);
}

// export async function getListRedeemMerch(
//   params?: URLSearchParams,
//   accessToken?: string
// ): Promise<[RedeemMerch[], number]> {
//   return await GET(`/redeem-merch/lists?${params}`, accessToken);
// }

export async function getAllListRedeemMerch(
  params?: URLSearchParams,
  accessToken?: string
): Promise<[RedeemMerch[], number]> {
  return await GET(`/redeem-merch/allLists?${params}`, accessToken);
}

export async function createRedeemMerch(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/redeem-merch`, data, accessToken);
}

export async function updateRedeemMerch(
  id: number,
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await PATCH(`/redeem-merch/${id}`, data, accessToken);
}

