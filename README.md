# AnonMail

Email sementara instan — dibangun dengan Next.js (App Router), Tailwind CSS
dengan gaya **rounded soft-dark** monokrom, dan backend
[tempmail.plus](https://tempmail.plus) lewat **API JSON resminya**
(`/api/mails`) — bukan scraping HTML, jadi jauh lebih stabil.

Dikembangkan oleh **hanzcode**. Kalau proyek ini membantu, dukungannya
sangat berarti: <https://saweria.co/hanzreally>

## Fitur

- Generate email sementara otomatis (nama acak) atau **nama custom**
- Salin alamat sekali klik
- **Auto-cek inbox** setiap 8 detik (polling), dengan indikator status live
- Baca isi pesan (HTML) dalam modal
- Navigasi (Inbox, Buat Email, Fitur, Statistik, Pengaturan) — tiap item
  scroll ke section dengan fungsi sungguhan
- Bottom nav dengan scroll-spy (highlight otomatis sesuai section aktif)
- Halaman Pengaturan: info akun aktif, ganti alamat, tentang layanan,
  info developer & dukungan
- **Notifikasi toast** (bukan `alert()` browser) untuk sukses/error
- Session tersimpan di localStorage browser (bertahan walau tab ditutup)
- SEO lengkap: metadata, Open Graph, Twitter Card, JSON-LD, sitemap,
  robots.txt, favicon & app icon multi-ukuran, web manifest (PWA-ready)

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env.local   # lalu isi sesuai kebutuhan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Cara kerja backend

AnonMail memakai `/api/mails` milik [tempmail.plus](https://tempmail.plus),
API JSON tidak resmi tapi terstruktur (bukan HTML yang perlu di-scrape).
Membuat alamat email sepenuhnya **lokal** — tidak ada request ke server
sama sekali, karena tempmail.plus tidak butuh registrasi: alamat langsung
aktif begitu dipakai untuk cek inbox. Semua route di sini bersifat
**stateless**, cocok untuk Vercel Serverless Functions yang instance-nya
bisa berbeda tiap request.

| Route Next.js | Method | Fungsi |
| --- | --- | --- |
| `/api/domain` | GET | Daftar domain yang tersedia |
| `/api/[email]` | GET | Buat sebuah alamat, murni lokal (`/api/random` untuk acak, atau `/api/nama@domain.tld`) |
| `/api/[email]/inbox` | GET | Ambil daftar pesan masuk untuk alamat tsb, masing-masing diberi nomor urut |
| `/api/[email]/inbox/[number]` | GET | Ambil isi lengkap satu pesan (html/text) berdasarkan nomor urutnya |

Logika request ada di `lib/tempmail.ts`, diport dari scraper referensi
(`tempmail_plus.js`, axios) ke `fetch` API bawaan Next.js.

## Kenapa kadang muncul error dari tempmail.plus?

tempmail.plus adalah layanan gratis pihak ketiga yang kadang mengalami
gangguan di luar kendali kita (server lambat, limit request, dsb).
Kalau itu terjadi, muncul notifikasi toast yang jelas — bukan crash diam-diam.

## Environment variables

Lihat `.env.example`:

| Variabel | Wajib? | Fungsi |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Disarankan | Base URL untuk metadata, sitemap, robots.txt, canonical link |
| `NEXT_PUBLIC_OG_IMAGE_URL` | Opsional | URL banner OG (PNG/JPG, idealnya 1200×630). Kalau kosong, memakai placeholder bawaan di `/public/og-image.png` |

## Deploy ke Vercel

1. Push folder ini ke repo GitHub baru.
2. Import repo tersebut di [vercel.com/new](https://vercel.com/new).
3. Di tab **Environment Variables**, isi `NEXT_PUBLIC_SITE_URL` dengan domain
   final kamu, dan (opsional) `NEXT_PUBLIC_OG_IMAGE_URL`.
4. Klik **Deploy**.

Tidak ada konfigurasi tambahan yang dibutuhkan — semua route API berjalan
sebagai Vercel Serverless Functions (Node runtime) secara otomatis.

## Struktur proyek

```
app/
  api/
    domain/                    → GET daftar domain
    [email]/                   → GET buat/validasi alamat
      inbox/                   → GET daftar pesan masuk
        [number]/              → GET isi satu pesan
  icon.png             → favicon (App Router convention)
  apple-icon.png       → apple touch icon
  favicon.ico
  layout.tsx           → metadata, OG, Twitter card, JSON-LD
  page.tsx
  robots.ts            → robots.txt dinamis
  sitemap.ts           → sitemap.xml dinamis
  globals.css
components/
  MailApp.tsx          → orkestrasi state, session, polling, semua section
  Header.tsx            → nav dengan fungsi per-item
  Hero.tsx
  EmailBox.tsx          → input nama custom, copy, refresh (#buat)
  InboxList.tsx         → (#inbox)
  MessageModal.tsx
  InfoGrids.tsx         → fitur (#fitur) & statistik (#statistik)
  SettingsSection.tsx   → (#pengaturan) info akun, ganti alamat, tentang, developer
  Footer.tsx            → kredit developer & link dukungan
  BottomNav.tsx         → scroll-spy active state
  AnonMailArt.tsx        → ilustrasi mailbox SVG (rounded style)
  Toast.tsx              → notifikasi sukses/error, pengganti alert()
lib/
  tempmail.ts           → klien API tempmail.plus (fetch-based, stateless)
  types.ts               → shared TypeScript types
public/
  og-image.png          → placeholder banner OG 1200x630
  icon-192.png / icon-512.png → PWA icons
  manifest.json
```

## Catatan

- Domain email diambil dari daftar domain aktif tempmail.plus di
  `lib/tempmail.ts`, jadi kalau situs sumbernya mengganti daftar domain,
  perbarui juga array `DOMAINS` di file tersebut.
- tempmail.plus punya endpoint hapus inbox (`destroyInbox` di
  `lib/tempmail.ts`), tapi belum disambungkan ke tombol "Hapus" —
  saat ini tombol itu hanya membuang sesi lokal dan membuat alamat baru.
- Kalau tempmail.plus sedang bermasalah, pesan error yang jelas akan
  muncul lewat toast, bukan `alert()` browser.
- Ganti `public/og-image.png` atau set `NEXT_PUBLIC_OG_IMAGE_URL` begitu
  kamu punya banner final.

---

Dibuat oleh **hanzcode** · Dukung di [saweria.co/hanzreally](https://saweria.co/hanzreally)
