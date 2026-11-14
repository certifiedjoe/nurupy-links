
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

const analyticsData = {
  "7 days": {
    clicks: "8,420",
    visitors: "5,612",
    countries: "18",
    links: "42",
    change: "+12.8%",
    chart: [35, 55, 42, 75, 60, 88, 70],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  "30 days": {
    clicks: "32,850",
    visitors: "21,460",
    countries: "34",
    links: "42",
    change: "+18.4%",
    chart: [45, 60, 38, 72, 55, 85, 68, 95, 62, 78, 48, 88],
    labels: ["1", "3", "6", "9", "12", "15", "18", "21", "24", "27", "29", "30"],
  },
  "90 days": {
    clicks: "96,280",
    visitors: "68,430",
    countries: "51",
    links: "42",
    change: "+24.6%",
    chart: [30, 45, 60, 42, 70, 55, 80, 65, 92, 72, 85, 100],
    labels: ["1", "8", "15", "22", "29", "36", "43", "50", "57", "64", "71", "90"],
  },
};

const topLinks = [
  {
    title: "Main Website",
    url: "nurupy.link/website",
    clicks: "12,450",
    unique: "8,210",
    change: "+18.2%",
  },
  {
    title: "Product Campaign",
    url: "nurupy.link/product",
    clicks: "8,320",
    unique: "5,640",
    change: "+12.5%",
  },
  {
    title: "Instagram Bio",
    url: "nurupy.link/instagram",
    clicks: "5,180",
    unique: "3,920",
    change: "+9.4%",
  },
  {
    title: "WhatsApp Promotion",
    url: "nurupy.link/whatsapp",
    clicks: "3,740",
    unique: "2,610",
    change: "+6.8%",
  },
];

const locations = [
  { country: "Tanzania", clicks: "4,820", percentage: 82 },
  { country: "Kenya", clicks: "1,240", percentage: 56 },
  { country: "United States", clicks: "920", percentage: 42 },
  { country: "Uganda", clicks: "680", percentage: 30 },
  { country: "United Kingdom", clicks: "420", percentage: 19 },
];

const devices = [
  { name: "Mobile", percentage: 68, clicks: "5,726" },
  { name: "Desktop", percentage: 24, clicks: "2,021" },
  { name: "Tablet", percentage: 8, clicks: "673" },
];

const sources = [
  { name: "Direct", percentage: 42, clicks: "3,536" },
  { name: "Instagram", percentage: 28, clicks: "2,358" },
  { name: "WhatsApp", percentage: 18, clicks: "1,516" },
  { name: "Facebook", percentage: 12, clicks: "1,010" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<keyof typeof analyticsData>("30 days");

  const data = analyticsData[period];

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
          {navigationLinks.map((item) => {
            const active = item.href === "/dashboard/analytics";

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-[#FFC000] text-black"
                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl bg-[#111111] p-5 text-white">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFC000] text-lg text-black">
            ✦
          </div>

          <p className="text-sm font-bold">Understand your audience</p>

          <p className="mt-2 text-xs leading-5 text-gray-400">
            Use your analytics to understand how people interact with your links.
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-h-screen lg:ml-[250px]">

        {/* HEADER */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 md:px-9">

          <div>
            <h1 className="text-lg font-black">Analytics</h1>
            <p className="text-xs text-gray-500">
              Understand your link performance
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

          {/* PAGE INTRO */}
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#B78A00]">
                PERFORMANCE CENTER
              </p>

              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                Your links. Your <span className="text-[#C99700]">insights.</span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                Track clicks, understand your audience, and discover which links
                bring the most engagement.
              </p>
            </div>

            {/* DATE FILTER */}
            <div className="flex gap-2">
              {(["7 days", "30 days", "90 days"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={`rounded-xl px-4 py-3 text-xs font-bold transition ${
                    period === item
                      ? "bg-[#FFC000] text-black"
                      : "border border-gray-200 text-gray-500 hover:border-[#FFC000]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

          </div>

          {/* STATISTICS */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {[
              {
                label: "Total clicks",
                value: data.clicks,
                icon: "↗",
                description: "All link interactions",
              },
              {
                label: "Unique visitors",
                value: data.visitors,
                icon: "◉",
                description: "Estimated individual visitors",
              },
              {
                label: "Countries reached",
                value: data.countries,
                icon: "◎",
                description: "Visitor locations",
              },
              {
                label: "Active links",
                value: data.links,
                icon: "⌁",
                description: "Links in your workspace",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500">
                    {stat.label}
                  </p>

                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF5CC] text-lg font-bold text-[#111111]">
                    {stat.icon}
                  </span>
                </div>

                <h3 className="mt-5 text-3xl font-black tabular-nums">
                  {stat.value}
                </h3>

                <p className="mt-2 text-[11px] text-gray-400">
                  {stat.description}
                </p>
              </div>
            ))}

          </div>

          {/* CLICK CHART */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 md:p-7">

            <div className="flex flex-wrap items-start justify-between gap-4">

              <div>
                <h3 className="text-lg font-black">Click performance</h3>

                <p className="mt-1 text-xs text-gray-500">
                  Link engagement during the selected period
                </p>
              </div>

              <div className="rounded-lg bg-[#FFF5CC] px-3 py-2 text-xs font-bold text-[#765800]">
                {data.change} growth
              </div>

            </div>

            <div className="mt-8 flex h-[220px] items-end gap-3 border-b border-gray-200 px-2">

              {data.chart.map((value, index) => (
                <div
                  key={`${period}-${index}`}
                  className="group flex h-full flex-1 flex-col justify-end"
                >
                  <div className="relative flex flex-1 items-end">

                    <div
                      className="w-full rounded-t-md bg-[#FFC000] transition-all duration-300 group-hover:bg-[#D9A300]"
                      style={{ height: `${value}%` }}
                      title={`${value}% relative activity`}
                    />

                  </div>
                </div>
              ))}

            </div>

            <div className="mt-3 flex justify-between gap-2 text-[10px] text-gray-400">
              {data.labels.map((label, index) => (
                <span key={`${label}-${index}`}>{label}</span>
              ))}
            </div>

            <p className="mt-5 text-[10px] text-gray-400">
              Sample demonstration data. Actual click counts will be connected
              to the analytics backend later.
            </p>

          </section>

          {/* TOP LINKS */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 md:p-7">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black">Top-performing links</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Links with the highest sample click counts
                </p>
              </div>

              <Link
                href="/dashboard/links"
                className="text-xs font-bold text-[#9B7400] hover:underline"
              >
                Manage links →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">

                <thead>
                  <tr className="border-b border-gray-200 text-[10px] uppercase tracking-wider text-gray-400">
                    <th className="pb-4">Link name</th>
                    <th className="pb-4">Total clicks</th>
                    <th className="pb-4">Unique visitors</th>
                    <th className="pb-4">Growth</th>
                  </tr>
                </thead>

                <tbody>
                  {topLinks.map((link) => (
                    <tr
                      key={link.title}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="py-5">
                        <p className="text-sm font-bold">{link.title}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {link.url}
                        </p>
                      </td>

                      <td className="py-5 text-sm font-bold">
                        {link.clicks}
                      </td>

                      <td className="py-5 text-sm text-gray-600">
                        {link.unique}
                      </td>

                      <td className="py-5 text-xs font-bold text-[#9B7400]">
                        {link.change}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </section>

          {/* LOCATION AND DEVICE ANALYTICS */}
          <div className="mt-7 grid gap-7 xl:grid-cols-2">

            {/* LOCATIONS */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-7">

              <h3 className="text-lg font-black">Visitor locations</h3>
              <p className="mt-1 text-xs text-gray-500">
                Where your audience is coming from
              </p>

              <div className="mt-7 space-y-6">
                {locations.map((location) => (
                  <div key={location.country}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="font-semibold">{location.country}</span>
                      <span className="text-gray-500">
                        {location.clicks} clicks
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#FFC000]"
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </section>

            {/* DEVICES */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-7">

              <h3 className="text-lg font-black">Devices</h3>
              <p className="mt-1 text-xs text-gray-500">
                Devices used to access your links
              </p>

              <div className="mt-7 space-y-6">
                {devices.map((device) => (
                  <div key={device.name}>

                    <div className="mb-2 flex justify-between text-xs">
                      <span className="font-semibold">{device.name}</span>
                      <span className="text-gray-500">
                        {device.percentage}% · {device.clicks}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#FFC000]"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>

                  </div>
                ))}
              </div>

            </section>

          </div>

          {/* TRAFFIC SOURCES */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 md:p-7">

            <h3 className="text-lg font-black">Traffic sources</h3>

            <p className="mt-1 text-xs text-gray-500">
              Understand where visitors discover your links
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {sources.map((source) => (
                <div
                  key={source.name}
                  className="rounded-xl bg-gray-50 p-5"
                >
                  <p className="text-xs font-semibold text-gray-500">
                    {source.name}
                  </p>

                  <h4 className="mt-3 text-2xl font-black">
                    {source.percentage}%
                  </h4>

                  <p className="mt-1 text-xs text-gray-400">
                    {source.clicks} clicks
                  </p>

                </div>
              ))}

            </div>

          </section>

          {/* NOTE */}
          <div className="mt-8 rounded-2xl bg-[#111111] p-6 text-white md:p-8">

            <p className="text-xs font-bold uppercase tracking-[2px] text-[#FFC000]">
              Analytics engine
            </p>

            <h3 className="mt-3 text-xl font-black">
              Turn clicks into decisions.
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
              This dashboard currently uses demonstration data. In the backend
              stage, we will record real clicks, identify visitor sessions,
              and calculate traffic sources, devices and locations.
            </p>

          </div>

          <footer className="mt-10 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
            © 2026 NuruPy Links. All rights reserved.
          </footer>

        </div>
      </main>
    </div>
  );
}
