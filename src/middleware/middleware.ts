import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // Proteksi route yang memerlukan role PEGAWAI
      if (req.nextUrl.pathname.startsWith("/pembeli")) {
        return token?.role === "PEMBELI";
      }
      // Route lain hanya memerlukan login
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/protected/:path*", "/pembeli/:path*"],
};
