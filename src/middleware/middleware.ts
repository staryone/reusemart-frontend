import { NextRequest, NextResponse } from "next/server";
import { getToken, verifyToken } from "@/lib/auth/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Tentukan role dan halaman login berdasarkan URL
  let roleFromPath:
    | "PEMBELI"
    | "PENITIP"
    | "ORGANISASI"
    | "PEGAWAI"
    | undefined;
  let loginPath: string = "";

  // Route untuk dashboard utama per role
  if (pathname.startsWith("/pembeli")) {
    roleFromPath = "PEMBELI";
    loginPath = "/login";
  } else if (pathname.startsWith("/penitip")) {
    roleFromPath = "PENITIP";
    loginPath = "/penitip/login";
  } else if (pathname.startsWith("/organisasi")) {
    roleFromPath = "ORGANISASI";
    loginPath = "/organisasi/login";
  } else if (pathname.startsWith("/pegawai")) {
    roleFromPath = "PEGAWAI";
    loginPath = "/pegawai/login";
  }

  // Route khusus untuk PEMBELI (keranjang, profil, dll.)
  const pembeliOnlyRoutes = ["/keranjang", "/profil"];
  const isPembeliOnlyRoute = pembeliOnlyRoutes.includes(pathname);
  if (isPembeliOnlyRoute) {
    roleFromPath = "PEMBELI";
    loginPath = "/login";
  }

  // Izinkan akses ke halaman login
  if (
    pathname === "/login" ||
    pathname === "/penitip/login" ||
    pathname === "/organisasi/login" ||
    pathname === "/pegawai/login"
  ) {
    return NextResponse.next();
  }

  // Ambil token dari SessionStorage (atau header jika dikirim dari client)
  const token = req.headers.get("x-auth-token") || getToken();

  if (!token) {
    return NextResponse.redirect(new URL(loginPath || "/login", req.url));
  }

  // Verifikasi token
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.redirect(new URL(loginPath || "/login", req.url));
  }

  // Periksa role untuk route khusus PEMBELI
  if (isPembeliOnlyRoute && decoded.role !== "PEMBELI") {
    return NextResponse.redirect(
      new URL(`/${decoded.role.toLowerCase()}`, req.url)
    );
  }

  // Periksa role untuk dashboard utama
  if (roleFromPath && decoded.role !== roleFromPath) {
    return NextResponse.redirect(
      new URL(`/${decoded.role.toLowerCase()}`, req.url)
    );
  }

  // Tambahkan token ke header untuk digunakan di server-side
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-auth-token", token);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/pembeli/:path*",
    "/penitip/:path*",
    "/organisasi/:path*",
    "/pegawai/:path*",
    "/keranjang",
    "/profil",
  ],
};
