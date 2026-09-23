// Backend email sementara — scraping tempm.com (tanpa API key).
// Diport dari tempm.js (axios + cheerio, CLI Node) ke fetch API + cheerio
// agar jalan di Next.js Route Handlers / Vercel Serverless Functions.
//
// Setiap request dibuat stateless: cookie "surl" untuk membuka inbox bisa
// diturunkan langsung dari domain+username, jadi tidak perlu login ulang
// atau menyimpan sesi di server — cocok untuk lingkungan serverless yang
// instance-nya bisa berbeda tiap request.

import * as cheerio from "cheerio";

const BASE_URL = "https://tempm.com";
const FALLBACK_DOMAIN = "znext.bond";

const HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Referer: `${BASE_URL}/`,
  Origin: BASE_URL,
  "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
};

export class TempMailError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "TempMailError";
    this.status = status;
  }
}

export type TempMailMessage = {
  number: number;
  id: string;
  from: string;
  subject: string;
  to: string;
  time: string;
  preview: string;
  body: string;
};

type CookieJar = { value: string | null };

function mergeCookies(jar: CookieJar, setCookieList: string[]) {
  if (!setCookieList.length) return;
  const newCookies = setCookieList.map((c) => c.split(";")[0]);
  const existing = jar.value ? jar.value.split("; ").filter(Boolean) : [];
  for (const nc of newCookies) {
    const key = nc.split("=")[0];
    const idx = existing.findIndex((e) => e.startsWith(key + "="));
    if (idx >= 0) existing[idx] = nc;
    else existing.push(nc);
  }
  jar.value = existing.join("; ");
}

function setJarCookie(jar: CookieJar, name: string, value: string) {
  const existing = jar.value ? jar.value.split("; ").filter(Boolean) : [];
  const idx = existing.findIndex((e) => e.startsWith(name + "="));
  if (idx >= 0) existing[idx] = `${name}=${value}`;
  else existing.push(`${name}=${value}`);
  jar.value = existing.join("; ");
}

function getSetCookieHeaders(res: Response): string[] {
  const anyHeaders = res.headers as unknown as { getSetCookie?: () => string[] };
  if (typeof anyHeaders.getSetCookie === "function") {
    return anyHeaders.getSetCookie() || [];
  }
  const single = res.headers.get("set-cookie");
  return single ? [single] : [];
}

async function safeFetch(
  url: string,
  init: RequestInit = {},
  jar?: CookieJar
): Promise<{ text: string; ok: boolean; status: number }> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        ...HEADERS,
        ...(jar?.value ? { Cookie: jar.value } : {}),
        ...(init.headers as Record<string, string>),
      },
      cache: "no-store",
    });
  } catch {
    throw new TempMailError("Tidak bisa menghubungi tempm.com.", 503);
  }
  if (jar) mergeCookies(jar, getSetCookieHeaders(res));
  const text = await res.text();
  return { text, ok: res.ok, status: res.status };
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{1,28}[a-zA-Z0-9]$/.test(username);
}

function sanitizeUsername(user: string): string {
  return (user || "").replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase();
}

function parseTarget(input: string): {
  user: string;
  domain: string;
  email: string;
  inboxUrl: string;
} {
  let str = String(input || "")
    .trim()
    .replace(/^https?:\/\/tempm\.com\//i, "")
    .replace(/^mailto:/i, "")
    .split("?")[0]
    .replace(/^\/+|\/+$/g, "");

  let user = "";
  let domain = "";

  if (str.includes("@")) {
    const p = str.split("@");
    user = p[0];
    domain = p[1];
  } else if (str.includes("/")) {
    const p = str.split("/");
    if (p[0].includes(".")) {
      domain = p[0];
      user = p[1];
    } else {
      user = p[0];
      domain = p[1];
    }
  } else {
    user = str;
  }

  user = sanitizeUsername(user);
  domain = (domain || "").toLowerCase();

  if (!user || !domain) {
    throw new TempMailError("Format email tidak valid.", 400);
  }

  return {
    user,
    domain,
    email: `${user}@${domain}`,
    inboxUrl: `${BASE_URL}/${domain}/${user}`,
  };
}

// GET daftar domain aktif dari tempm.com (di-scrape live, jadi selalu
// mengikuti domain terbaru yang disediakan situsnya).
export async function getDomains(keyword = "a"): Promise<string[]> {
  const q = keyword || "a";
  const { text } = await safeFetch(
    `${BASE_URL}/search.php?key=${encodeURIComponent(q)}`,
    { headers: { Accept: "application/json, text/plain, */*" } }
  );

  let data: string[] = [];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) data = parsed;
  } catch {
    const $ = cheerio.load(text);
    $(".tt-suggestion p, [id*='.']").each((_, el) => {
      const id = $(el).attr("id");
      if (id && id.includes(".") && !data.includes(id)) data.push(id);
    });
  }

  return data;
}

export async function getRandomDomain(): Promise<string> {
  try {
    const domains = await getDomains("a");
    if (domains.length > 0) {
      return domains[Math.floor(Math.random() * domains.length)];
    }
  } catch {
    // fall through to fallback domain
  }
  return FALLBACK_DOMAIN;
}

