export enum Role {
  PEGAWAI = "PEGAWAI",
  PEMBELI = "PEMBELI",
  PENITIP = "PENITIP",
  ORGANISASI = "ORGANISASI",
}

export enum Jabatan {
  OWNER = "OWNER",
  GUDANG = "GUDANG",
  CS = "CS",
  KURIR = "KURIR",
  HUNTER = "HUNTER",
  ADMIN = "ADMIN",
}

export interface JWTPayload {
  role?: Role;
  jabatan?: Jabatan;
  sub: string;
  iat: number;
  exp: number;
}

export interface User {
  id: string;
  role: Role;
  jabatan?: Jabatan;
  token: string;
}

export interface TokenAPIResponse {
  data: {
    token: string;
  };
  errors?: string;
}
