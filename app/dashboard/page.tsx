
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ShortLink = {
  id: number;
  title: string;
  shortUrl: string;
  destination: string;
  clicks: number;
  created: string;
  status: "Active" | "Paused";
};

const initialLinks: ShortLink[] = [
  {
    id: 1,
    title: "My Business Website",
    shortUrl: "nurupy.link/business",
    destination: "https://example.com/business",
    clicks: 1248,
    created: "Nov 14, 2026",
    status: "Active",
  },
  {
    id: 2,
    title: "Instagram Campaign",
    shortUrl: "nurupy.link/instagram",
    destination: "https://instagram.com",
    clicks: 864,
    created: "Nov 13, 2026",
    status: "Active",
  },
  {
    id: 3,
    title: "Product Promotion",
    shortUrl: "nurupy.link/promo",
    destination: "https://example.com/promotion",
    clicks: 532,
    created: "Nov 12, 2026",
    status: "Active",
  },
  {
    id: 4,
    title: "YouTube Channel",
    shortUrl: "nurupy.link/youtube",
    destination: "https://youtube.com",
    clicks: 318,
    created: "Nov 10, 2026",
    status: "Paused",
  },
];

const menuItems = [
  { label: "Overview", icon: "▦", href: "/dashboard" },
  { label: "My Links", icon: "↗", href: "/dashboard/links" },
  { label: "QR Codes", icon: "▧", href: "/dashboard/qr-codes" },
  { label: "Deep Linking", icon: "⌁", href: "/dashboard/deep-links" },
  { label: "Analytics", icon: "▥", href: "/dashboard/analytics" },
];
const bottomItems = [
  { label: "Settings", icon: "⚙", href: "/dashboard/settings" },
];

const chartData = [32, 48, 39, 67, 52, 78, 60, 88, 72, 95, 69, 84];

