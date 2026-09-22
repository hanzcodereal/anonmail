import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://anonmail.example.com";
// Set NEXT_PUBLIC_OG_IMAGE_URL in your environment to point at a hosted
// 1200x630 PNG/JPG banner. Falls back to the generated placeholder route
// below if not provided.
const OG_IMAGE_URL = process.env.NEXT_PUBLIC_OG_IMAGE_URL || `${SITE_URL}/og-image.png`;

const TITLE = "AnonMail — Email Sementara, Privasi Utama";
const DESCRIPTION =
  "Buat email sementara instan, terima pesan, dan lindungi privasi Anda tanpa ribet. Gratis, tanpa registrasi, auto-cek inbox real-time.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · AnonMail",
  },
  description: DESCRIPTION,
  applicationName: "AnonMail",
  keywords: [
    "email sementara",
    "temp mail",
    "temporary email",
    "email anonim",
    "email sekali pakai",
    "disposable email",
    "privasi email",
    "mailbox",
  ],
  authors: [{ name: "hanzcode" }],
  creator: "hanzcode",
  publisher: "hanzcode",
  category: "technology",
  formatDetection: { telephone: false },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "AnonMail",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "AnonMail — Email Sementara, Privasi Utama",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AnonMail",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AnonMail",
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "IDR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-base text-paper font-body antialiased">{children}</body>
    </html>
  );
}
