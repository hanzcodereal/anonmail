import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0B0B0C",
        surface: "#161618",
        "surface-2": "#1E1E21",
        "surface-3": "#28282C",
        stroke: "#2A2A2E",
        "stroke-soft": "#232326",
        ink: "#0B0B0C",
        paper: "#F5F5F4",
        mute: "#9B9BA1",
        "mute-2": "#6E6E74",
        danger: "#F0654E",
        success: "#3ECF8E",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
        "soft-lg": "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 16px 40px -16px rgba(0,0,0,0.7)",
        "soft-sm": "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 4px 12px -6px rgba(0,0,0,0.5)",
        glow: "0 0 0 1px rgba(245,245,244,0.06)",
        // Static "3D card" look, kept to 3 layers (not 5) so browsers don't
        // have to composite an excessive shadow stack on every element —
        // still reads as a raised card, just cheaper to paint.
        "3d": `
          0 1px 0 0 rgba(255,255,255,0.08) inset,
          0 1px 0 0 rgba(255,255,255,0.05),
          0 20px 40px -16px rgba(0,0,0,0.8)
        `,
        "3d-sm": `
          0 1px 0 0 rgba(255,255,255,0.07) inset,
          0 10px 20px -10px rgba(0,0,0,0.7)
        `,
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.35", transform: "scale(0.85)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.3s ease-out",
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
