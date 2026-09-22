"use client";

import type { Session } from "@/lib/types";

export default function SettingsSection({
  session,
  onDelete,
}: {
  session: Session | null;
  onDelete: () => void;
}) {
  return (
    <section id="pengaturan" className="mx-auto max-w-3xl px-5 pt-12 pb-2">
      <span className="mb-4 block font-display text-[15px] font-semibold text-paper">
        Pengaturan
      </span>

      <div className="flex flex-col gap-3">
        <div className="rounded-[22px] bg-surface p-5 shadow-3d-sm ring-1 ring-white/[0.06]">
          <span className="flex items-center gap-2.5 font-display text-[13px] font-semibold text-paper">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-paper">
              <UserIcon />
            </span>
            Akun Aktif
          </span>
          <div className="mt-4 flex flex-col gap-3 text-[13px]">
            <Row icon={<MailIcon />} label="Alamat" value={session?.address ?? "—"} />
            <Row icon={<GlobeIcon />} label="Domain" value={session?.domain ?? "—"} />
            <Row
              icon={<ClockIcon />}
              label="Dibuat"
              value={
                session ? new Date(session.createdAt).toLocaleString("id-ID") : "—"
              }
            />
          </div>
        </div>

        <button
          onClick={onDelete}
          disabled={!session}
          className="flex items-center justify-between rounded-[22px] bg-surface p-5 text-left shadow-3d-sm ring-1 ring-white/[0.06] active:bg-surface-2 transition-colors disabled:opacity-40"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <TrashIcon />
            </span>
            <span>
              <span className="block font-display text-[13.5px] font-semibold text-danger">
                Ganti Alamat
              </span>
              <span className="block text-[12px] text-mute">
                Buang alamat ini dan buat email sementara yang baru.
              </span>
            </span>
          </span>
          <ChevronIcon />
        </button>

        <div className="rounded-[22px] bg-surface p-5 shadow-3d-sm ring-1 ring-white/[0.06]">
          <span className="flex items-center gap-2.5 font-display text-[13px] font-semibold text-paper">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-paper">
              <InfoIcon />
            </span>
            Tentang AnonMail
          </span>
          <p className="mt-3 text-[13px] leading-relaxed text-mute">
            AnonMail adalah layanan email sementara gratis. Tidak perlu
            registrasi, tidak menyimpan data pribadi Anda. Setiap email yang
            dibuat bersifat sekali pakai dan bisa diganti kapan saja.
          </p>
        </div>

        <div className="rounded-[22px] bg-surface p-5 shadow-3d-sm ring-1 ring-white/[0.06]">
          <span className="flex items-center gap-2.5 font-display text-[13px] font-semibold text-paper">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-paper">
              <HeartIcon />
            </span>
            Developer
          </span>
          <p className="mt-3 text-[13px] leading-relaxed text-mute">
            Dikembangkan oleh <span className="font-medium text-paper">hanzcode</span>.
            Kalau AnonMail membantu, dukungannya sangat berarti.
          </p>
          <a
            href="https://saweria.co/hanzreally"
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-paper px-3.5 py-2.5 text-[12.5px] font-semibold text-ink active:scale-[0.98] transition-transform"
          >
            <HeartIcon />
            Dukung di Saweria
          </a>
        </div>
      </div>
    </section>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-stroke-soft pb-2.5 last:border-0 last:pb-0">
      <span className="flex shrink-0 items-center gap-2 text-mute-2">
        <span className="text-mute-2">{icon}</span>
        {label}
      </span>
      <span className="truncate font-mono text-[12px] text-paper">{value}</span>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0l1 13h8l1-13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M3 6L12 13L21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20.5s-7.5-4.6-9.7-9.2C.7 7.8 2.4 4.5 5.7 4A4.9 4.9 0 0112 6.3 4.9 4.9 0 0118.3 4c3.3.5 5 3.8 3.4 7.3-2.2 4.6-9.7 9.2-9.7 9.2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-mute-2">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
