// Backend email sementara — scraping generator.email (tanpa API key).
// Diport dari tempmail.js (Node https module) ke fetch API agar jalan di
// Next.js Route Handlers / Vercel Serverless Functions tanpa perubahan.
//
// Setiap request dibuat stateless: cookie "surl" untuk membuka inbox bisa
// diturunkan langsung dari domain+username (tidak perlu login ulang atau
// menyimpan sesi di server), jadi cocok untuk lingkungan serverless yang
// instance-nya bisa berbeda-beda tiap request.

const BASE_URL = "https://generator.email";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

// Hash tetap yang dipakai generator.email di cookie "surl" — sama untuk semua
// alamat, hanya domain & username yang berubah.
const SURL_SUFFIX = "f73f0754a89555693e22f70a619b772c";

export const DOMAINS = [
  "samvix.life",
  "wildan.tech",
  "sentra-premium.com",
  "remahankerupuk.com",
  "angiiidayyy.click",
  "sekotong.store",
  "fbins001mail.com",
  "phamlam.online",
  "evoiceeeeee.blog",
  "starcheck.in",
  "banri.xyz",
  "acqq.dev",
  "tools-capcut.com",
  "saovangtiles.site",
  "hohohim.com",
];

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
  from: string;
  subject: string;
  to: string;
  time: string;
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

function setCookie(jar: CookieJar, name: string, value: string) {
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

async function request(
  jar: CookieJar,
  method: string,
  path: string,
  data?: Record<string, string> | null,
  extraHeaders: Record<string, string> = {},
  redirectCount = 0
): Promise<string> {
  if (redirectCount > 5) return "";

  const headers: Record<string, string> = {
    "User-Agent": USER_AGENT,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "X-Requested-With": "XMLHttpRequest",
    ...(jar.value ? { Cookie: jar.value } : {}),
    ...extraHeaders,
  };

  let body: string | undefined;
  if (data) {
    body = new URLSearchParams(data).toString();
    headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body,
      redirect: "manual",
      cache: "no-store",
    });
  } catch {
    throw new TempMailError("Tidak bisa menghubungi generator.email.");
  }

  mergeCookies(jar, getSetCookieHeaders(res));

  if ((res.status === 301 || res.status === 302) && res.headers.get("location")) {
    const location = res.headers.get("location")!;
    const newPath = location.startsWith("http") ? new URL(location).pathname : location;
    return request(jar, "GET", newPath, null, extraHeaders, redirectCount + 1);
  }

  return res.text();
}

function generateUsername(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getRandomDomain(): string {
  return DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
}

export function isKnownDomain(domain: string): boolean {
  return DOMAINS.includes(domain.toLowerCase());
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{1,28}[a-zA-Z0-9]$/.test(username);
}

export function parseEmailAddress(address: string): { username: string; domain: string } {
  const parts = address.split("@");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new TempMailError("Format email tidak valid.", 400);
  }
  return { username: parts[0], domain: parts[1].toLowerCase() };
}

// Membuat/memvalidasi sebuah alamat di generator.email. Situs ini tidak
// punya konsep "akun" nyata — cukup memvalidasi bahwa domain+username bisa
// dipakai, lalu alamat itu langsung aktif menerima email.
export async function createEmail(
  username?: string,
  domain?: string
): Promise<{ email: string; username: string; domain: string }> {
  const usr = username || generateUsername();
  const dmn = (domain || getRandomDomain()).toLowerCase();

  if (username && !isValidUsername(username)) {
    throw new TempMailError(
      "Nama harus 3-30 karakter, huruf/angka/titik/underscore/strip, diawali & diakhiri huruf atau angka.",
      400
    );
  }
  if (!isKnownDomain(dmn)) {
    throw new TempMailError("Domain tidak dikenal.", 400);
  }

  const jar: CookieJar = { value: null };
  const punycode = await request(jar, "POST", "/dom_to_punycode.php", { dmn });
  const punyDomain = punycode || dmn;

  await request(jar, "POST", "/check_mail.php", { usr, dmn: punyDomain });
  await request(jar, "POST", "/check_adres_validation3.php", { usr, dmn: punyDomain });

  return { email: `${usr}@${dmn}`, username: usr, domain: dmn };
}