export default function DashboardPage() {
  const [links, setLinks] = useState(initialLinks);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredLinks = useMemo(() => {
    const term = search.toLowerCase();

    return links.filter(
      (link) =>
        link.title.toLowerCase().includes(term) ||
        link.shortUrl.toLowerCase().includes(term) ||
        link.destination.toLowerCase().includes(term)
    );
  }, [links, search]);

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  async function copyLink(link: ShortLink) {
    try {
      await navigator.clipboard.writeText(`https://${link.shortUrl}`);
      setCopiedId(link.id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      alert("Unable to copy. Please copy the link manually.");
    }
  }

  function createLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanDestination = destination.trim();

    if (!cleanDestination) return;

    let validUrl: URL;

    try {
      validUrl = new URL(
        /^https?:\/\//i.test(cleanDestination)
          ? cleanDestination
          : `https://${cleanDestination}`
      );

      if (!["http:", "https:"].includes(validUrl.protocol)) return;
    } catch {
      alert("Please enter a valid destination URL.");
      return;
    }

    const slug =
      title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 25) || `link-${Date.now().toString().slice(-5)}`;

    const newLink: ShortLink = {
      id: Date.now(),
      title: title.trim() || "Untitled Link",
      shortUrl: `nurupy.link/${slug}`,
      destination: validUrl.href,
      clicks: 0,
      created: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Active",
    };

    setLinks((current) => [newLink, ...current]);
    setTitle("");
    setDestination("");
    setModalOpen(false);
  }

  function toggleStatus(id: number) {
    setLinks((current) =>
      current.map((link) =>
        link.id === id
          ? {
              ...link,
              status: link.status === "Active" ? "Paused" : "Active",
            }
          : link
      )
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111]">
      {/* MOBILE TOP BAR */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-black/10 bg-white px-5 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFC000] font-bold">
            N
          </div>
          <span className="font-bold">
            NuruPy <span className="text-[#FFC000]">Links</span>
          </span>
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-black/10 px-3 py-2 text-xl"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-64 flex-col border-r border-black/10 bg-white transition-transform duration-300 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-black/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC000] text-lg font-bold">
            N
          </div>
          <span className="text-lg font-bold">
            NuruPy <span className="text-[#FFC000]">Links</span>
          </span>
        </div>

        <div className="px-5 pt-8">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.15em] text-black/35">
            Workspace
          </p>

          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  index === 0
                    ? "bg-[#FFC000] text-black"
                    : "text-black/55 hover:bg-[#FFC000]/10 hover:text-black"
                }`}
              >
                <span className="w-5 text-center text-lg">{item.icon}</span>
                {item.label}
                {index === 1 && (
                  <span className="ml-auto rounded-md bg-black/5 px-2 py-0.5 text-xs">
                    {links.length}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-9 px-5">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.15em] text-black/35">
            Preferences
          </p>

          <nav className="space-y-1">
            {bottomItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-black/55 transition hover:bg-[#FFC000]/10 hover:text-black"
              >
                <span className="w-5 text-center text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t border-black/10 p-5">
          <div className="flex items-center gap-3 rounded-xl bg-[#fafafa] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFC000] font-bold">
              U
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">Your Account</p>
              <p className="text-xs text-black/45">Free Plan</p>
            </div>
            <span className="ml-auto text-black/40">•••</span>
          </div>

          <Link
            href="/"
            className="mt-4 block px-3 text-sm text-black/45 transition hover:text-black"
          >
            ← Back to website
          </Link>
        </div>
      </aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      {menuOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}

      {/* MAIN CONTENT */}
      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 hidden h-20 items-center justify-between border-b border-black/10 bg-white/95 px-8 backdrop-blur lg:flex">
          <div>
            <p className="text-sm text-black/45">Workspace / Overview</p>
            <h1 className="mt-1 text-xl font-bold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-full bg-[#FFC000] px-5 py-3 text-sm font-bold text-black transition hover:brightness-95"
            >
              + Create new link
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white font-bold">
              U
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
          {/* PAGE INTRO */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-black/45">
                Welcome to NuruPy Links
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Your link overview
              </h2>
              <p className="mt-2 text-sm text-black/45">
                Manage your links and monitor their performance.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="rounded-xl bg-[#FFC000] px-5 py-3 text-sm font-bold text-black transition hover:brightness-95 lg:hidden"
            >
              + Create new link
            </button>
          </div>

          {/* STATISTICS */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Total links",
                value: links.length.toLocaleString(),
                icon: "↗",
                note: "Links in your workspace",
              },
              {
                label: "Total clicks",
                value: totalClicks.toLocaleString(),
                icon: "◉",
                note: "Across all your links",
              },
              {
                label: "Active links",
                value: links.filter((link) => link.status === "Active").length.toString(),
                icon: "✓",
                note: "Currently enabled",
              },
              {
                label: "Unique visitors",
                value: "1,842",
                icon: "◎",
                note: "Sample analytics data",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-black/10 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-black/50">
                    {stat.label}
                  </p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC000]/20 text-xl font-bold">
                    {stat.icon}
                  </span>
                </div>
                <p className="mt-5 text-3xl font-bold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs text-black/40">{stat.note}</p>
              </div>
            ))}
          </section>

          {/* ANALYTICS CHART */}
          <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">Click performance</h3>
                <p className="mt-1 text-sm text-black/45">
                  Sample activity over the last 12 periods
                </p>
              </div>

              <span className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold">
                Last 12 periods
              </span>
            </div>

            <div className="mt-8 flex h-48 items-end gap-2 sm:gap-4">
              {chartData.map((height, index) => (
                <div
                  key={index}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div
                    className="w-full rounded-t-md bg-[#FFC000] transition hover:brightness-90"
                    style={{ height: `${height}%` }}
                    title={`Activity ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between text-[10px] font-medium text-black/35 sm:text-xs">
              <span>Period 1</span>
              <span>Period 4</span>
              <span>Period 8</span>
              <span>Period 12</span>
            </div>
          </section>

          {/* RECENT LINKS */}
          <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="flex flex-col justify-between gap-4 border-b border-black/10 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h3 className="text-lg font-bold">Your recent links</h3>
                <p className="mt-1 text-sm text-black/45">
                  Manage and track your shortened URLs.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search links..."
                  className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none transition focus:border-[#FFC000] sm:w-52"
                />

                <Link
                  href="/dashboard/links"
                  className="rounded-xl border border-black/10 px-4 py-2.5 text-center text-sm font-semibold transition hover:bg-[#FFC000]/15"
                >
                  View all
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="bg-[#fafafa] text-xs uppercase tracking-wider text-black/40">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Link</th>
                    <th className="px-6 py-4 font-semibold">Clicks</th>
                    <th className="px-6 py-4 font-semibold">Created</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/5">
                  {filteredLinks.map((link) => (
                    <tr key={link.id} className="transition hover:bg-[#fafafa]">
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold">{link.title}</p>
                        <a
                          href={`https://${link.shortUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block text-xs text-black/45 hover:text-black"
                        >
                          {link.shortUrl}
                        </a>
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold">
                        {link.clicks.toLocaleString()}
                      </td>

                      <td className="px-6 py-5 text-sm text-black/50">
                        {link.created}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            link.status === "Active"
                              ? "bg-[#FFC000]/20 text-black"
                              : "bg-black/5 text-black/50"
                          }`}
                        >
                          {link.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => copyLink(link)}
                            className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold transition hover:border-[#FFC000] hover:bg-[#FFC000]/15"
                          >
                            {copiedId === link.id ? "Copied!" : "Copy"}
                          </button>

                          <button
                            onClick={() => toggleStatus(link.id)}
                            className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold transition hover:bg-[#FFC000]/15"
                          >
                            {link.status === "Active" ? "Pause" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredLinks.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-sm text-black/40"
                      >
                        No links found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="pb-5 text-center text-xs text-black/35">
            © 2026 NuruPy Links. All rights reserved.
          </footer>
        </div>
      </main>

      {/* CREATE LINK MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Create a new link</h3>
                <p className="mt-1 text-sm text-black/45">
                  Enter the destination you want to shorten.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-xl transition hover:bg-[#FFC000]"
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <form onSubmit={createLink} className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Link name
                </label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. My Business Website"
                  className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Destination URL
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold transition hover:bg-black/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#FFC000] px-4 py-3 text-sm font-bold transition hover:brightness-95"
                >
                  Create link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
