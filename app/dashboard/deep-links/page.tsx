
"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type DeepLink = {
  id: string;
  title: string;
  slug: string;
  androidPackage: string;
  androidTarget: string;
  iosBundle: string;
  iosTarget: string;
  fallback: string;
  clicks: number;
  created: string;
  status: "Active" | "Paused";
};

const SHORT_DOMAIN = "nurupy.online";

const navigationLinks = [
  { label: "Overview", icon: "▦", href: "/dashboard" },
  { label: "My Links", icon: "↗", href: "/dashboard/links" },
  { label: "QR Codes", icon: "▧", href: "/dashboard/qr-codes" },
  { label: "Deep Linking", icon: "⌁", href: "/dashboard/deep-links" },
  { label: "Analytics", icon: "▥", href: "/dashboard/analytics" },
];

const emptyForm = {
  title: "",
  slug: "",
  androidPackage: "",
  androidTarget: "",
  iosBundle: "",
  iosTarget: "",
  fallback: "",
};

type DeepLinkForm = typeof emptyForm;

function normalizeUrl(value: string): string {
  const trimmed = value.trim();

  return /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
}

function isValidWebUrl(value: string): boolean {
  try {
    const url = new URL(normalizeUrl(value));

    return (
      ["http:", "https:"].includes(url.protocol) &&
      url.hostname.includes(".")
    );
  } catch {
    return false;
  }
}

function isValidAppScheme(value: string): boolean {
  try {
    const url = new URL(value.trim());

    return (
      /^[a-z][a-z0-9+.-]*$/i.test(url.protocol.replace(":", "")) &&
      !["javascript:", "data:", "file:", "http:", "https:"].includes(
        url.protocol
      )
    );
  } catch {
    return false;
  }
}

function isValidDestination(value: string): boolean {
  const trimmed = value.trim();

  // Empty Android/iOS destinations are allowed.
  if (!trimmed) return true;

  // Normal website URLs are allowed.
  if (/^https?:\/\//i.test(trimmed)) {
    return isValidWebUrl(trimmed);
  }

  // Custom app schemes such as myapp://home are allowed.
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return isValidAppScheme(trimmed);
  }

  // Website addresses without https:// are also allowed.
  return isValidWebUrl(trimmed);
}

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const dbError = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };

    return [
      dbError.message,
      dbError.details,
      dbError.hint,
      dbError.code ? `Code: ${dbError.code}` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return error instanceof Error
    ? error.message
    : "An unexpected error occurred.";
}