async function validateEmail(
  user: string,
  domain: string
): Promise<{ email: string; username: string; domain: string }> {
  const u = sanitizeUsername(user);
  const d = domain.toLowerCase().trim();

  if (!u || !d) {
    throw new TempMailError("User dan domain wajib diisi.", 400);
  }

  const params = new URLSearchParams({ usr: u, dmn: d });
  await safeFetch(`${BASE_URL}/check_adres_validation3.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  return { email: `${u}@${d}`, username: u, domain: d };
}

// Membuat/memvalidasi sebuah alamat di tempm.com. Kalau username tidak
// diberikan, alamat acak diambil langsung dari halaman utama tempm.com
// (persis seperti yang muncul saat membuka situsnya lewat browser).
export async function createEmail(
  username?: string,
  domain?: string
): Promise<{ email: string; username: string; domain: string }> {
  if (username) {
    if (!isValidUsername(username)) {
      throw new TempMailError(
        "Nama harus 3-30 karakter, huruf/angka/titik/underscore/strip, diawali & diakhiri huruf atau angka.",
        400
      );
    }
    const dmn = domain || (await getRandomDomain());
    return validateEmail(username, dmn);
  }

  const { text } = await safeFetch(BASE_URL);
  const $ = cheerio.load(text);
  const emailText = $("#email_ch_text").text().trim();
  const user = ($("#userName").val() as string) || (emailText ? emailText.split("@")[0] : "");
  const dom = ($("#domainName2").val() as string) || (emailText ? emailText.split("@")[1] : "");

  if (!user || !dom) {
    throw new TempMailError("Gagal membuat email acak dari tempm.com.", 503);
  }

  return { email: `${user}@${dom}`, username: user, domain: dom };
}

// Mengambil seluruh isi inbox untuk satu alamat. Setiap pesan diberi nomor
// urut (1-based) supaya bisa diakses lewat /api/[email]/inbox/[number].
//
// PENTING: tempm.com menampilkan pesan lewat AJAX setelah halaman selesai
// dimuat di browser ("This page automatically loads all emails" —
// tertulis di homepage-nya), bukan langsung ada di HTML awal. Supaya
// server kita melihat isi yang sama, kita meniru urutan request browser:
// 1) buka halaman utama dulu (dapat cookie sesi awal)
// 2) set cookie "surl" = domain/username milik alamat yang dicek
// 3) panggil check_mail.php (memicu backend "menyiapkan" mailbox tsb)
// 4) baru ambil halaman inbox-nya
export async function getInbox(emailAddress: string): Promise<{
  email: string;
  username: string;
  domain: string;
  total: number;
  messages: TempMailMessage[];
}> {
  const { user, domain, email, inboxUrl } = parseTarget(emailAddress);
  const jar: CookieJar = { value: null };

  await safeFetch(BASE_URL, {}, jar);
  setJarCookie(jar, "surl", `${domain}/${user}/`);

  await safeFetch(
    `${BASE_URL}/check_mail.php`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ usr: user, dmn: domain }).toString(),
    },
    jar
  );

  const { text } = await safeFetch(
    inboxUrl,
    { headers: { Referer: `${BASE_URL}/${domain}/${user}` } },
    jar
  );

  if (!text || text.length < 200) {
    throw new TempMailError("Gagal mengambil inbox dari tempm.com.", 503);
  }

  const $ = cheerio.load(text);
  const messages: TempMailMessage[] = [];

  // Selector utama: markup "e7m" (dipakai jaringan script yang sama dengan
  // generator.email/emailfake.com). Kalau tidak ada hasil, coba selector
  // generik dari tempm.js sebagai cadangan.
  const primarySelectors =
    ".e7m.list-group-item.list-group-item-info, .e7m.row.list-group-item";
  const fallbackSelectors =
    ".mess_list, .mail, .message, div[id^='msg_'], div[class*='mess_list']";

  function extractFrom(el$: cheerio.Cheerio<any>) {
    const from =
      el$
        .find(
          ".from_div_45g45gg, .from, .from_mail, .sender, .to_e7m, span:contains('From:') + span, a[href*='from']"
        )
        .first()
        .text()
        .trim() || "";
    const subject =
      el$
        .find(".subj_div_45g45gg, .subject, .subj, h4, h5, a.subject, .title")
        .first()
        .text()
        .trim() || "";
    const time =
      el$
        .find(
          ".time_div_45g45gg, .time, .date, .received, span:contains('Received:') + span"
        )
        .first()
        .text()
        .trim() || "";
    const bodyEl = el$
      .find(
        ".mess_bodiyy, .mail_content, .mess_body, .message_body, .content, #email_body, div.body"
      )
      .first();
    const html = bodyEl.html() || "";
    const textContent = bodyEl.text().trim() || "";
    return { from, subject, time, html, textContent };
  }

  let nodes = $(primarySelectors);
  if (nodes.length === 0) nodes = $(fallbackSelectors);

  nodes.each((idx, el) => {
    const el$ = $(el);
    const id = el$.attr("id") || `msg-${idx + 1}`;
    const { from, subject, time, html, textContent } = extractFrom(el$);

    if (from || subject || textContent) {
      messages.push({
        number: 0,
        id,
        from,
        subject: subject || "(no subject)",
        to: email,
        time,
        preview: textContent ? textContent.slice(0, 150) : "",
        body: html || textContent,
      });
    }
  });

  messages.forEach((m, i) => (m.number = i + 1));

  return { email, username: user, domain, total: messages.length, messages };
}

export async function getInboxMessage(
  emailAddress: string,
  number: number
): Promise<TempMailMessage> {
  const inbox = await getInbox(emailAddress);
  const message = inbox.messages.find((m) => m.number === number);
  if (!message) {
    throw new TempMailError(`Pesan nomor ${number} tidak ditemukan.`, 404);
  }
  return message;
}
