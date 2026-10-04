import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const sans = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "CodeLab",
  description: "Learn to code topic by topic. Read the notes, then solve exercises.",
};

import AuthWidget from "@/components/AuthWidget";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
          <aside className="border-b border-line bg-white md:border-b-0 md:border-r">
            <div className="px-5 py-4">
              <Link href="/" className="text-xl font-bold tracking-tight text-brand">
                CodeLab
              </Link>
            </div>
            <Sidebar />
          </aside>
          <div className="flex flex-col bg-slate-50/50">
            <header className="flex h-16 items-center justify-end border-b border-line bg-white px-5 md:px-10">
              <AuthWidget />
            </header>
            <main className="flex-1 px-5 py-8 md:px-10">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