export default function DeepLinksPage() {
  const router = useRouter();

  const [deepLinks, setDeepLinks] = useState<DeepLink[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [form, setForm] = useState<DeepLinkForm>(emptyForm);

  const loadLinks = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const supabase = createClient();

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        router.replace("/login");
        return;
      }

      const user = authData.user;
      setUserId(user.id);

      const { data, error } = await supabase
        .from("deep_links")
        .select(
          "id,name,slug,android_package,android_url,ios_bundle_id,ios_url,fallback_url,is_active,created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped: DeepLink[] = (data ?? []).map((item) => ({
        id: item.id,
        title: item.name,
        slug: item.slug,
        androidPackage: item.android_package ?? "",
        androidTarget: item.android_url ?? "",
        iosBundle: item.ios_bundle_id ?? "",
        iosTarget: item.ios_url ?? "",
        fallback: item.fallback_url,
        clicks: 0,
        created: new Date(item.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: item.is_active ? "Active" : "Paused",
      }));

      setDeepLinks(mapped);
    } catch (error) {
      console.error("Loading deep links failed:", error);
      setPageError(
        `Could not load your deep links: ${getErrorMessage(error)}`
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadLinks();
  }, [loadLinks]);

  const filteredLinks = useMemo(() => {
    const term = search.toLowerCase().trim();

    return deepLinks.filter((link) => {
      const matchesSearch =
        link.title.toLowerCase().includes(term) ||
        link.slug.toLowerCase().includes(term) ||
        link.fallback.toLowerCase().includes(term);

      const matchesFilter =
        filter === "All" || link.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [deepLinks, search, filter]);

  const activeCount = deepLinks.filter(
    (link) => link.status === "Active"
  ).length;

  function updateForm(field: keyof DeepLinkForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(link: DeepLink) {
    setEditingId(link.id);

    setForm({
      title: link.title,
      slug: link.slug,
      androidPackage: link.androidPackage,
      androidTarget: link.androidTarget,
      iosBundle: link.iosBundle,
      iosTarget: link.iosTarget,
      fallback: link.fallback,
    });

    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  async function saveDeepLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving || !userId) return;

    const slug = generateSlug(form.slug);
    const title = form.title.trim();

    const androidPackage = form.androidPackage.trim();
    const androidTarget = form.androidTarget.trim();

    const iosBundle = form.iosBundle.trim();
    const iosTarget = form.iosTarget.trim();

    if (!title || !slug) {
      setFormError("Please provide a name and a valid alias.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setFormError("Use letters, numbers and hyphens for your alias.");
      return;
    }

    // Android package name is optional.
    if (
      androidPackage &&
      !/^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+$/.test(androidPackage)
    ) {
      setFormError("Enter a valid Android package name.");
      return;
    }

    // iOS bundle identifier is optional.
    if (
      iosBundle &&
      !/^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+$/.test(iosBundle)
    ) {
      setFormError("Enter a valid iOS bundle identifier.");
      return;
    }

    // Android and iOS destinations can be websites or app links.
    if (
      !isValidDestination(androidTarget) ||
      !isValidDestination(iosTarget)
    ) {
      setFormError(
        "Enter a valid website URL or app destination in the Android and iOS sections."
      );
      return;
    }

    if (!form.fallback.trim() || !isValidWebUrl(form.fallback)) {
      setFormError("Please enter a valid website fallback URL.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const supabase = createClient();

      // Check whether another deep link already uses this alias.
      const { data: existingDeep, error: deepCheckError } =
        await supabase
          .from("deep_links")
          .select("id")
          .eq("user_id", userId)
          .eq("slug", slug)
          .maybeSingle();

      if (deepCheckError) throw deepCheckError;

      if (existingDeep && existingDeep.id !== editingId) {
        throw new Error(
          "This alias is already used by another deep link."
        );
      }

      // Check this account's short links too.
      const { data: existingShort, error: shortCheckError } =
        await supabase
          .from("links")
          .select("id")
          .eq("user_id", userId)
          .eq("slug", slug)
          .maybeSingle();

      if (shortCheckError) throw shortCheckError;

      if (existingShort) {
        throw new Error(
          "This alias is already used by one of your short links."
        );
      }

      const payload = {
        name: title,
        slug,
        android_package: androidPackage || null,
        android_url: androidTarget
          ? normalizeUrl(androidTarget.startsWith("http") ? androidTarget : androidTarget)
          : null,
        ios_bundle_id: iosBundle || null,
        ios_url: iosTarget
          ? normalizeUrl(iosTarget.startsWith("http") ? iosTarget : iosTarget)
          : null,
        fallback_url: normalizeUrl(form.fallback),
      };

      if (editingId) {
        const { error } = await supabase
          .from("deep_links")
          .update(payload)
          .eq("id", editingId)
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("deep_links")
          .insert({
            ...payload,
            user_id: userId,
            is_active: true,
          });

        if (error) throw error;
      }

      setModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadLinks();
    } catch (error) {
      console.error("Saving deep link failed:", error);
      setFormError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function copyDeepLink(link: DeepLink) {
    const url = `https://${SHORT_DOMAIN}/${link.slug}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(link.id);

      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      alert("Copy failed. Please copy the link manually.");
    }
  }

  async function toggleStatus(link: DeepLink) {
    if (!userId) return;

    const supabase = createClient();
    const newStatus = link.status !== "Active";

    try {
      const { error } = await supabase
        .from("deep_links")
        .update({ is_active: newStatus })
        .eq("id", link.id)
        .eq("user_id", userId);

      if (error) throw error;

      setDeepLinks((current) =>
        current.map((item) =>
          item.id === link.id
            ? {
                ...item,
                status: newStatus ? "Active" : "Paused",
              }
            : item
        )
      );
    } catch (error) {
      console.error("Updating deep link status failed:", error);
      alert(`Could not update link: ${getErrorMessage(error)}`);
    }
  }

  async function deleteDeepLink(link: DeepLink) {
    if (!userId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${link.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("deep_links")
        .delete()
        .eq("id", link.id)
        .eq("user_id", userId);

      if (error) throw error;

      setDeepLinks((current) =>
        current.filter((item) => item.id !== link.id)
      );
    } catch (error) {
      console.error("Deleting deep link failed:", error);
      alert(`Could not delete link: ${getErrorMessage(error)}`);
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#111111]">
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
              const isActive = item.href === "/dashboard/deep-links";

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
                      {deepLinks.length}
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
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-black/55 hover:bg-[#FFC000]/10 hover:text-black"
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

      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        <header className="sticky top-0 z-20 hidden h-20 items-center justify-between border-b border-black/10 bg-white/95 px-8 backdrop-blur lg:flex">
          <div>
            <p className="text-sm text-black/45">
              Workspace / Deep Linking
            </p>
            <h1 className="mt-1 text-xl font-bold">Deep Linking</h1>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-full bg-[#FFC000] px-5 py-3 text-sm font-bold hover:brightness-95"
          >
            + Create deep link
          </button>
        </header>

        <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-black/45">
                Mobile app connections
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Manage your deep links
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-black/45">
                Create smart links that direct visitors to Android, iOS,
                or any website destination.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-xl bg-[#FFC000] px-5 py-3 text-sm font-bold hover:brightness-95 lg:hidden"
            >
              + Create deep link
            </button>
          </section>

          {pageError && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {pageError}

              <button
                type="button"
                onClick={loadLinks}
                className="ml-3 font-bold underline"
              >
                Retry
              </button>
            </div>
          )}

          <section className="grid gap-4 md:grid-cols-3">
            {[
              [
                "Android",
                "Android destination",
                "Use an app link or any website URL.",
                "🤖",
              ],
              [
                "iOS",
                "iPhone and iPad destination",
                "Use an app link or any website URL.",
                "",
              ],
              [
                "Web fallback",
                "Browser destination",
                "Send visitors to a website when needed.",
                "🌐",
              ],
            ].map(([title, subtitle, description, icon]) => (
              <div
                key={title}
                className="rounded-2xl border border-black/10 bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFC000]/20 text-xl">
                    {icon}
                  </div>

                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="text-xs text-black/45">{subtitle}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-black/50">
                  {description}
                </p>
              </div>
            ))}
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Total deep links",
                value: loading ? "…" : deepLinks.length,
              },
              {
                label: "Active deep links",
                value: loading ? "…" : activeCount,
              },
              {
                label: "Total clicks",
                value: loading ? "…" : "0",
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

          <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="space-y-5 border-b border-black/10 p-5 sm:p-6">
              <div>
                <h3 className="text-lg font-bold">Your deep links</h3>

                <p className="mt-1 text-sm text-black/45">
                  Manage your Android, iOS and website destinations.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search deep links..."
                  aria-label="Search deep links"
                  className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#FFC000] md:max-w-md"
                />

                <div className="flex flex-wrap gap-2">
                  {["All", "Active", "Paused"].map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
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
                    <th className="px-6 py-4 font-semibold">Deep link</th>
                    <th className="px-6 py-4 font-semibold">Clicks</th>
                    <th className="px-6 py-4 font-semibold">Created</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/5">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-16 text-center text-sm text-black/40"
                      >
                        Loading your deep links...
                      </td>
                    </tr>
                  ) : (
                    filteredLinks.map((link) => (
                      <tr key={link.id} className="hover:bg-[#fafafa]">
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold">{link.title}</p>

                          <p className="mt-1 text-xs font-medium text-black/50">
                            {SHORT_DOMAIN}/{link.slug}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {link.androidTarget && (
                              <span className="rounded-md bg-[#FFC000]/20 px-2 py-1 text-[10px] font-semibold">
                                Android
                              </span>
                            )}

                            {link.iosTarget && (
                              <span className="rounded-md bg-[#FFC000]/20 px-2 py-1 text-[10px] font-semibold">
                                iOS
                              </span>
                            )}

                            <span className="rounded-md bg-black/5 px-2 py-1 text-[10px] font-semibold text-black/60">
                              Web fallback
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm font-semibold">
                          0
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
                              onClick={() => copyDeepLink(link)}
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
                              onClick={() => toggleStatus(link)}
                              className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold hover:bg-[#FFC000]/15"
                            >
                              {link.status === "Active" ? "Pause" : "Activate"}
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteDeepLink(link)}
                              className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold hover:border-[#FFC000] hover:bg-[#FFC000]/15"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}

                  {!loading && filteredLinks.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-16 text-center text-sm text-black/40"
                      >
                        {deepLinks.length === 0
                          ? "You haven't created any deep links yet."
                          : "No deep links match your search or filter."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-black/10 px-6 py-4 text-xs text-black/40">
              Showing {filteredLinks.length} of {deepLinks.length} deep links
            </div>
          </section>

          <section className="rounded-2xl border border-black/10 bg-[#fafafa] p-5 sm:p-7">
            <h3 className="text-lg font-bold">How deep linking works</h3>

            <p className="mt-2 text-sm leading-6 text-black/50">
              A visitor opens your NuruPy link. The system selects the
              appropriate destination. The destination can be a website or
              an app link. Actual app opening also requires the mobile app
              to support the configured links.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["01", "Visitor clicks", "Someone opens your shared deep link."],
                ["02", "Destination is selected", "The appropriate destination is chosen."],
                ["03", "Destination opens", "The app or website destination opens."],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="rounded-xl border border-black/10 bg-white p-4"
                >
                  <p className="text-sm font-bold text-[#B88B00]">
                    {number}
                  </p>

                  <h4 className="mt-2 text-sm font-bold">{title}</h4>

                  <p className="mt-1 text-xs leading-5 text-black/45">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <footer className="pb-5 text-center text-xs text-black/35">
            © 2026 NuruPy Links. All rights reserved.
          </footer>
        </div>
      </main>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="deep-link-modal-title"
            className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  id="deep-link-modal-title"
                  className="text-xl font-bold"
                >
                  {editingId ? "Edit deep link" : "Create a deep link"}
                </h3>

                <p className="mt-1 text-sm text-black/45">
                  Configure your Android, iOS and website destinations.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-xl hover:bg-[#FFC000]"
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveDeepLink} className="mt-7 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold">Basic information</h4>

                <div>
                  <label
                    htmlFor="deep-title"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Deep link name
                  </label>

                  <input
                    id="deep-title"
                    required
                    value={form.title}
                    onChange={(event) =>
                      updateForm("title", event.target.value)
                    }
                    placeholder="e.g. My Shopping App"
                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="deep-slug"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Custom alias
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-black/10 focus-within:border-[#FFC000]">
                    <span className="flex items-center bg-[#fafafa] px-3 text-xs text-black/45 sm:px-4">
                      {SHORT_DOMAIN}/
                    </span>

                    <input
                      id="deep-slug"
                      required
                      value={form.slug}
                      onChange={(event) =>
                        updateForm("slug", generateSlug(event.target.value))
                      }
                      placeholder="my-app"
                      className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
                    />
                  </div>

                  <p className="mt-2 text-xs text-black/40">
                    Use letters, numbers and hyphens. Aliases must be unique.
                  </p>
                </div>
              </div>

              <div className="border-t border-black/10" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFC000]/20">
                    🤖
                  </span>

                  <div>
                    <h4 className="text-sm font-bold">
                      Android configuration (optional)
                    </h4>

                    <p className="text-xs text-black/40">
                      Leave empty if you do not have an Android destination.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="android-package"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Android package name (optional)
                  </label>

                  <input
                    id="android-package"
                    value={form.androidPackage}
                    onChange={(event) =>
                      updateForm("androidPackage", event.target.value)
                    }
                    placeholder="com.example.myapp"
                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="android-target"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Android destination URL (optional)
                  </label>

                  <input
                    id="android-target"
                    type="text"
                    value={form.androidTarget}
                    onChange={(event) =>
                      updateForm("androidTarget", event.target.value)
                    }
                    placeholder="https://example.com or myapp://home"
                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                  />

                  <p className="mt-2 text-xs text-black/40">
                    Website URLs, app links and custom app schemes are accepted.
                  </p>
                </div>
              </div>

              <div className="border-t border-black/10" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFC000]/20 text-lg">
                    
                  </span>

                  <div>
                    <h4 className="text-sm font-bold">
                      iOS configuration (optional)
                    </h4>

                    <p className="text-xs text-black/40">
                      Leave empty if you do not have an iOS destination.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="ios-bundle"
                    className="mb-2 block text-sm font-semibold"
                  >
                    iOS bundle identifier (optional)
                  </label>

                  <input
                    id="ios-bundle"
                    value={form.iosBundle}
                    onChange={(event) =>
                      updateForm("iosBundle", event.target.value)
                    }
                    placeholder="com.example.myapp"
                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ios-target"
                    className="mb-2 block text-sm font-semibold"
                  >
                    iOS destination URL (optional)
                  </label>

                  <input
                    id="ios-target"
                    type="text"
                    value={form.iosTarget}
                    onChange={(event) =>
                      updateForm("iosTarget", event.target.value)
                    }
                    placeholder="https://example.com or myapp://home"
                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                  />

                  <p className="mt-2 text-xs text-black/40">
                    Website URLs, app links and custom app schemes are accepted.
                  </p>
                </div>
              </div>

              <div className="border-t border-black/10" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFC000]/20 text-lg">
                    🌐
                  </span>

                  <div>
                    <h4 className="text-sm font-bold">Website fallback</h4>

                    <p className="text-xs text-black/40">
                      Required destination for visitors.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="deep-fallback"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Fallback website URL
                  </label>

                  <input
                    id="deep-fallback"
                    type="text"
                    required
                    value={form.fallback}
                    onChange={(event) =>
                      updateForm("fallback", event.target.value)
                    }
                    placeholder="https://example.com"
                    className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-[#FFC000]/40 bg-[#FFC000]/10 p-4">
                <p className="text-xs leading-5 text-black/65">
                  <strong>Important:</strong> Android and iOS settings are
                  optional. You can enter website URLs or app destinations
                  in either section. Actual app opening still requires
                  appropriate mobile app and operating-system configuration.
                </p>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700"
                >
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold hover:bg-black/5 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#FFC000] px-4 py-3 text-sm font-bold hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Create deep link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
