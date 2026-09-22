import { NextRequest, NextResponse } from "next/server";
import {
  createEmail,
  getRandomDomain,
  isValidUsername,
  TempMailError,
} from "@/lib/tempmail";

// GET /api/[email]
//   - /api/random                → email acak di domain acak
//   - /api/nama@domain.tld       → validasi/buat alamat spesifik itu
export async function GET(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
  const raw = decodeURIComponent(params.email);

  try {
    let result;
    if (raw === "random" || !raw.includes("@")) {
      const username = raw === "random" || !raw ? undefined : raw;
      if (username && !isValidUsername(username)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Nama harus 3-30 karakter, huruf/angka/titik/underscore/strip, diawali & diakhiri huruf atau angka.",
          },
          { status: 400 }
        );
      }
      result = await createEmail(username, getRandomDomain());
    } else {
      const [username, domain] = raw.split("@");
      result = await createEmail(username, domain);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const status = err instanceof TempMailError ? err.status ?? 503 : 503;
    const message =
      err instanceof TempMailError ? err.message : "Gagal membuat email.";
    return NextResponse.json({ success: false, error: message }, { status });
  }
           }
