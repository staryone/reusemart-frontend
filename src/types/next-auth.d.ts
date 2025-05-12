import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    email: string;
    token: string;
    role: "PEMBELI" | "PENITIP" | "ORGANISASI" | "PEGAWAI";
    jabatan?: "OWNER" | "CS" | "GUDANG" | "KURIR" | string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: "PEMBELI" | "PENITIP" | "ORGANISASI" | "PEGAWAI";
      jabatan?: "OWNER" | "CS" | "GUDANG" | "KURIR" | string;
    };
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: "PEMBELI" | "PENITIP" | "ORGANISASI" | "PEGAWAI";
    jabatan?: "OWNER" | "CS" | "GUDANG" | "KURIR" | string;
    accessToken: string;
  }
}
