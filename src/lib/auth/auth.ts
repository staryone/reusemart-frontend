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

// Verifikasi dan decode token
export const verifyToken = (token: string): DecodedToken | null => {
  try {
    // Verifikasi token dan konversi ke unknown terlebih dahulu
    const decoded = jwt.verify(token, JWT_SECRET) as unknown;

    // Validasi bahwa decoded sesuai dengan DecodedToken
    if (
      decoded &&
      typeof decoded === "object" &&
      "role" in decoded &&
      "sub" in decoded &&
      "iat" in decoded &&
      "exp" in decoded
    ) {
      const decodedToken = decoded as DecodedToken;
      // Validasi nilai role
      if (
        !["PEMBELI", "PENITIP", "ORGANISASI", "PEGAWAI"].includes(
          decodedToken.role
        )
      ) {
        return null;
      }
      return decodedToken;
    }
    return null;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return null;
  }
};
