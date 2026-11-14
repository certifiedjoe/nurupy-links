
import Link from "next/link";
import MobileNavigation from "./components/MobileNavigation";

const features = [
  {
    icon: "↗",
    title: "Smart Short Links",
    description:
      "Transform long URLs into clean, memorable links. Create custom aliases and manage everything from one dashboard.",
  },
  {
    icon: "◉",
    title: "Advanced Analytics",
    description:
      "Understand your audience through click tracking, countries, devices, referrers and campaign performance.",
  },
  {
    icon: "▦",
    title: "QR Code Generator",
    description:
      "Generate QR codes for your short links, customize their appearance and download them in PNG or SVG.",
  },
  {
    icon: "⇢",
    title: "Deep Linking",
    description:
      "Direct users to the right content inside mobile applications with intelligent fallback destinations.",
  },
  {
    icon: "⌘",
    title: "Developer API",
    description:
      "Connect NuruPy Links to your applications and automate link creation and management.",
  },
  {
    icon: "◈",
    title: "Campaign Tracking",
    description:
      "Organize marketing campaigns with UTM parameters and discover which channels drive engagement.",
  },
];

const solutions = [
  {
    title: "Businesses",
    description: "Manage branded links and measure customer engagement.",
  },
  {
    title: "Marketers",
    description: "Track campaigns and understand where visitors come from.",
  },
  {
    title: "Creators",
    description: "Share clean links and connect audiences to your content.",
  },
  {
    title: "Developers",
    description: "Build link experiences using API integrations.",
  },
];

const phoneImages = [
  {
    src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=320&h=640&fit=crop&q=70",
    alt: "Mobile experience",
    position: "left",
  },
  {
    src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=480&h=800&fit=crop&q=75",
    alt: "Smart mobile experience",
    position: "center",
  },
  {
    src: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=320&h=640&fit=crop&q=70",
    alt: "Mobile technology",
    position: "right",
  },
];

function PhoneImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className: string;
  priority?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={480}
      height={800}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={className}
    />
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#111111]">
      <MobileNavigation />

      {/* HERO */}
      <section className="relative px-4 pb-14 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
        <div className="relative mx-auto max-w-5xl text-center">

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#FFC000]/50 bg-[#FFC000]/10 px-4 py-2 text-xs font-medium text-black">
            <span className="h-2 w-2 rounded-full bg-[#FFC000]" />
            One platform. Smarter links.
          </div>

          <h1 className="text-4xl font-light leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Every Link Has
            <br />
            <span className="font-serif italic text-[#FFC000]">
              A Bigger Purpose.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-black/60 sm:text-lg">
            Turn ordinary URLs into powerful digital experiences. Create smart
            short links, track every click, generate QR codes and connect users
            to the right destination with NuruPy Links.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/register"
              className="rounded-full bg-[#FFC000] px-8 py-3.5 text-center font-semibold text-black transition-colors hover:bg-[#e6ad00]"
            >
              Create Free Account
            </Link>

            <Link
              href="#product"
              className="rounded-full border border-black/20 px-8 py-3.5 text-center font-medium text-black transition-colors hover:border-[#FFC000] hover:bg-[#FFC000]/10"
            >
              Explore Platform
            </Link>
          </div>
        </div>

        {/* PHONE MOCKUPS */}
        <div className="mx-auto mt-14 max-w-4xl sm:mt-20">
          <div className="flex items-end justify-center gap-3 sm:gap-5 md:gap-6">

            {/* LEFT PHONE */}
            <div className="hidden w-48 -rotate-6 md:block lg:w-56">
              <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-lg">
                <PhoneImage
                  src={phoneImages[0].src}
                  alt={phoneImages[0].alt}
                  className="h-[400px] w-full object-cover"
                />
              </div>
            </div>

            {/* CENTER PHONE */}
            <div className="z-10 w-[min(65vw,16rem)] sm:w-56 md:w-64">
              <div className="overflow-hidden rounded-[1.8rem] border border-black/10 bg-white shadow-xl sm:rounded-[2.2rem]">
                <PhoneImage
                  src={phoneImages[1].src}
                  alt={phoneImages[1].alt}
                  priority
                  className="h-[400px] w-full object-cover sm:h-[480px] md:h-[520px]"
                />
              </div>
            </div>

            {/* RIGHT PHONE */}
            <div className="hidden w-48 rotate-6 md:block lg:w-56">
              <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-lg">
                <PhoneImage
                  src={phoneImages[2].src}
                  alt={phoneImages[2].alt}
                  className="h-[400px] w-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section
        id="analytics"
        className="border-y border-[#FFC000]/30 bg-[#FFC000]/10 py-14 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center sm:mb-14">
            <h2 className="text-2xl font-light sm:text-3xl md:text-4xl">
              Your Links.
              <br />
              <span className="font-serif italic text-black/60">
                Your Data. Your Control.
              </span>
            </h2>

            <p className="mt-4 text-sm text-black/60 sm:text-base">
              Everything you need to understand and manage your links.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center sm:gap-5 md:grid-cols-4">
            {[
              "Smart URL Shortening",
              "Link Analytics",
              "QR Code Generation",
              "Deep Linking",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-[#FFC000]/40 bg-white p-4 sm:p-5"
              >
                <p className="text-3xl font-light text-[#FFC000] md:text-4xl">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-xs text-black/60 sm:text-sm">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="product" className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center sm:mb-16">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#FFC000] sm:text-sm">
              Powerful Features
            </p>

            <h2 className="text-2xl font-light sm:text-3xl md:text-4xl">
              Everything Your Links Need.
              <br />
              <span className="font-serif italic">All in One Place.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-black/60 sm:text-base">
              From creating your first short URL to understanding your
              audience, NuruPy Links gives you the tools to do more with every
              click.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-black/10 bg-white p-6 transition-colors duration-150 hover:border-[#FFC000] sm:p-8"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#FFC000]/40 bg-[#FFC000]/15 text-2xl text-black">
                  {feature.icon}
                </div>

                <h3 className="mb-3 text-lg font-medium sm:text-xl">
                  {feature.title}
                </h3>

                <p className="text-sm leading-relaxed text-black/60 sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section
        id="solutions"
        className="border-y border-black/10 bg-[#FFC000]/5 px-4 py-16 sm:px-6 sm:py-24"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#FFC000] sm:text-sm">
              Built for Everyone
            </p>

            <h2 className="text-3xl font-light leading-tight sm:text-4xl md:text-5xl">
              One Platform.
              <br />
              <span className="font-serif italic">Many Possibilities.</span>
            </h2>

            <p className="mt-6 text-sm leading-relaxed text-black/60 sm:text-base">
              Whether you are a content creator, business owner, marketer or
              developer, NuruPy Links helps you create better links and
              understand what happens after every click.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-block rounded-full bg-[#FFC000] px-7 py-3 font-semibold text-black transition-colors hover:bg-[#e6ad00]"
            >
              Start Creating Links
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className="rounded-2xl border border-[#FFC000]/30 bg-white p-6 sm:p-7"
              >
                <div className="mb-4 h-1 w-10 rounded-full bg-[#FFC000]" />

                <h3 className="text-lg font-medium">{solution.title}</h3>

                <p className="mt-3 text-sm leading-relaxed text-black/60">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEVELOPERS */}
      <section id="developers" className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#FFC000] sm:text-sm">
            For Developers
          </p>

          <h2 className="text-3xl font-light sm:text-4xl md:text-5xl">
            Built to Integrate.
            <br />
            <span className="font-serif italic">Ready to Scale.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-black/60 sm:text-base">
            Connect NuruPy Links with your applications and automate your link
            management through developer integrations.
          </p>

          <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border border-black/10 bg-[#111111] text-left sm:mt-10">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-4 sm:px-5">
              <span className="h-3 w-3 rounded-full bg-white" />
              <span className="h-3 w-3 rounded-full bg-[#FFC000]" />
              <span className="h-3 w-3 rounded-full bg-white/60" />
              <span className="ml-2 text-xs text-white/60 sm:ml-3">
                API Example
              </span>
            </div>

            <pre className="overflow-x-auto p-4 text-xs leading-7 text-[#FFC000] sm:p-6 sm:text-sm">
{`POST /api/v1/links

{
  "url": "https://example.com/my-page",
  "customAlias": "my-link"
}`}
            </pre>
          </div>

          <p className="mt-4 text-xs text-black/50">
            Example interface only. API integration will be implemented
            separately.
          </p>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="border-t border-black/10 bg-[#FFC000]/10 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-light tracking-tight sm:text-4xl md:text-5xl">
            Make Every Click
            <br />
            <span className="font-serif italic">Count.</span>
          </h2>

          <p className="mt-6 text-base text-black/60 sm:text-lg">
            Start building smarter links with NuruPy Links.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-block rounded-full bg-[#FFC000] px-8 py-3.5 font-semibold text-black transition-colors hover:bg-[#e6ad00] sm:mt-10 sm:px-10 sm:py-4 sm:text-lg"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-white px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#FFC000] text-sm font-bold text-black">
              N
            </div>

            <span className="font-medium">
              NuruPy <span className="text-[#FFC000]">Links</span>
            </span>
          </Link>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-black/50 sm:gap-8 sm:text-sm">
            <Link href="#product" className="hover:text-black">Product</Link>
            <Link href="#solutions" className="hover:text-black">Solutions</Link>
            <Link href="#analytics" className="hover:text-black">Analytics</Link>
            <Link href="#developers" className="hover:text-black">Developers</Link>
          </div>

          <p className="text-center text-xs text-black/50">
            © 2026 NuruPy Links. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
