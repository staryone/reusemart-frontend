import { NextResponse, NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { Role, Jabatan } from "@/types/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { role, jabatan } = payload;

  if (request.nextUrl.pathname.startsWith("/owner")) {
    if (role !== Role.PEGAWAI || jabatan !== Jabatan.OWNER) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (role !== Role.PEGAWAI || jabatan !== Jabatan.ADMIN) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/cs")) {
    if (role !== Role.PEGAWAI || jabatan !== Jabatan.CS) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/gudang")) {
    if (role !== Role.PEGAWAI || jabatan !== Jabatan.GUDANG) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/penitip")) {
    if (role !== Role.PENITIP) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (
    request.nextUrl.pathname.startsWith("/profil") ||
    request.nextUrl.pathname.startsWith("/cart") ||
    request.nextUrl.pathname.startsWith("/daftar-alamat") ||
    request.nextUrl.pathname.startsWith("/history-pembelian") ||
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/checkout")
  ) {
    if (role !== Role.PEMBELI) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/organisasi")) {
    if (role !== Role.ORGANISASI) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Tambahkan header untuk digunakan di Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user", JSON.stringify({ role, jabatan }));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/cs/:path*",
    "/gudang/:path*",
    "/penitip/:path*",
    "/organisasi/:path*",
    "/cart",
    "/daftar-alamat",
    "/history-pembelian",
    "/profil",
    "/dashboard",
    "/checkout",
  ],
};
