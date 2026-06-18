import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE = {
  name: "OmniTrace",
  title: "OmniTrace — AI-powered code archaeology",
  description:
    "Excavate the forgotten code in any repository. OmniTrace maps architecture, visualizes dependencies, and explains legacy code with local-first AI — your code never leaves your machine.",
  url: "https://omnitrace.dev",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "code archaeology",
    "repository intelligence",
    "dependency visualization",
    "architecture mapping",
    "semantic code search",
    "local LLM",
    "developer tools",
    "legacy code",
  ],
  icons: { icon: "/omnitrace.svg" },
  openGraph: {
    type: "website",
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#040308",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans">
        {children}
        {/* Fixed decorative layers: film grain + edge vignette for depth.
            High z but pointer-events-none, so they sit over all content
            without ever intercepting clicks. */}
        <div
          aria-hidden
          className="noise pointer-events-none fixed inset-0 z-[55] opacity-[0.035] mix-blend-soft-light"
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[54] bg-[radial-gradient(circle_at_50%_40%,transparent_62%,rgba(2,1,6,0.65)_100%)]"
        />
      </body>
    </html>
  );
}
