import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: "PEMBELI" | "PENITIP" | "ORGANISASI" | "PEGAWAI";
  jabatan?: "OWNER" | "CS" | "GUDANG" | "KURIR" | string;
  sub: string;
  iat: number;
  exp: number;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Contoh: Kirim request ke backend untuk autentikasi
        const res = await fetch("http://localhost:3001/api/pembeli/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          return null;
        }

        const data = await res.json();
        // Asumsikan backend mengembalikan token JWT
        if (data.token) {
          // Decode token tanpa verifikasi untuk mendapatkan payload
          const decoded = jwtDecode<DecodedToken>(data.token);
          return {
            id: decoded.sub,
            email: credentials.email,
            token: data.token,
            role: decoded.role,
            jabatan: decoded.jabatan,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Simpan data user ke token saat login
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user;
        // token.role = user.role;
        // token.jabatan = user.jabatan;
      }
      return token;
    },
    async session({ session, token }) {
      // Tambahkan data dari token ke sesi
      //   session.user.id = token.id as string;
      //   session.user.email = token.email as string;
      //   session.user.role = token.role as string;
      //   session.user.jabatan = token.jabatan as string;
      //   session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
