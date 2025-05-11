import NextAuth, { AuthOptions } from "next-auth";
import { CredentialsProvider } from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

interface DecodedToken {
  role: "PENITIP";
  sub: string;
  iat: number;
  exp: number;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({

    })
  ]
}