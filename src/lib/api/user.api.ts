import { ResponseAPI } from "../interface/response.interface";
import { GET, POST, PATCH, DELETE } from "./fetch";

export async function forgotPasswordUser(data: FormData): Promise<ResponseAPI> {
  return await POST(`/forgot-password`, data);
}
export async function resetPasswordUser(
  data: FormData,
  tokenReset: string
): Promise<ResponseAPI> {
  return await POST(`/reset-password/${tokenReset}`, data);
}

export async function checkValidTokenReset(
  tokenReset: string
): Promise<ResponseAPI> {
  return await GET(`/reset-password/${tokenReset}`);
}
