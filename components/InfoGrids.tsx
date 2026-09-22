export function FeatureGrid() {
  const features = [
    { icon: <ShieldIcon />, title: "100% Privasi", desc: "Aman & anonim" },
    { icon: <BoltIcon />, title: "Instan", desc: "Sekali klik jadi" },
    { icon: <TrashIcon />, title: "Auto Hapus", desc: "Email otomatis hilang" },
  ];
  return (
    <section id="fitur" className="mx-auto max-w-3xl px-5 pt-12">
      <span className="mb-4 flex items-center gap-2 font-display text-[15px] font-semibold text-paper">
        <SparklesIcon />
        Kenapa AnonMail
      </span>
      <div className="grid grid-cols-3 gap-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex flex-col items-center gap-2.5 rounded-[22px] bg-surface px-2.5 py-6 text-center shadow-3d-sm ring-1 ring-white/[0.06]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-paper">
              {f.icon}
            </span>
            <span className="font-display text-[12.5px] font-semibold leading-tight text-paper">
              {f.title}
            </span>
            <span className="text-[11px] leading-tight text-mute">{f.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StatsGrid({
  received,
  minutesLeft,
}: {
  received: number;
  minutesLeft: number;
}) {
  const hours = Math.floor(minutesLeft / 60);
  const mins = minutesLeft % 60;
  const stats = [
    { icon: <MailIcon />, value: String(received), label: "Email Diterima" },
    {
      icon: <ClockIcon />,
      value: `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`,
      label: "Waktu Tersisa",
    },
  ];
  return (
    <section id="statistik" className="mx-auto max-w-3xl px-5 pt-12">
      <span className="mb-4 flex items-center gap-2 font-display text-[15px] font-semibold text-paper">
        <ChartBarIcon />
        Statistik
      </span>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-3.5 rounded-[22px] bg-surface p-5 shadow-3d-sm ring-1 ring-white/[0.06]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 text-paper">
              {s.icon}
            </span>
            <div>
              <span className="block font-display text-xl font-bold leading-none text-paper">
                {s.value}
              </span>
              <span className="mt-1 block text-[11px] text-mute">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* server-status style card, echoing the reference's ping bar */}
      <div className="mt-3 rounded-[22px] bg-surface p-5 shadow-3d-sm ring-1 ring-white/[0.06]">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-mute">
          <ShieldIcon />
          Privasi
        </span>
        <div className="flex items-end gap-1.5">
          <span className="font-display text-2xl font-bold text-paper">100</span>
          <span className="mb-0.5 text-[13px] text-mute">% aman &amp; privat</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-base">
          <div className="h-full w-full rounded-full bg-paper" />
        </div>
      </div>
    </section>
  );
}

export function CTASection({ onGenerate }: { onGenerate: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-12">
      <button
        onClick={onGenerate}
        className="flex w-full items-center justify-between gap-3 rounded-[26px] bg-paper px-6 py-6 text-left text-ink shadow-3d active:scale-[0.99] transition-transform"
      >
        <span className="flex items-center gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-paper text-lg font-semibold">
            +
          </span>
          <span>
            <span className="block font-display text-[14.5px] font-semibold leading-tight">
              Buat Email Sementara Sekarang
            </span>
            <span className="block text-[12.5px] text-ink/60">
              Cepat, gratis, dan tanpa registrasi.
            </span>
          </span>
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </section>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0l1 13h8l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 6L12 13L21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-mute">
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChartBarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-mute">
      <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
