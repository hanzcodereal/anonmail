import { NextResponse } from "next/server";
import { DOMAINS } from "@/lib/tempmail";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: { total: DOMAINS.length, domains: DOMAINS },
  });
}
