import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt Library — Curated AI Prompts | Pixl",
  description:
    "Browse, search, and test 59 production-ready AI prompts. Copy as Python or TypeScript, or run live against Anthropic, OpenAI, and Google. Built by Pixl.",
  keywords: [
    "AI prompts",
    "prompt library",
    "Claude prompts",
    "Anthropic prompts",
    "LLM prompts",
    "prompt engineering",
    "Python AI code",
    "TypeScript AI code",
    "prompt testing",
    "Pixl",
  ],
  authors: [{ name: "Pixl", url: "https://pixldev.be" }],
  creator: "Pixl",
  publisher: "Pixl",
  metadataBase: new URL("https://prompts.pixldev.be"),
  openGraph: {
    title: "Prompt Library — Curated AI Prompts | Pixl",
    description:
      "59 production-ready AI prompts. Browse, copy as Python or TypeScript, or test live with any provider.",
    url: "https://prompts.pixldev.be",
    siteName: "Prompt Library by Pixl",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Library — Curated AI Prompts | Pixl",
    description:
      "59 production-ready AI prompts. Browse, copy as Python or TypeScript, or test live with any provider.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Navbar */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            height: 48,
            borderBottom: "1px solid var(--border)",
            fontSize: 14,
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Pixl" style={{ height: 18 }} />
            <span style={{ color: "var(--text-tertiary)" }}>/</span>
            <span style={{ color: "var(--white)", fontWeight: 500 }}>Prompts</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a
              href="https://pixldev.be"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--text-secondary)", fontSize: 13 }}
            >
              Pixl
            </a>
            <a
              href="https://docs.anthropic.com/en/prompt-library"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--text-secondary)", fontSize: 13 }}
            >
              Docs
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
