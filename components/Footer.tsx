export default function Footer() {
  return (
    <footer className="mx-auto mt-8 max-w-3xl px-5 pb-6">
      <div className="flex flex-col items-center gap-2 border-t border-stroke-soft pt-6 text-center">
        <p className="text-[12px] text-mute-2">
          AnonMail dibuat oleh{" "}
          <span className="font-medium text-mute">hanzcode</span>
        </p>
        <a
          href="https://saweria.co/hanzreally"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-[12px] font-medium text-paper underline underline-offset-2"
        >
          Dukung developer di Saweria
        </a>
      </div>
    </footer>
  );
}
