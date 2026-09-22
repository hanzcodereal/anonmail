export default function AnonMailArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 340"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mb-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5F5F4" />
          <stop offset="100%" stopColor="#DADADA" />
        </linearGradient>
        <linearGradient id="mb-side" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C4C4C4" />
          <stop offset="100%" stopColor="#A8A8A8" />
        </linearGradient>
      </defs>

      {/* front face */}
      <path
        d="M50 115 L57 258 L228 296 L233 135 Z"
        fill="url(#mb-face)"
        stroke="#0B0B0C"
        strokeWidth="0"
      />
      <path
        d="M50 115 L233 135 L296 100 L118 82 Z"
        fill="url(#mb-face)"
      />
      <path
        d="M233 135 L296 100 L291 250 L228 296 Z"
        fill="url(#mb-side)"
      />

      {/* rounded inner opening */}
      <rect x="72" y="130" width="140" height="105" rx="18" fill="#141416" transform="rotate(-2 142 182)" />

      {/* envelope, rounded */}
      <g transform="rotate(-2 140 200)">
        <rect x="85" y="168" width="115" height="70" rx="12" fill="#F5F5F4" />
        <path
          d="M85 178 L142 210 L200 178"
          fill="none"
          stroke="#0B0B0C"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.18"
        />
      </g>

      {/* post */}
      <rect x="270" y="90" width="8" height="98" rx="4" fill="#3A3A3E" />
      {/* flag, rounded pill */}
      <rect x="272" y="44" width="60" height="34" rx="17" fill="#F5F5F4" />
      {/* hinge */}
      <circle cx="278" cy="190" r="16" fill="#1E1E21" />
      <circle cx="278" cy="190" r="5" fill="#F5F5F4" />

      {/* soft ground shadow */}
      <ellipse cx="170" cy="300" rx="150" ry="14" fill="#000000" opacity="0.35" />

      {/* decorative dots */}
      <g fill="#F5F5F4" opacity="0.35">
        <circle cx="24" cy="200" r="3.5" />
        <circle cx="24" cy="216" r="3.5" />
        <circle cx="38" cy="200" r="3.5" />
        <circle cx="38" cy="216" r="3.5" />
      </g>
      <g stroke="#F5F5F4" strokeWidth="4" strokeLinecap="round" opacity="0.4">
        <line x1="26" y1="70" x2="26" y2="86" />
        <line x1="18" y1="78" x2="34" y2="78" />
      </g>
    </svg>
  );
      }