function parseEmails(html: string, email: string): Omit<TempMailMessage, "number">[] {
  const emails: Omit<TempMailMessage, "number">[] = [];

  const headerPattern =
    /<div class="e7m list-group-item list-group-item-info">([\s\S]*?)(?=<script|<div class="e7m row list-group-item")/g;
  let headerMatch: RegExpExecArray | null;

  while ((headerMatch = headerPattern.exec(html)) !== null) {
    const chunk = headerMatch[1];

    const fromMatch = chunk.match(/<div class="e7m from_div_45g45gg">([^<]+)<\/div>/);
    const subjectMatch = chunk.match(/<div class="e7m subj_div_45g45gg">([^<]*)<\/div>/);
    const timeMatch = chunk.match(/<div class="e7m time_div_45g45gg">([^<]+)<\/div>/);

    const from = fromMatch ? fromMatch[1].trim() : "";
    const subject = subjectMatch ? subjectMatch[1].trim() : "";
    const time = timeMatch ? timeMatch[1].trim() : "";

    if (from && from !== "From") {
      emails.push({ from, subject: subject || "(no subject)", to: email, time, body: "" });
    }
  }

  const rowSplit = html.split(/<div class="e7m row list-group-item"/);
  const detailRows: { from: string; to: string; time: string; body: string }[] = [];

  for (let i = 1; i < rowSplit.length; i++) {
    const chunk = rowSplit[i];

    const fromMatch = chunk.match(/<span>From: <\/span><span>([^<]+)/);
    const toMatch = chunk.match(/<span>To: <\/span><span>([^<]+)<\/span>/);
    const timeMatch = chunk.match(/<span>Received: <\/span><span>([^<]+)<span/);
    const bodyMatch = chunk.match(
      /<div class="e7m mess_bodiyy"><div dir="auto">([\s\S]*?)<\/div><\/div>/
    );

    detailRows.push({
      from: fromMatch ? fromMatch[1].trim() : "",
      to: toMatch ? toMatch[1].trim() : email,
      time: timeMatch ? timeMatch[1].trim() : "",
      body: bodyMatch ? bodyMatch[1].trim() : "",
    });
  }

  for (let i = 0; i < emails.length; i++) {
    if (detailRows[i]) {
      emails[i].to = detailRows[i].to || email;
      emails[i].body = detailRows[i].body || "";
      if (detailRows[i].time) emails[i].time = detailRows[i].time;
    }
  }

  if (emails.length === 0 && detailRows.length > 0) {
    for (const row of detailRows) {
      if (row.from) {
        emails.push({
          from: row.from,
          subject: "(no subject)",
          to: row.to || email,
          time: row.time || "",
          body: row.body || "",
        });
      }
    }
  }

  return emails;
}

// Mengambil seluruh isi inbox untuk satu alamat. Setiap pesan diberi nomor
// urut (1-based) supaya bisa diakses lewat /api/[email]/inbox/[number].
export async function getInbox(
  emailAddress: string
): Promise<{ email: string; username: string; domain: string; total: number; messages: TempMailMessage[] }> {
  const { username, domain } = parseEmailAddress(emailAddress);
  const email = `${username}@${domain}`;

  const jar: CookieJar = { value: null };

  await request(jar, "GET", "/");
  setCookie(jar, "surl", `${domain}/${username}/${SURL_SUFFIX}`);

  await request(jar, "POST", "/check_mail.php", { usr: username, dmn: domain });

  const html = await request(jar, "GET", `/${domain}/${username}`, null, {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    Referer: `${BASE_URL}/${domain}/${username}`,
  });

  if (typeof html !== "string" || html.length < 500) {
    throw new TempMailError("Gagal mengambil inbox dari generator.email.", 503);
  }

  const parsed = parseEmails(html, email);
  const messages: TempMailMessage[] = parsed.map((m, i) => ({ number: i + 1, ...m }));

  return { email, username, domain, total: messages.length, messages };
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
