"use client";

import { useEffect, useState } from "react";

const items = [
  { key: "inbox", label: "Inbox", href: "#inbox", icon: <MailIcon /> },
  { key: "buat", label: "Buat Email", href: "#buat", icon: <PlusIcon /> },
  { key: "pengaturan", label: "Pengaturan", href: "#pengaturan", icon: <GearIcon /> },
];

export default function BottomNav() {
  const [active, setActive] = useState("inbox");

  useEffect(() => {
    const sections = items
      .map((i) => document.querySelector(i.href))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const match = items.find((i) => i.href === `#${id}`);
            if (match) setActive(match.key);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  function go(item: (typeof items)[number]) {
    setActive(item.key);
    document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="gpu-layer sticky bottom-0 z-20 px-4 pb-4 pt-2">
      <div className="mx-auto flex max-w-3xl items-center justify-around rounded-[26px] bg-surface/95 p-2 shadow-3d-sm ring-1 ring-white/[0.06] backdrop-blur-md">
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => go(item)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2.5 transition-colors ${
                isActive ? "bg-surface-2 text-paper" : "text-mute-2"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function MailIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M3 6L12 13L21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
