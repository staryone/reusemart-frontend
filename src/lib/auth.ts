import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";
import { Jabatan, Role, User } from "@/types/auth";
import { GetServerSidePropsContext } from "next";

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload) return null;

  return {
    id: payload.sub,
    role: payload.role as Role,
    jabatan: payload.jabatan,
    token: token,
  };
}

export async function getCurrentUserServer(
  token: string
): Promise<User | null> {
  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload) return null;

  return {
    id: payload.sub,
    role: payload.role as Role,
    jabatan: payload.jabatan,
    token: token,
  };
}

export async function protectRoute(
  context: GetServerSidePropsContext,
  requiredRole?: Role,
  requiredJabatan?: Jabatan
) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (requiredRole && user.role !== requiredRole) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (requiredJabatan && user.jabatan !== requiredJabatan) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
}

export function getRedirectUrl(user: User): string {
  switch (user.role) {
    case Role.PEGAWAI:
      switch (user.jabatan) {
        case Jabatan.OWNER:
          return "/owner/request-donasi";
        case Jabatan.ADMIN:
          return "/admin/pegawai-master";
        case Jabatan.GUDANG:
          return "/gudang/dashboard";
        case Jabatan.CS:
          return "/cs/penitip-master";
        default:
          return "/"; // Fallback for PEGAWAI
      }
    case Role.PEMBELI:
      return "/profil";
    case Role.PENITIP:
      return "/penitip/profil";
    case Role.ORGANISASI:
      return "/organisasi/request-donasi";
    default:
      return "/"; // Fallback
  }
}
