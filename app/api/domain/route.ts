import { NextRequest, NextResponse } from "next/server";
import { getDomains, TempMailError } from "@/lib/tempmail";

// GET /api/domain            → daftar domain aktif tempm.com
// GET /api/domain?q=keyword  → cari domain berdasarkan kata kunci
export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get("q") || undefined;

  try {
    const domains = await getDomains(keyword);
    return NextResponse.json({
      success: true,
      data: { total: domains.length, domains },
    });
  } catch (err) {
    const status = err instanceof TempMailError ? err.status ?? 503 : 503;
    const message =
      err instanceof TempMailError ? err.message : "Gagal mengambil daftar domain.";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
