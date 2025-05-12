import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: "JWT_SECRET is not defined" },
        { status: 500 }
      );
    }

    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      role?: string;
      jabatan?: string;
    };

    // Periksa peran
    if (
      decoded &&
      decoded.role === "PEMBELI" &&
      decoded.jabatan?.toUpperCase() === "ADMIN"
    ) {
      return NextResponse.json({ valid: true, decoded });
    } else {
      return NextResponse.json(
        { valid: false, error: "Invalid user role" },
        { status: 403 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, error: error.message },
      { status: 401 }
    );
  }
}
