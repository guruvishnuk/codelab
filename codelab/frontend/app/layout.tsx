import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Unbounded } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import AuthWidget from "@/components/AuthWidget";

const sans = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-sans" });
const display = Unbounded({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "CodeLab — Interactive 3D Coding & Assessment Platform",
  description: "Learn to code topic by topic. Read concise notes, then write and test code in your browser.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="bg-paper text-ink font-sans antialiased selection:bg-brand/30 selection:text-white">
        <div className="min-h-screen bg-grid-ambient md:grid md:grid-cols-[270px_1fr]">
          {/* Desktop Fixed / Sticky Left Sidebar */}
          <aside className="hidden md:flex flex-col justify-between border-r border-line bg-surface/90 backdrop-blur-xl md:sticky md:top-0 md:h-screen md:overflow-y-auto z-40">
            <div>
              {/* CodeLab Brand Header */}
              <div className="px-5 py-5 border-b border-line/60">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-ink hover:opacity-90 transition-opacity"
                >
                  <i className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[#8f7bff] to-[#ff7f70] font-mono text-sm font-bold text-white not-italic shadow-xs">
                    &lt;/&gt;
                  </i>
                  <span>CodeLab</span>
                </Link>
              </div>

              {/* Sidebar Navigation */}
              <div className="py-3">
                <Sidebar />
              </div>
            </div>

            {/* Sidebar Bottom Footer Info */}
            <div className="p-4 border-t border-line/50 text-[11px] text-muted font-mono bg-surface/40">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
                  CodeLab Engine
                </span>
                <span className="text-brand font-bold">v2.4</span>
              </div>
            </div>
          </aside>

          {/* Main Content Column with Fixed / Sticky Header */}
          <div className="flex flex-col min-h-screen min-w-0">
            {/* Sticky Header with Dynamic Breadcrumbs & Mobile Drawer */}
            <HeaderBar authSlot={<AuthWidget />}>
              <Sidebar />
            </HeaderBar>

            {/* Main Application Body */}
            <main className="flex-1 px-4 py-6 md:px-10 md:py-8">{children}</main>

            {/* Global Bottom Footer */}
            <footer className="border-t border-line bg-surface/30 py-6 px-5 md:px-10 text-center text-sm text-muted flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs">© 2026 CodeLab · Built for people who learn by doing.</span>
              <div className="flex items-center gap-6 text-xs font-medium">
                <Link href="/about" className="hover:text-brand hover:underline">
                  About CodeLab
                </Link>
                <Link href="/" className="hover:text-brand hover:underline">
                  All Tracks
                </Link>
                <Link href="/profile" className="hover:text-brand hover:underline">
                  Profile
                </Link>
                <Link href="/admin" className="hover:text-brand hover:underline">
                  Admin
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
