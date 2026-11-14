
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export default async function WelcomePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const fullName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "there";

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5 py-12">
      <div className="w-full max-w-lg text-center">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC000] text-lg font-bold text-black">
            N
          </span>

          <span className="text-xl font-bold tracking-tight text-[#111111]">
            NuruPy <span className="text-[#FFC000]">Links</span>
          </span>
        </Link>

        <div className="rounded-3xl border border-black/10 bg-white px-7 py-10 shadow-xl shadow-black/5 sm:px-10">
          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#FFC000]/15">
            <svg
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-black/40">
            Account confirmed
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
            Welcome, {fullName}!
          </h1>

          <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-black/55">
            Your email has been confirmed and your NuruPy Links
            account is ready. You can now start creating and
            managing your links.
          </p>

          <div className="mt-8 rounded-xl border border-[#FFC000]/40 bg-[#FFC000]/10 p-4 text-left">
            <p className="text-xs font-medium text-black/45">
              Signed in as
            </p>
            <p className="mt-1 break-all text-sm font-semibold text-[#111111]">
              {user.email}
            </p>
          </div>

          <Link
            href="/dashboard"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFC000] px-6 py-4 font-semibold text-black transition hover:brightness-95"
          >
            Go to your dashboard
            <span aria-hidden="true">→</span>
          </Link>

          <p className="mt-5 text-xs text-black/40">
            Welcome to NuruPy Links. Let's get started.
          </p>
        </div>
      </div>
    </main>
  );
}
