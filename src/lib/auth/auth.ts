import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/env";

interface DecodedToken {
  role: "PEMBELI" | "PENITIP" | "ORGANISASI" | "PEGAWAI";
  jabatan?: "OWNER" | "CS" | "GUDANG" | "KURIR" | string;
  sub: string;
  iat: number;
  exp: number;
}

// Simpan token ke SessionStorage
export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("token", token);
  }
};

// Ambil token dari SessionStorage
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("token");
  }
  return null;
};

// Hapus token saat logout
export const removeToken = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("token");
  }
};
