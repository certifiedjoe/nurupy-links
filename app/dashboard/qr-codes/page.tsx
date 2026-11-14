
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

const navigationLinks = [
  { label: "Overview", icon: "▦", href: "/dashboard" },
  { label: "My Links", icon: "↗", href: "/dashboard/links" },
  { label: "QR Codes", icon: "▧", href: "/dashboard/qr-codes" },
  { label: "Deep Linking", icon: "⌁", href: "/dashboard/deep-links" },
  { label: "Analytics", icon: "▥", href: "/dashboard/analytics" },
];

const initialCodes = [
  {
    id: 1,
    name: "Website QR Code",
    url: "https://example.com",
    created: "Recently",
  },
  {
    id: 2,
    name: "Product Campaign",
    url: "https://example.com/product",
    created: "Recently",
  },
];

export default function QRCodesPage() {
  const [url, setUrl] = useState("https://example.com");
  const [name, setName] = useState("My QR Code");
  const [size, setSize] = useState(220);
  const [foreground, setForeground] = useState("#111111");
  const [background, setBackground] = useState("#FFFFFF");
  const [includeMargin, setIncludeMargin] = useState(true);
  const [logo, setLogo] = useState<string | null>(null);
  const [codes, setCodes] = useState(initialCodes);
  const [activeTab, setActiveTab] = useState("generator");
  const [message, setMessage] = useState("");

  const qrContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const validUrl = (() => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  })();

  function handleLogoUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("Please choose an image smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setLogo(reader.result as string);
      setMessage("");
    };

    reader.readAsDataURL(file);
  }

  function saveQRCode() {
    if (!validUrl) {
      setMessage("Please enter a valid website URL.");
      return;
    }

    const newCode = {
      id: Date.now(),
      name: name.trim() || "Untitled QR Code",
      url,
      created: "Just now",
    };

    setCodes((previous) => [newCode, ...previous]);
    setMessage("QR code added to your recent list.");
  }

  function downloadPNG() {
    if (!validUrl || !canvasRef.current) {
      setMessage("Please enter a valid URL first.");
      return;
    }

    const originalCanvas = canvasRef.current;
    const outputCanvas = document.createElement("canvas");
    const context = outputCanvas.getContext("2d");

    if (!context) return;

    const padding = includeMargin ? 0 : 0;
    outputCanvas.width = originalCanvas.width + padding * 2;
    outputCanvas.height = originalCanvas.height + padding * 2;

    context.fillStyle = background;
    context.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
    context.drawImage(originalCanvas, padding, padding);

    const finishDownload = () => {
      const link = document.createElement("a");
      link.download = `${name.trim() || "nurupy-qr-code"}.png`;
      link.href = outputCanvas.toDataURL("image/png");
      link.click();
      setMessage("PNG QR code downloaded.");
    };

    if (logo) {
      const image = new Image();

      image.onload = () => {
        const logoSize = outputCanvas.width * 0.22;
        const x = (outputCanvas.width - logoSize) / 2;
        const y = (outputCanvas.height - logoSize) / 2;

        context.fillStyle = background;
        context.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);

        context.drawImage(image, x, y, logoSize, logoSize);
        finishDownload();
      };

      image.src = logo;
    } else {
      finishDownload();
    }
  }

  function downloadSVG() {
    if (!validUrl || !qrContainerRef.current) {
      setMessage("Please enter a valid URL first.");
      return;
    }

    const svg = qrContainerRef.current.querySelector("svg");

    if (!svg) return;

    const clonedSVG = svg.cloneNode(true) as SVGSVGElement;

    if (logo) {
      const imageSize = size * 0.22;
      const x = (size - imageSize) / 2;
      const y = (size - imageSize) / 2;

      const image = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "image"
      );

      image.setAttribute("href", logo);
      image.setAttribute("x", String(x));
      image.setAttribute("y", String(y));
      image.setAttribute("width", String(imageSize));
      image.setAttribute("height", String(imageSize));
      image.setAttribute("preserveAspectRatio", "xMidYMid meet");

      clonedSVG.appendChild(image);
    }

    const svgData = new XMLSerializer().serializeToString(clonedSVG);
    const blob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = `${name.trim() || "nurupy-qr-code"}.svg`;
    link.click();

    URL.revokeObjectURL(downloadUrl);
    setMessage("SVG QR code downloaded.");
  }

  function loadCode(code: (typeof initialCodes)[number]) {
    setName(code.name);
    setUrl(code.url);
    setActiveTab("generator");
    setMessage("QR code loaded into the generator.");
  }

  function deleteCode(id: number) {
    setCodes((previous) => previous.filter((code) => code.id !== id));
  }

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[250px] border-r border-gray-200 bg-white px-6 py-7 lg:flex lg:flex-col">
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
            const active = item.href === "/dashboard/qr-codes";

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
          <p className="text-sm font-bold">Need more power?</p>
          <p className="mt-2 text-xs leading-5 text-gray-400">
            Advanced tools and insights are coming to NuruPy.
          </p>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[250px]">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 md:px-9">
          <div>
            <h1 className="text-lg font-black">QR Codes</h1>
            <p className="text-xs text-gray-500">
              Create and customize your QR codes
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold hover:bg-gray-100"
          >
            Back to dashboard
          </Link>
        </header>

        <div className="p-5 md:p-9">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#B78A00]">
                QR CODE STUDIO
              </p>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                Make every scan <span className="text-[#C99700]">count.</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                Turn your links into customizable QR codes that people can
                scan to reach your content.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("generator")}
                className={`rounded-xl px-4 py-3 text-sm font-bold ${
                  activeTab === "generator"
                    ? "bg-[#FFC000] text-black"
                    : "border border-gray-200 text-gray-500"
                }`}
              >
                Generator
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className={`rounded-xl px-4 py-3 text-sm font-bold ${
                  activeTab === "history"
                    ? "bg-[#FFC000] text-black"
                    : "border border-gray-200 text-gray-500"
                }`}
              >
                My QR Codes ({codes.length})
              </button>
            </div>
          </div>

          {message && (
            <div className="mb-5 rounded-xl border border-[#FFC000] bg-[#FFF9E6] px-4 py-3 text-sm font-medium text-[#765800]">
              {message}
            </div>
          )}

          {activeTab === "generator" ? (
            <div className="grid gap-7 xl:grid-cols-[1fr_390px]">
              <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-7">
                <div className="mb-7">
                  <h3 className="text-lg font-black">Customize your QR code</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Set up the destination and appearance.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-xs font-bold">
                      QR CODE NAME
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. My Business Website"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#FFC000]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold">
                      DESTINATION URL
                    </label>
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#FFC000]"
                    />
                    {!validUrl && (
                      <p className="mt-2 text-xs text-red-500">
                        Enter a valid URL starting with https:// or http://
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-bold">
                      QR CODE COLOURS
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="mb-2 text-xs text-gray-500">
                          Foreground colour
                        </p>
                        <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                          <input
                            type="color"
                            value={foreground}
                            onChange={(e) => setForeground(e.target.value)}
                            className="h-8 w-10 cursor-pointer border-0 bg-transparent"
                          />
                          <span className="text-xs font-bold">{foreground}</span>
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-xs text-gray-500">
                          Background colour
                        </p>
                        <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                          <input
                            type="color"
                            value={background}
                            onChange={(e) => setBackground(e.target.value)}
                            className="h-8 w-10 cursor-pointer border-0 bg-transparent"
                          />
                          <span className="text-xs font-bold">{background}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {[
                        { label: "Classic", fg: "#111111", bg: "#FFFFFF" },
                        { label: "Gold", fg: "#111111", bg: "#FFC000" },
                        { label: "Dark", fg: "#FFFFFF", bg: "#111111" },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => {
                            setForeground(preset.fg);
                            setBackground(preset.bg);
                          }}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold hover:border-[#FFC000]"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-xs font-bold">QR CODE SIZE</label>
                      <span className="text-xs font-bold text-gray-500">
                        {size} × {size} px
                      </span>
                    </div>

                    <input
                      type="range"
                      min="160"
                      max="400"
                      step="20"
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-full accent-[#FFC000]"
                    />
                    <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                      <span>Small</span>
                      <span>Large</span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-bold">
                      CENTRE LOGO (OPTIONAL)
                    </label>

                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        className="rounded-xl border border-dashed border-gray-300 px-5 py-4 text-xs font-bold transition hover:border-[#FFC000]"
                      >
                        + Upload logo
                      </button>

                      {logo && (
                        <>
                          <img
                            src={logo}
                            alt="Uploaded logo"
                            className="h-12 w-12 rounded-lg border border-gray-200 object-contain"
                          />
                          <button
                            onClick={() => setLogo(null)}
                            className="text-xs font-bold text-red-500"
                          >
                            Remove logo
                          </button>
                        </>
                      )}
                    </div>
                    <p className="mt-2 text-[11px] text-gray-400">
                      PNG or JPG, maximum 2 MB.
                    </p>
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={includeMargin}
                      onChange={(e) => setIncludeMargin(e.target.checked)}
                      className="h-4 w-4 accent-[#FFC000]"
                    />
                    Include margin around QR code
                  </label>

                  <button
                    onClick={saveQRCode}
                    disabled={!validUrl}
                    className="w-full rounded-xl bg-[#FFC000] px-5 py-4 text-sm font-black text-black transition hover:bg-[#EAB000] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save QR Code
                  </button>
                </div>
              </section>

              <section className="h-fit rounded-2xl border border-gray-200 bg-[#FAFAFA] p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-black">Live preview</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Your QR code updates as you customize it.
                  </p>
                </div>

                <div className="flex justify-center rounded-2xl border border-gray-200 bg-white p-5">
                  {validUrl ? (
                    <div
                      ref={qrContainerRef}
                      className="relative inline-block"
                      style={{ backgroundColor: background }}
                    >
                      <QRCodeSVG
                        value={url}
                        size={size}
                        bgColor={background}
                        fgColor={foreground}
                        level="H"
                        marginSize={includeMargin ? 4 : 0}
                      />

                      {logo && (
                        <div
                          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md p-1"
                          style={{
                            backgroundColor: background,
                            width: size * 0.25,
                            height: size * 0.25,
                          }}
                        >
                          <img
                            src={logo}
                            alt="QR centre logo"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-56 items-center justify-center text-xs text-gray-400">
                      Enter a valid URL to preview your QR code.
                    </div>
                  )}

                  {validUrl && (
                    <div className="hidden">
                      <QRCodeCanvas
                        ref={canvasRef}
                        value={url}
                        size={size}
                        bgColor={background}
                        fgColor={foreground}
                        level="H"
                        marginSize={includeMargin ? 4 : 0}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-5 text-center">
                  <p className="break-all text-sm font-bold">{name || "My QR Code"}</p>
                  <p className="mt-1 break-all text-xs text-gray-400">{url}</p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={downloadPNG}
                    disabled={!validUrl}
                    className="rounded-xl bg-[#111111] px-4 py-3 text-xs font-bold text-white transition hover:bg-black disabled:opacity-40"
                  >
                    ↓ Download PNG
                  </button>

                  <button
                    onClick={downloadSVG}
                    disabled={!validUrl}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-xs font-bold transition hover:border-[#FFC000] disabled:opacity-40"
                  >
                    ↓ Download SVG
                  </button>
                </div>

                <p className="mt-4 text-center text-[10px] leading-5 text-gray-400">
                  Scan the QR code with your phone camera to test the
                  destination.
                </p>
              </section>
            </div>
          ) : (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-7">
              <div className="mb-6">
                <h3 className="text-lg font-black">Your QR codes</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Your recently saved QR code configurations.
                </p>
              </div>

              {codes.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-10 text-center">
                  <p className="font-bold">No QR codes yet</p>
                  <p className="mt-2 text-xs text-gray-500">
                    Create your first QR code using the generator.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {codes.map((code) => (
                    <div
                      key={code.id}
                      className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0">
                        <p className="font-bold">{code.name}</p>
                        <p className="mt-1 break-all text-xs text-gray-500">
                          {code.url}
                        </p>
                        <p className="mt-2 text-[10px] text-gray-400">
                          {code.created}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => loadCode(code)}
                          className="rounded-lg bg-[#FFC000] px-4 py-2 text-xs font-bold text-black"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteCode(code.id)}
                          className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <div className="mt-8 rounded-2xl bg-[#111111] p-6 text-white md:p-8">
            <p className="text-xs font-bold uppercase tracking-[2px] text-[#FFC000]">
              Coming next
            </p>
            <h3 className="mt-3 text-xl font-black">
              QR Code Analytics
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
              Soon, you will be able to see how many people scan your QR
              codes, where they scan from, and which devices they use.
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
