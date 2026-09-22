"use client";

import { useState } from "react";

const NAV_ITEMS = [
  { label: "Inbox", href: "#inbox", icon: <InboxIcon /> },
  { label: "Buat Email", href: "#buat", icon: <PlusCircleIcon /> },
  { label: "Fitur", href: "#fitur", icon: <SparkleIcon /> },
  { label: "Statistik", href: "#statistik", icon: <ChartIcon /> },
  { label: "Pengaturan", href: "#pengaturan", icon: <GearIcon /> },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  function go(href: string) {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header className="gpu-layer sticky top-0 z-30 bg-base/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
        <button onClick={() => go("#top")} className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-2 text-paper shadow-soft-sm ring-1 ring-glow">
            <EnvelopeIcon />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-paper">
            AnonMail
          </span>
        </button>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-2 text-paper shadow-soft-sm ring-1 ring-glow active:bg-surface-3 transition-colors"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {open && (
        <div className="animate-slide-up px-5 pb-4">
          <nav className="flex flex-col gap-1.5 rounded-2xl bg-surface p-2 shadow-soft ring-1 ring-glow">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => go(item.href)}
                className="flex items-center justify-between rounded-xl px-3.5 py-3 text-left text-[14px] font-medium text-paper/90 active:bg-surface-3 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-paper">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-mute-2">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 6L12 13L21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      {open ? (
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M3 6L12 13L21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function PlusCircleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
