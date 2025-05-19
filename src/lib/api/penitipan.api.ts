import { ResponseAPI } from "../interface/response.interface";
import { POST} from "./fetch";

export async function createPenitipan(
  data: FormData,
  accessToken?: string
): Promise<ResponseAPI> {
  return await POST(`/penitipan`, data, accessToken);
}