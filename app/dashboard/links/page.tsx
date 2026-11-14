
"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";

type ShortLink = {
  id: number;
  title: string;
  slug: string;
  destination: string;
  clicks: number;
  created: string;
  status: "Active" | "Paused";
};

const initialLinks: ShortLink[] = [
  {
    id: 1,
    title: "My Business Website",
    slug: "business",
    destination: "https://example.com/business",
    clicks: 1248,
    created: "Nov 14, 2026",
    status: "Active",
  },
  {
    id: 2,
    title: "Instagram Campaign",
    slug: "instagram",
    destination: "https://instagram.com",
    clicks: 864,
    created: "Nov 13, 2026",
    status: "Active",
  },
  {
    id: 3,
    title: "Product Promotion",
    slug: "promo",
    destination: "https://example.com/promotion",
    clicks: 532,
    created: "Nov 12, 2026",
    status: "Active",
  },
  {
    id: 4,
    title: "YouTube Channel",
    slug: "youtube",
    destination: "https://youtube.com",
    clicks: 318,
    created: "Nov 10, 2026",
    status: "Paused",
  },
];

const SHORT_DOMAIN = "nurupy.link";

const navigationLinks = [
  { label: "Overview", icon: "▦", href: "/dashboard" },
  { label: "My Links", icon: "↗", href: "/dashboard/links" },
  { label: "QR Codes", icon: "▧", href: "/dashboard/qr-codes" },
  { label: "Deep Linking", icon: "⌁", href: "/dashboard/deep-links" },
  { label: "Analytics", icon: "▥", href: "/dashboard/analytics" },
];

