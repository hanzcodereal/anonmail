import { NextRequest, NextResponse } from "next/server";
import { getInboxMessage, TempMailError } from "@/lib/tempmail";

// GET /api/[email]/inbox/[number] — buka satu pesan berdasarkan nomor
// urutnya di inbox (1, 2, 3, ...)
export async function GET(
  req: NextRequest,
  { params }: { params: { email: string; number: string } }
) {
  const email = decodeURIComponent(params.email);
  const number = Number(params.number);

  if (!Number.isInteger(number) || number < 1) {
    return NextResponse.json(
      { success: false, error: "Nomor pesan tidak valid." },
      { status: 400 }
    );
  }

  try {
    const message = await getInboxMessage(email, number);
    return NextResponse.json({ success: true, data: message });
  } catch (err) {
    const status = err instanceof TempMailError ? err.status ?? 503 : 503;
    const message =
      err instanceof TempMailError ? err.message : "Gagal membuka pesan.";
    return NextResponse.json({ success: false, error: message }, { status });
  }
    }
