export default function Footer() {
  return (
    <footer className="mx-auto mt-8 max-w-3xl px-5 pb-6">
      <div className="flex flex-col items-center gap-2 border-t border-stroke-soft pt-6 text-center">
        <a
          href="https://saweria.co/hanzreally"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-[12px] font-medium text-paper underline underline-offset-2"
        >
          <CoffeeIcon />
          Dukung
        </a>
      </div>
    </footer>
  );
}

function CoffeeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 9h13v5a5 5 0 01-5 5H9a5 5 0 01-5-5V9z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 10.5h1.2a2.3 2.3 0 010 4.6H17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 2.5c-.6.9.5 1.3 0 2.2M12 2.5c-.6.9.5 1.3 0 2.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
