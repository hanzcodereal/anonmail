"use client";

import type { TempMailMessage } from "@/lib/tempmail";

export default function InboxList({
  messages,
  onOpen,
  onClearAll,
  autoChecking,
}: {
  messages: TempMailMessage[];
  onOpen: (number: number) => void;
  onClearAll: () => void;
  autoChecking: boolean;
}) {
  return (
    <section id="inbox" className="mx-auto max-w-3xl px-5 pt-12">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-display text-[15px] font-semibold text-paper">
            Inbox
          </span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-surface-2 px-1.5 text-[11px] font-medium text-paper">
            {messages.length}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-mute-2">
            <span
              className={`h-1.5 w-1.5 rounded-full bg-success ${
                autoChecking ? "animate-pulse-dot" : "opacity-30"
              }`}
            />
            {autoChecking ? "live" : "idle"}
          </span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-[12px] font-medium text-mute active:bg-surface-3 transition-colors"
          >
            <TrashIcon /> Hapus
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 rounded-[28px] bg-surface px-6 py-16 text-center shadow-3d-sm ring-1 ring-white/[0.06]">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-mute">
              <InboxIcon />
            </span>
            <span className="mt-1 font-display text-[15px] font-semibold text-paper">
              Belum ada pesan
            </span>
            <p className="max-w-[240px] text-[13px] leading-relaxed text-mute">
              Inbox dicek otomatis. Pesan baru akan muncul di sini begitu masuk.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <button
              key={m.number}
              onClick={() => onOpen(m.number)}
              className="flex items-center gap-3.5 rounded-2xl bg-surface px-4 py-4 text-left shadow-3d-sm ring-1 ring-white/[0.06] active:bg-surface-2 transition-colors"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 font-display text-sm font-semibold text-paper">
                {(m.from || "?").charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate font-display text-[14px] font-semibold text-paper">
                    {m.from || "Tanpa nama"}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-mute-2">
                    {m.time}
                  </span>
                </span>
                <span className="mt-0.5 flex items-center gap-1.5">
                  <span className="truncate text-[13px] text-mute">
                    {m.subject || "(tanpa subjek)"}
                  </span>
                </span>
              </span>
            </button>
          ))
        )}
      </div>
    </section>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0l1 13h8l1-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function InboxIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 6L12 13L21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
