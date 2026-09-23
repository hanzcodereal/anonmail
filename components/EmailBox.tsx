"use client";

import { useEffect, useState } from "react";
import type { Session } from "@/lib/types";

export default function EmailBox({
  session,
  loading,
  onGenerate,
  onCopy,
  copied,
}: {
  session: Session | null;
  loading: boolean;
  onGenerate: (username?: string, domain?: string) => void;
  onCopy: () => void;
  copied: boolean;
}) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [domains, setDomains] = useState<string[]>([]);
  const [customDomain, setCustomDomain] = useState("");
  const [domainsLoading, setDomainsLoading] = useState(false);

  useEffect(() => {
    if (!customOpen || domains.length) return;
    setDomainsLoading(true);
    fetch("/api/domain")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data?.domains)) {
          setDomains(data.data.domains);
          setCustomDomain((prev) => prev || data.data.domains[0] || "");
        }
      })
      .catch(() => {})
      .finally(() => setDomainsLoading(false));
  }, [customOpen, domains.length]);

  async function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = customName.trim();
    if (trimmed.length < 3) {
      setError("Minimal 3 karakter.");
      return;
    }
    onGenerate(trimmed, customDomain || undefined);
    setCustomOpen(false);
    setCustomName("");
  }

  return (
    <section id="buat" className="mx-auto max-w-3xl px-5">
      <div className="rounded-[28px] bg-surface p-6 shadow-3d ring-1 ring-white/[0.07]">
        <div className="flex items-center gap-3.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-2 text-paper">
            <MailIcon />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[15px] font-semibold text-paper">
              Email Anda
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-[12px] text-mute">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
              Aktif · dicek otomatis setiap beberapa detik
            </p>
          </div>
        </div>

        <button
          onClick={() => setCustomOpen(true)}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-surface-2 px-3.5 py-2.5 text-[12.5px] font-medium text-paper/90 shadow-soft-sm active:bg-surface-3 transition-colors"
        >
          <PencilIcon />
          Nama Custom
        </button>

        <div className="mt-5 flex items-center gap-2.5 rounded-2xl bg-base p-2.5 shadow-3d-sm ring-1 ring-stroke-soft">
          <div className="flex min-w-0 flex-1 items-center px-3 py-3">
            {loading ? (
              <span className="font-mono text-[14px] text-mute">Membuat email…</span>
            ) : (
              <span className="truncate font-mono text-[14px] text-paper">
                {session?.address ?? "—"}
              </span>
            )}
          </div>
          <button
            onClick={onCopy}
            disabled={!session}
            aria-label="Salin email"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-paper shadow-3d-sm active:scale-95 transition-transform disabled:opacity-30"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
          <button
            onClick={() => onGenerate()}
            aria-label="Buat email baru"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-paper text-ink shadow-3d-sm active:scale-95 transition-transform disabled:opacity-30"
            disabled={loading}
          >
            <RefreshIcon spinning={loading} />
          </button>
        </div>
      </div>

      {customOpen && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
          onClick={() => setCustomOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCustomSubmit}
            className="animate-slide-up w-full max-w-sm rounded-t-[32px] bg-surface p-6 shadow-3d ring-1 ring-white/[0.07] sm:rounded-[32px] sm:mb-0"
          >
            <h3 className="flex items-center gap-2.5 font-display text-[16px] font-semibold text-paper">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 text-paper">
                <PencilIcon />
              </span>
              Buat nama custom
            </h3>
            <p className="mt-1.5 text-[13px] text-mute">
              3–30 karakter. Huruf, angka, titik, underscore, atau strip.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-2xl bg-base px-3.5 py-3.5 ring-1 ring-stroke-soft">
              <input
                autoFocus
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="nama_kamu"
                className="min-w-0 flex-1 bg-transparent font-mono text-[14px] text-paper outline-none placeholder:text-mute-2"
              />
              <span className="shrink-0 font-mono text-[12px] text-mute">@</span>
              <select
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                disabled={domainsLoading || !domains.length}
                aria-label="Pilih domain"
                className="shrink-0 max-w-[42%] bg-transparent font-mono text-[12px] text-paper outline-none disabled:opacity-50"
              >
                {domains.length ? (
                  domains.map((d) => (
                    <option key={d} value={d} className="bg-surface text-paper">
                      {d}
                    </option>
                  ))
                ) : (
                  <option className="bg-surface text-paper">
                    {domainsLoading ? "Memuat…" : "anonmail.site"}
                  </option>
                )}
              </select>
            </div>
            {error && <p className="mt-2.5 text-[13px] text-danger">{error}</p>}
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => setCustomOpen(false)}
                className="flex-1 rounded-full bg-surface-2 py-3.5 text-[13px] font-medium text-mute active:bg-surface-3 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full bg-paper py-3.5 text-[13px] font-semibold text-ink active:scale-[0.98] transition-transform"
              >
                Buat
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 6L12 13L21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="8" y="8" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M16 8V5.5A1.5 1.5 0 0014.5 4H5.5A1.5 1.5 0 004 5.5v9A1.5 1.5 0 005.5 16H8" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className={spinning ? "animate-spin" : ""}>
      <path
        d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M18 4v4h-4M6 20v-4h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
