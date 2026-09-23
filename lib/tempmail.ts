// Backend email sementara — memakai tempmail.plus, yang punya API JSON asli
// (/api/mails) alih-alih HTML yang perlu di-scrape. Diport dari
// tempmail_plus.js (axios) ke fetch API bawaan Next.js.
//
// Keuntungan dibanding provider berbasis scraping HTML sebelumnya:
// - Respons berupa JSON terstruktur, jadi tidak gampang rusak kalau
//   tampilan situsnya berubah.
// - Membuat alamat email sepenuhnya lokal (tidak perlu request apa pun ke
//   server) karena tempmail.plus tidak butuh registrasi/validasi alamat.

const BASE_URL = "https://tempmail.plus";
const REQUEST_TIMEOUT_MS = 15000;

const HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Referer: `${BASE_URL}/`,
};

export const DOMAINS = [
  "mailto.plus",
  "fexpost.com",
  "fexbox.org",
  "mailbox.in.ua",
  "rover.info",
  "chitthi.in",
  "fextemp.com",
  "any.pink",
  "merepost.com",
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
  id: string;
  from: string;
  subject: string;
  to: string;
  time: string;
  preview: string;
  body: string;
  attachmentsCount: number;
};

async function apiRequest<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { ...HEADERS, ...(init.headers as Record<string, string>) },
      signal: controller.signal,
      cache: "no-store",
    });
  } catch {
    throw new TempMailError("Tidak bisa menghubungi tempmail.plus.", 503);
  } finally {
    clearTimeout(timer);
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    throw new TempMailError("Respons tidak valid dari tempmail.plus.", 503);
  }

  if (!data || data.result === false) {
    const message = data?.err?.msg || "Gagal menghubungi tempmail.plus.";
    throw new TempMailError(message, res.status >= 400 ? res.status : 503);
  }

  return data as T;
}

// Username hanya boleh huruf/angka, dipisah tunggal oleh . - _ (aturan
// asli tempmail.plus).
export function isValidUsername(username: string): boolean {
  return /^[A-Za-z0-9]+([.\-_][A-Za-z0-9]+)*$/.test(username);
}

function generateRandomName(): string {
  const len = 5 + Math.floor(Math.random() * 3);
  let word = "";
  const sets = ["aeouy", "bcdfghkmnpqstvwxz"];
  let type = Math.floor(Math.random() * 2);
  let prob = type ? 5 : 7;

  for (let i = 0; i < len; i++) {
    word += sets[type].charAt(Math.floor(Math.random() * sets[type].length));
    if (Math.floor(Math.random() * prob) > 1) {
      type = 1 - type;
      prob = type ? 5 : 10;
    }
  }
  return word;
}

export function getRandomDomain(): string {
  return DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
}

// Membuat alamat email — sepenuhnya lokal, tanpa request ke server, karena
// tempmail.plus tidak butuh registrasi: alamat langsung aktif begitu
// dipakai untuk cek inbox.
export async function createEmail(
  username?: string,
  domain?: string
): Promise<{ email: string; username: string; domain: string }> {
  if (username && !isValidUsername(username)) {
    throw new TempMailError(
      "Nama hanya boleh huruf/angka, dipisah satu tanda titik/strip/underscore di antaranya.",
      400
    );
  }

  const dmn = domain && DOMAINS.includes(domain) ? domain : getRandomDomain();
  const usr = username || generateRandomName();

  return { email: `${usr}@${dmn}`, username: usr, domain: dmn };
}

function splitEmail(emailAddress: string): { username: string; domain: string } {
  const parts = String(emailAddress || "").split("@");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new TempMailError("Format email tidak valid.", 400);
  }
  return { username: parts[0], domain: parts[1] };
}

// Mengambil daftar pesan masuk. Setiap pesan diberi nomor urut (1-based,
// sesuai urutan yang dikembalikan tempmail.plus — terbaru duluan) supaya
// bisa diakses lewat /api/[email]/inbox/[number].
export async function getInbox(emailAddress: string): Promise<{
  email: string;
  username: string;
  domain: string;
  total: number;
  messages: TempMailMessage[];
}> {
  const { username, domain } = splitEmail(emailAddress);
  const email = `${username}@${domain}`;

  const params = new URLSearchParams({ email, limit: "50", epin: "" });
  const data = await apiRequest<{ mail_list?: any[] }>(`/api/mails?${params.toString()}`);

  const list = Array.isArray(data.mail_list) ? data.mail_list : [];
  const messages: TempMailMessage[] = list.map((mail, idx) => ({
    number: idx + 1,
    id: String(mail.mail_id),
    from: mail.from_name ? `${mail.from_name} <${mail.from_mail}>` : mail.from_mail || "",
    subject: mail.subject || "(no subject)",
    to: email,
    time: mail.time || "",
    preview: "",
    body: "",
    attachmentsCount: mail.attachment_count || 0,
  }));

  return { email, username, domain, total: messages.length, messages };
}

// Mengambil isi lengkap satu pesan (html/text) berdasarkan nomor urutnya
// di daftar inbox saat ini.
export async function getInboxMessage(
  emailAddress: string,
  number: number
): Promise<TempMailMessage> {
  const inbox = await getInbox(emailAddress);
  const summary = inbox.messages.find((m) => m.number === number);
  if (!summary) {
    throw new TempMailError(`Pesan nomor ${number} tidak ditemukan.`, 404);
  }

  const params = new URLSearchParams({ email: inbox.email, epin: "" });
  const data = await apiRequest<{
    from?: string;
    from_mail?: string;
    from_name?: string;
    subject?: string;
    date?: string;
    text?: string;
    html?: string;
    attachments?: any[];
  }>(`/api/mails/${summary.id}?${params.toString()}`);

  const bodyHtml = data.html || "";
  const bodyText = data.text || "";

  return {
    ...summary,
    from: data.from_name ? `${data.from_name} <${data.from_mail}>` : data.from || summary.from,
    subject: data.subject || summary.subject,
    time: data.date || summary.time,
    preview: bodyText ? bodyText.slice(0, 150) : summary.preview,
    body: bodyHtml || bodyText,
    attachmentsCount: Array.isArray(data.attachments) ? data.attachments.length : summary.attachmentsCount,
  };
}

// Menghapus seluruh inbox untuk sebuah alamat (dipakai tombol "Hapus" di
// halaman inbox).
export async function destroyInbox(emailAddress: string): Promise<boolean> {
  const { username, domain } = splitEmail(emailAddress);
  const email = `${username}@${domain}`;
  const params = new URLSearchParams({ email, epin: "" });

  try {
    const data = await apiRequest<{ result?: boolean }>(`/api/mails/?${params.toString()}`, {
      method: "DELETE",
    });
    return Boolean(data.result);
  } catch {
    return false;
  }
}
