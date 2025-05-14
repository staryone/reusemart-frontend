import { API_LOGOUT, BASE_URL } from "@/lib/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const response = await fetch(BASE_URL + API_LOGOUT, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Jika backend memerlukan token, ambil dari cookie dan kirim di header
        Authorization: `Bearer ${cookieStore.get("auth_token")?.value || ""}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Logout failed" },
        { status: response.status }
      );
    }

    const res = NextResponse.json({ message: "Logout successful" });
    res.cookies.delete("auth_token");

    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
