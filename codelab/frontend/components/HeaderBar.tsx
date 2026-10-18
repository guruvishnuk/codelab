"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderBarProps {
  children?: React.ReactNode;
  authSlot?: React.ReactNode;
}

export default function HeaderBar({ children, authSlot }: HeaderBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  function getBreadcrumb() {
    if (pathname === "/") return "Overview";
    if (pathname.startsWith("/topics/")) {
      const slug = pathname.replace("/topics/", "");
      return slug.replace(/-/g, " ");
    }
    if (pathname.startsWith("/exercises/")) {
      const id = pathname.replace("/exercises/", "");
      return `Challenge #${id}`;
    }
    if (pathname === "/profile") return "Profile & Ranks";
    if (pathname === "/about") return "Architecture Specs";
    if (pathname === "/search") return "Search Results";
    if (pathname === "/admin") return "Admin Console";
    return "";
  }

  const breadcrumb = getBreadcrumb();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-paper/85 backdrop-blur-xl px-4 md:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-ink hover:border-brand transition-colors"
            aria-label="Toggle navigation menu"
          >
            <span className="text-sm">{mobileOpen ? "✕" : "☰"}</span>
          </button>

          {/* Breadcrumb Display */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <Link href="/" className="text-muted hover:text-brand transition-colors flex items-center gap-1.5">
              <span>CodeLab</span>
            </Link>
            {breadcrumb && (
              <>
                <span className="text-line">/</span>
                <span className="text-brand font-semibold capitalize truncate max-w-[150px] sm:max-w-none">
                  {breadcrumb}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-3 py-1 font-mono text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse" />
            <span>Python 3.11 Runtime</span>
          </div>

          {authSlot}
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-[280px] h-full bg-surface border-r border-line p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-line/60 mb-4">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 font-display text-lg font-bold text-ink"
              >
                <i className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#8f7bff] to-[#ff7f70] font-mono text-xs font-bold text-white not-italic shadow-xs">
                  &lt;/&gt;
                </i>
                <span>CodeLab</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="h-8 w-8 rounded-lg border border-line bg-surface-elevated text-muted hover:text-ink text-sm flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div onClick={() => setMobileOpen(false)}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