export default function LinksPage() {
  const [links, setLinks] = useState<ShortLink[]>(initialLinks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [customSlug, setCustomSlug] = useState("");

  const filteredLinks = useMemo(() => {
    const term = search.toLowerCase().trim();

    return links.filter((link) => {
      const matchesSearch =
        link.title.toLowerCase().includes(term) ||
        link.slug.toLowerCase().includes(term) ||
        link.destination.toLowerCase().includes(term);

      const matchesFilter =
        filter === "All" || link.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [links, search, filter]);

  const activeCount = links.filter(
    (link) => link.status === "Active"
  ).length;

  const totalClicks = links.reduce(
    (total, link) => total + link.clicks,
    0
  );

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
  }

  function openCreateModal() {
    setEditingId(null);
    setTitle("");
    setDestination("");
    setCustomSlug("");
    setModalOpen(true);
  }

  function openEditModal(link: ShortLink) {
    setEditingId(link.id);
    setTitle(link.title);
    setDestination(link.destination);
    setCustomSlug(link.slug);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setTitle("");
    setDestination("");
    setCustomSlug("");
  }

  function saveLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedDestination =
      /^https?:\/\//i.test(destination.trim())
        ? destination.trim()
        : `https://${destination.trim()}`;

    let validUrl: URL;

    try {
      validUrl = new URL(normalizedDestination);

      if (
        !["http:", "https:"].includes(validUrl.protocol) ||
        !validUrl.hostname.includes(".") ||
        !/^[a-z0-9.-]+$/i.test(validUrl.hostname) ||
        validUrl.hostname.startsWith(".") ||
        validUrl.hostname.endsWith(".")
      ) {
        throw new Error("Invalid URL");
      }
    } catch {
      alert("Please enter a valid website URL.");
      return;
    }

    const slug = generateSlug(customSlug);

    if (!slug) {
      alert("Please enter a valid custom alias.");
      return;
    }

    const duplicate = links.some(
      (link) => link.slug === slug && link.id !== editingId
    );

    if (duplicate) {
      alert("This custom alias is already in use. Choose another one.");
      return;
    }

    if (editingId !== null) {
      setLinks((current) =>
        current.map((link) =>
          link.id === editingId
            ? {
                ...link,
                title: title.trim() || "Untitled Link",
                slug,
                destination: validUrl.href,
              }
            : link
        )
      );
    } else {
      const newLink: ShortLink = {
        id: Date.now(),
        title: title.trim() || "Untitled Link",
        slug,
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
    }

    closeModal();
  }

  async function copyLink(link: ShortLink) {
    const url = `https://${SHORT_DOMAIN}/${link.slug}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(link.id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      alert("Copy failed. Please copy the link manually.");
    }
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

  function deleteLink(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this link?"
    );

    if (!confirmed) return;

    setLinks((current) => current.filter((link) => link.id !== id));
  }

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      {/* MOBILE HEADER */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-black/10 bg-white px-5 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFC000] font-bold">
            N
          </div>
          <span className="font-bold">
            NuruPy <span className="text-[#FFC000]">Links</span>
          </span>
        </Link>

        <Link
          href="/dashboard"
          className="text-sm font-semibold text-black/60"
        >
          Dashboard
        </Link>
      </header>

      {/* SIDEBAR */}
      <aside className="fixed bottom-0 left-0 top-0 z-30 hidden w-64 flex-col border-r border-black/10 bg-white lg:flex">
        <Link
          href="/dashboard"
          className="flex h-20 items-center gap-3 border-b border-black/10 px-6"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC000] text-lg font-bold">
            N
          </div>

          <span className="text-lg font-bold">
            NuruPy <span className="text-[#FFC000]">Links</span>
          </span>
        </Link>

        <div className="px-5 pt-8">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.15em] text-black/35">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigationLinks.map((item) => {
              const isActive = item.href === "/dashboard/links";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#FFC000] text-black"
                      : "text-black/55 hover:bg-[#FFC000]/10 hover:text-black"
                  }`}
                >
                  <span className="w-5 text-center text-lg">
                    {item.icon}
                  </span>

                  {item.label}

                  {isActive && (
                    <span className="ml-auto rounded-md bg-black/10 px-2 py-0.5 text-xs">
                      {links.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-9 px-5">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.15em] text-black/35">
            Preferences
          </p>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-black/55 transition hover:bg-[#FFC000]/10 hover:text-black"
          >
            <span className="w-5 text-center text-lg">⚙</span>
            Settings
          </Link>
        </div>

        <div className="mt-auto border-t border-black/10 p-5">
          <div className="flex items-center gap-3 rounded-xl bg-[#fafafa] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFC000] font-bold">
              U
            </div>

            <div>
              <p className="text-sm font-bold">Your Account</p>
              <p className="text-xs text-black/45">Free Plan</p>
            </div>
          </div>

          <Link
            href="/"
            className="mt-4 block px-3 text-sm text-black/45 hover:text-black"
          >
            ← Back to website
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        <header className="sticky top-0 z-20 hidden h-20 items-center justify-between border-b border-black/10 bg-white/95 px-8 backdrop-blur lg:flex">
          <div>
            <p className="text-sm text-black/45">
              Workspace / My Links
            </p>
            <h1 className="mt-1 text-xl font-bold">My Links</h1>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-full bg-[#FFC000] px-5 py-3 text-sm font-bold transition hover:brightness-95"
          >
            + Create new link
          </button>
        </header>

        <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">
          {/* INTRO */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-black/45">
                Link management
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Manage your links
              </h2>

              <p className="mt-2 text-sm text-black/45">
                Create, organize and control all your shortened URLs.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-xl bg-[#FFC000] px-5 py-3 text-sm font-bold transition hover:brightness-95 lg:hidden"
            >
              + Create new link
            </button>
          </section>

          {/* SUMMARY CARDS */}
          <section className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total links", value: links.length },
              { label: "Active links", value: activeCount },
              {
                label: "Total clicks",
                value: totalClicks.toLocaleString(),
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-black/10 bg-white p-5"
              >
                <p className="text-sm font-medium text-black/45">
                  {stat.label}
                </p>

                <p className="mt-3 text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </section>

          {/* LINKS TABLE */}
          <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="space-y-5 border-b border-black/10 p-5 sm:p-6">
              <div>
                <h3 className="text-lg font-bold">All your links</h3>

                <p className="mt-1 text-sm text-black/45">
                  You currently have {links.length} links in your workspace.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, alias or URL..."
                  aria-label="Search links"
                  className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#FFC000] md:max-w-md"
                />

                <div className="flex flex-wrap gap-2">
                  {["All", "Active", "Paused"].map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        filter === item
                          ? "bg-[#FFC000] text-black"
                          : "border border-black/10 text-black/55 hover:bg-[#FFC000]/10"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#fafafa] text-xs uppercase tracking-wider text-black/40">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Link details
                    </th>
                    <th className="px-6 py-4 font-semibold">Clicks</th>
                    <th className="px-6 py-4 font-semibold">Created</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/5">
                  {filteredLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-[#fafafa]">
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold">{link.title}</p>

                        <p className="mt-1 text-xs font-medium text-black/50">
                          {SHORT_DOMAIN}/{link.slug}
                        </p>

                        <p className="mt-1 max-w-xs truncate text-xs text-black/35">
                          {link.destination}
                        </p>
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
                            type="button"
                            onClick={() => copyLink(link)}
                            className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold hover:border-[#FFC000] hover:bg-[#FFC000]/15"
                          >
                            {copiedId === link.id ? "Copied!" : "Copy"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(link)}
                            className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold hover:bg-[#FFC000]/15"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleStatus(link.id)}
                            className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold hover:bg-[#FFC000]/15"
                          >
                            {link.status === "Active" ? "Pause" : "Activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteLink(link.id)}
                            className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold hover:border-[#FFC000] hover:bg-[#FFC000]/15"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredLinks.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-16 text-center text-sm text-black/40"
                      >
                        No links match your search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-black/10 px-6 py-4 text-xs text-black/40">
              Showing {filteredLinks.length} of {links.length} links
            </div>
          </section>

          <footer className="pb-5 text-center text-xs text-black/35">
            © 2026 NuruPy Links. All rights reserved.
          </footer>
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="link-modal-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 id="link-modal-title" className="text-xl font-bold">
                  {editingId !== null
                    ? "Edit your link"
                    : "Create a new link"}
                </h3>

                <p className="mt-1 text-sm text-black/45">
                  Set your link name, destination and custom alias.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-xl hover:bg-[#FFC000]"
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveLink} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="link-title"
                  className="mb-2 block text-sm font-semibold"
                >
                  Link name
                </label>

                <input
                  id="link-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. My Business Website"
                  className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                />
              </div>

              <div>
                <label
                  htmlFor="link-destination"
                  className="mb-2 block text-sm font-semibold"
                >
                  Destination URL
                </label>

                <input
                  id="link-destination"
                  required
                  type="text"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                />
              </div>

              <div>
                <label
                  htmlFor="link-alias"
                  className="mb-2 block text-sm font-semibold"
                >
                  Custom alias
                </label>

                <div className="flex overflow-hidden rounded-xl border border-black/10 focus-within:border-[#FFC000]">
                  <span className="flex items-center bg-[#fafafa] px-3 text-xs text-black/45 sm:px-4">
                    {SHORT_DOMAIN}/
                  </span>

                  <input
                    id="link-alias"
                    required
                    value={customSlug}
                    onChange={(event) =>
                      setCustomSlug(generateSlug(event.target.value))
                    }
                    placeholder="my-link"
                    className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-black/40">
                  Use letters, numbers and hyphens. Aliases must be unique.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold hover:bg-black/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#FFC000] px-4 py-3 text-sm font-bold hover:brightness-95"
                >
                  {editingId !== null ? "Save changes" : "Create link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
