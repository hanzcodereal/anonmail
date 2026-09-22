"use client";

import type { TempMailMessage } from "@/lib/tempmail";

export default function MessageModal({
  message,
  loading,
  onClose,
}: {
  message: TempMailMessage | null;
  loading: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-slide-up flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-[32px] bg-surface shadow-3d ring-1 ring-white/[0.07] sm:rounded-[32px]"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="flex items-center gap-2 font-display text-[13px] font-semibold text-mute">
            <MailDotIcon />
            Pesan
          </span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-paper active:bg-surface-3"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading || !message ? (
            <div className="flex flex-col gap-3">
              <div className="shimmer-bg h-4 w-2/3 animate-shimmer rounded-full" />
              <div className="shimmer-bg h-4 w-1/2 animate-shimmer rounded-full" />
              <div className="shimmer-bg mt-4 h-24 animate-shimmer rounded-2xl" />
            </div>
          ) : (
            <>
              <h3 className="font-display text-[17px] font-semibold leading-snug text-paper">
                {message.subject || "(tanpa subjek)"}
              </h3>
              <div className="mt-2.5 flex items-center gap-2.5 text-[13px] text-mute">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-2 font-display text-xs font-semibold text-paper">
                  {(message.from || "?").charAt(0).toUpperCase()}
                </span>
                <span className="truncate">{message.from}</span>
              </div>
              {message.time && (
                <p className="mt-1 text-[12px] text-mute-2">{message.time}</p>
              )}

              <div className="mt-5 rounded-2xl bg-base p-5 ring-1 ring-stroke-soft">
                {message.body ? (
                  <div
                    className="prose-invert max-w-none text-[14px] leading-relaxed text-paper/90 [&_a]:text-paper [&_a]:underline [&_img]:max-w-full [&_img]:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: message.body }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-paper/90">
                    (tidak ada isi teks)
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MailDotIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M3 6L12 13L21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
