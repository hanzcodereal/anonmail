import { NextRequest, NextResponse } from "next/server";
import { getInbox, TempMailError } from "@/lib/tempmail";

// GET /api/[email]/inbox — daftar semua pesan, masing-masing diberi nomor
// urut yang dipakai untuk membuka detail lewat /api/[email]/inbox/[number]
export async function GET(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
  const email = decodeURIComponent(params.email);

  try {
    const inbox = await getInbox(email);
    return NextResponse.json({ success: true, data: inbox });
  } catch (err) {
    const status = err instanceof TempMailError ? err.status ?? 503 : 503;
    const message =
      err instanceof TempMailError ? err.message : "Gagal mengambil inbox.";
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
