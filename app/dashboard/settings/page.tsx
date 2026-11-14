
"use client";

import { useState } from "react";
import Link from "next/link";

const navigationLinks = [
  { label: "Overview", icon: "▦", href: "/dashboard" },
  { label: "My Links", icon: "↗", href: "/dashboard/links" },
  { label: "QR Codes", icon: "▧", href: "/dashboard/qr-codes" },
  { label: "Deep Linking", icon: "⌁", href: "/dashboard/deep-links" },
  { label: "Analytics", icon: "▥", href: "/dashboard/analytics" },
];

const settingsTabs = [
  { id: "profile", label: "Profile", icon: "◉" },
  { id: "security", label: "Security", icon: "⌑" },
  { id: "notifications", label: "Notifications", icon: "♧" },
  { id: "api", label: "API Preferences", icon: "⌘" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const [fullName, setFullName] = useState("Your Name");
  const [email, setEmail] = useState("you@example.com");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityNotifications, setSecurityNotifications] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const [apiNotifications, setApiNotifications] = useState(true);
  const [apiAccess, setApiAccess] = useState(false);

  const [message, setMessage] = useState("");

  function saveSettings() {
    if (!fullName.trim() || !email.trim()) {
      setMessage("Please enter your name and email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setMessage(
      "Settings updated in this preview. Database saving will be connected later."
    );
  }

  function handlePasswordChange() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Your new password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("The new passwords do not match.");
      return;
    }

    setMessage(
      "Password form validated. Actual password changes will be connected to authentication later."
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  function toggleRow(
    title: string,
    description: string,
    enabled: boolean,
    setter: (value: boolean) => void
  ) {
    return (
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-5 last:border-0">
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            {description}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => setter(!enabled)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
            enabled ? "bg-[#FFC000]" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
              enabled ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111111]">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[250px] flex-col border-r border-gray-200 bg-white px-6 py-7 lg:flex">

        <Link href="/" className="mb-12 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC000] text-xl font-black">
            N
          </div>

          <span className="text-xl font-black tracking-tight">
            NuruPy<span className="text-[#FFC000]">.</span>
          </span>
        </Link>

        <p className="mb-4 text-[10px] font-bold uppercase tracking-[2px] text-gray-400">
          Workspace
        </p>

        <nav className="space-y-2">
          {navigationLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-black"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-[#111111] p-5 text-white">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFC000] text-lg text-black">
            ✦
          </div>

          <p className="text-sm font-bold">Account settings</p>

          <p className="mt-2 text-xs leading-5 text-gray-400">
            Manage your profile, security and preferences.
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-h-screen lg:ml-[250px]">

        {/* HEADER */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 md:px-9">
          <div>
            <h1 className="text-lg font-black">Settings</h1>
            <p className="text-xs text-gray-500">
              Manage your account and preferences
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold transition hover:bg-gray-100"
          >
            Back to dashboard
          </Link>
        </header>

        <div className="p-5 md:p-9">

          {/* INTRO */}
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#B78A00]">
              ACCOUNT MANAGEMENT
            </p>

            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Your account. Your <span className="text-[#C99700]">control.</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
              Update your personal information, protect your account and
              customize how NuruPy Links works for you.
            </p>
          </div>

          {/* MESSAGE */}
          {message && (
            <div className="mb-6 rounded-xl border border-[#FFC000] bg-[#FFF9E6] px-4 py-3 text-sm text-[#765800]">
              {message}
              <button
                onClick={() => setMessage("")}
                className="ml-3 font-bold underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid gap-7 xl:grid-cols-[240px_1fr]">

            {/* SETTINGS MENU */}
            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-3">

              <p className="px-3 py-3 text-[10px] font-bold uppercase tracking-[2px] text-gray-400">
                Settings menu
              </p>

              <nav className="space-y-1">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMessage("");
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                      activeTab === tab.id
                        ? "bg-[#FFC000] text-black"
                        : "text-gray-500 hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="my-4 border-t border-gray-100" />

              <p className="px-3 text-[10px] font-bold uppercase tracking-[2px] text-gray-400">
                Account
              </p>

              <button
                onClick={() => {
                  setActiveTab("danger");
                  setMessage("");
                }}
                className={`mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeTab === "danger"
                    ? "bg-red-50 text-red-600"
                    : "text-gray-500 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                <span>⚠</span>
                Danger zone
              </button>

            </aside>

            {/* SETTINGS CONTENT */}
            <section className="min-w-0">

              {/* PROFILE */}
              {activeTab === "profile" && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-8">

                  <div className="mb-7 border-b border-gray-100 pb-5">
                    <h3 className="text-lg font-black">Profile information</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Update the information associated with your account.
                    </p>
                  </div>

                  <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFC000] text-2xl font-black">
                      {fullName.trim().charAt(0).toUpperCase() || "N"}
                    </div>

                    <div>
                      <p className="font-bold">{fullName || "Your Name"}</p>
                      <p className="mt-1 text-xs text-gray-500">{email}</p>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#987000]">
                        NuruPy account
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-xs font-bold">
                        FULL NAME
                      </label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold">
                        COMPANY / ORGANIZATION
                      </label>
                      <input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Your company name"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold">
                        WEBSITE
                      </label>
                      <input
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-xs font-bold">
                        BIO
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        maxLength={300}
                        placeholder="Tell us a little about yourself or your organization."
                        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                      />
                      <p className="mt-1 text-right text-[10px] text-gray-400">
                        {bio.length}/300 characters
                      </p>
                    </div>

                  </div>

                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <button
                      onClick={saveSettings}
                      className="rounded-xl bg-[#FFC000] px-6 py-3 text-sm font-black text-black transition hover:bg-[#EAB000]"
                    >
                      Save profile
                    </button>
                  </div>

                </div>
              )}

              {/* SECURITY */}
              {activeTab === "security" && (
                <div className="space-y-6">

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-8">

                    <div className="mb-7 border-b border-gray-100 pb-5">
                      <h3 className="text-lg font-black">Change password</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Use a strong password to protect your account.
                      </p>
                    </div>

                    <div className="max-w-xl space-y-5">

                      {[
                        {
                          label: "CURRENT PASSWORD",
                          value: currentPassword,
                          setter: setCurrentPassword,
                        },
                        {
                          label: "NEW PASSWORD",
                          value: newPassword,
                          setter: setNewPassword,
                        },
                        {
                          label: "CONFIRM NEW PASSWORD",
                          value: confirmPassword,
                          setter: setConfirmPassword,
                        },
                      ].map((field) => (
                        <div key={field.label}>
                          <label className="mb-2 block text-xs font-bold">
                            {field.label}
                          </label>
                          <input
                            type="password"
                            value={field.value}
                            onChange={(e) => field.setter(e.target.value)}
                            placeholder="Enter password"
                            autoComplete="off"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#FFC000]"
                          />
                        </div>
                      ))}

                      <p className="text-xs text-gray-400">
                        Your new password must contain at least 8 characters.
                      </p>

                      <button
                        onClick={handlePasswordChange}
                        className="rounded-xl bg-[#FFC000] px-6 py-3 text-sm font-black text-black"
                      >
                        Update password
                      </button>

                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-8">
                    <h3 className="text-lg font-black">Account protection</h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Additional security options, two-factor authentication
                      and active session management will be available when
                      authentication is connected.
                    </p>

                    <div className="mt-5 rounded-xl bg-gray-50 p-4">
                      <p className="text-sm font-bold">Two-factor authentication</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Not configured in this preview.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-8">

                  <div className="mb-5 border-b border-gray-100 pb-5">
                    <h3 className="text-lg font-black">Notification preferences</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Choose which updates you want to receive.
                    </p>
                  </div>

                  {toggleRow(
                    "Email notifications",
                    "Receive important account information by email.",
                    emailNotifications,
                    setEmailNotifications
                  )}

                  {toggleRow(
                    "Security alerts",
                    "Get notified about important account security events.",
                    securityNotifications,
                    setSecurityNotifications
                  )}

                  {toggleRow(
                    "Product updates",
                    "Hear about new features and improvements.",
                    productUpdates,
                    setProductUpdates
                  )}

                  {toggleRow(
                    "Weekly analytics reports",
                    "Receive a summary of your link performance.",
                    weeklyReports,
                    setWeeklyReports
                  )}

                  <button
                    onClick={() =>
                      setMessage(
                        "Notification preferences updated in this preview. They will be saved to the database later."
                      )
                    }
                    className="mt-7 rounded-xl bg-[#FFC000] px-6 py-3 text-sm font-black text-black"
                  >
                    Save preferences
                  </button>

                </div>
              )}

              {/* API PREFERENCES */}
              {activeTab === "api" && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-8">

                  <div className="mb-7 border-b border-gray-100 pb-5">
                    <h3 className="text-lg font-black">API preferences</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Manage how your account interacts with the NuruPy API.
                    </p>
                  </div>

                  {toggleRow(
                    "API notifications",
                    "Receive notifications about API usage and important events.",
                    apiNotifications,
                    setApiNotifications
                  )}

                  {toggleRow(
                    "Enable API access",
                    "Indicate whether you want to use developer API features.",
                    apiAccess,
                    setApiAccess
                  )}

                  <div className="mt-7 rounded-xl bg-gray-50 p-5">
                    <p className="text-sm font-bold">Developer resources</p>

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      API documentation, API key generation, usage limits and
                      access permissions will be connected in the developer
                      dashboard.
                    </p>

                    <Link
                      href="/dashboard"
                      className="mt-4 inline-block text-xs font-bold text-[#987000] hover:underline"
                    >
                      Return to dashboard →
                    </Link>
                  </div>

                  <button
                    onClick={() =>
                      setMessage(
                        "API preferences updated in this preview. Database saving will be connected later."
                      )
                    }
                    className="mt-7 rounded-xl bg-[#FFC000] px-6 py-3 text-sm font-black text-black"
                  >
                    Save API preferences
                  </button>

                </div>
              )}

              {/* DANGER ZONE */}
              {activeTab === "danger" && (
                <div className="rounded-2xl border border-red-200 bg-white p-5 md:p-8">

                  <div className="mb-7 border-b border-gray-100 pb-5">
                    <h3 className="text-lg font-black text-red-600">
                      Danger zone
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      These actions can permanently affect your account.
                    </p>
                  </div>

                  <div className="rounded-xl border border-red-100 bg-red-50 p-5">
                    <h4 className="font-bold text-red-700">
                      Delete your account
                    </h4>

                    <p className="mt-2 text-xs leading-6 text-red-600">
                      Account deletion may permanently remove your profile,
                      short links, QR codes, analytics and other associated
                      information. This action cannot be easily reversed.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setMessage(
                          "Account deletion is not enabled in this preview. We will implement a secure confirmation process in the backend."
                        )
                      }
                      className="mt-5 rounded-xl border border-red-300 px-5 py-3 text-xs font-bold text-red-600 transition hover:bg-red-100"
                    >
                      Request account deletion
                    </button>
                  </div>

                </div>
              )}

            </section>
          </div>

          <footer className="mt-10 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
            © 2026 NuruPy Links. All rights reserved.
          </footer>

        </div>
      </main>
    </div>
  );
}
