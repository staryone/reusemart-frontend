import { NextResponse } from "next/server";
import { API_LOGIN, BASE_URL } from "@/lib/env";
import { TokenAPIResponse } from "@/types/auth";
import { getCurrentUserServer } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const response = await fetch(BASE_URL + API_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const jsonRes: TokenAPIResponse = await response.json();

    if (!response.ok || !jsonRes.data.token) {
      return NextResponse.json({ error: jsonRes.errors }, { status: 401 });
    }

    const user = await getCurrentUserServer(jsonRes.data.token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const res = NextResponse.json(
      {
        message: "Login successful",
        user: { role: user.role, jabatan: user.jabatan },
      },
      { status: 200 }
    );

    // Set JWT di HttpOnly cookie
    res.cookies.set("auth_token", jsonRes.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
