
"use client";

import { useState } from "react";
import Link from "next/link";

const navigationLinks = [
  { label: "Product", href: "#product" },
  { label: "Solutions", href: "#solutions" },
  { label: "Analytics", href: "#analytics" },
  { label: "Developers", href: "#developers" },
];

export default function MobileNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* LOGO */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFC000] shadow-lg shadow-[#FFC000]/30">
              <span className="text-lg font-bold text-black">N</span>
            </div>

            <span className="text-lg font-semibold tracking-tight text-black">
              NuruPy <span className="text-[#FFC000]">Links</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-8 text-sm text-black/60 md:flex">
            {navigationLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-5 md:flex">
            <Link
              href="/login"
              className="text-sm font-medium text-black/70 transition hover:text-black"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="rounded-full bg-[#FFC000] px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-95"
            >
              Get Started
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 text-black transition hover:bg-[#FFC000]/15 md:hidden"
          >
            {menuOpen ? (
              <svg
                viewBox="0 0 24 24"
                width="23"
                height="23"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="23"
                height="23"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>

        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-black/10 bg-white px-5 pb-6 pt-4 shadow-xl md:hidden"
          >
            <nav className="flex flex-col">
              {navigationLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-black/5 py-4 text-sm font-medium text-black/70 transition hover:text-black"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-black/15 px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-[#FFC000]/10"
              >
                Log in
              </Link>

              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-[#FFC000] px-4 py-3 text-center text-sm font-semibold text-black transition hover:brightness-95"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
