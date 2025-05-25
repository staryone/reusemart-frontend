import { ResponseAPI } from "../interface/response.interface";
import { PATCH } from "./fetch";


export async function updateRating(
  id: string,
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await PATCH(`/rating/${id}`, data, accessToken);
}

