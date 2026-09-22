import AnonMailArt from "./AnonMailArt";

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-3xl px-5 pb-10 pt-8">
      <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-[1.2fr_1fr]">
        <div>
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3.5 py-1.5 text-[11px] font-medium text-mute shadow-soft-sm ring-1 ring-glow">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            100% Gratis · Tanpa Login
          </span>
          <h1 className="font-display text-[2.35rem] font-semibold leading-[1.08] tracking-tight text-paper sm:text-[2.75rem]">
            Email Sementara,
            <br />
            <span className="text-mute">Privasi Utama.</span>
          </h1>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-mute">
            Buat email sementara instan, terima pesan, lindungi privasi Anda
            tanpa ribet.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3.5 text-[12px] text-mute-2">
            <span className="flex items-center gap-1.5">
              <LockIcon /> Anonim
            </span>
            <span className="flex items-center gap-1.5">
              <BoltMiniIcon /> Instan
            </span>
            <span className="flex items-center gap-1.5">
              <TrashMiniIcon /> Auto hapus
            </span>
          </div>
        </div>
        <div className="relative flex justify-center sm:justify-end">
          <div className="absolute inset-8 -z-10 rounded-full bg-surface-2/60 blur-2xl" />
          <AnonMailArt className="h-40 w-40 sm:h-48 sm:w-48" />
        </div>
      </div>
    </section>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function BoltMiniIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function TrashMiniIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0l1 13h8l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
