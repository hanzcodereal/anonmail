import { NextResponse } from "next/server";
import { DOMAINS } from "@/lib/tempmail";

// GET /api/domain → daftar domain yang tersedia di tempmail.plus
export async function GET() {
  return NextResponse.json({
    success: true,
    data: { total: DOMAINS.length, domains: DOMAINS },
  });
}
