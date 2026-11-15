
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function VerifyEmailPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") || "");
  }, []);

  async function handleResend() {
    if (!email || loading) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo:
        process.env.NODE_ENV == "production"
           ? "https://nurupy.online/auth/callback"
           :`${window.location.origin}/auth/callback`,
          
        },
      });
      if (resendError) {
        throw resendError;
      }

      setMessage(
        "A new confirmation email has been requested. Please check your inbox and spam folder."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We could not resend your confirmation email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">

        {/* LOGO */}
        <Link
          href="/"
          className="mb-10 flex items-center justify-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC000] text-lg font-bold text-black">
            N
          </div>

          <span className="text-xl font-bold tracking-tight text-[#111111]">
            NuruPy <span className="text-[#FFC000]">Links</span>
          </span>
        </Link>

        {/* VERIFICATION CARD */}
        <div className="rounded-3xl border border-black/10 bg-white p-7 text-center shadow-xl shadow-black/5 sm:p-9">

          {/* EMAIL ICON */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFC000]/15">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-black/40">
            One more step
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-[#111111]">
            Check your email
          </h1>

          <p className="mt-4 text-sm leading-6 text-black/55">
            Your NuruPy Links account has been created.
            We have requested an email confirmation for your account.
          </p>

          {/* REGISTERED EMAIL */}
          <div className="mt-6 rounded-xl border border-[#FFC000]/50 bg-[#FFC000]/10 p-4">
            <p className="mb-1 text-xs font-medium text-black/45">
              Confirmation email sent to
            </p>

            <p className="break-all text-sm font-semibold text-[#111111]">
              {email || "Your registered email address"}
            </p>
          </div>

          {/* INSTRUCTIONS */}
          <div className="mt-7 text-left">
            <p className="mb-4 text-sm font-semibold text-[#111111]">
              What to do next
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFC000] text-xs font-bold text-black">
                  1
                </span>
                <p className="text-sm leading-6 text-black/60">
                  Open your email inbox and find the confirmation email
                  from NuruPy Links.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFC000] text-xs font-bold text-black">
                  2
                </span>
                <p className="text-sm leading-6 text-black/60">
                  Open the email and click the confirmation link.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFC000] text-xs font-bold text-black">
                  3
                </span>
                <p className="text-sm leading-6 text-black/60">
                  Your email will be verified and you can continue
                  to your NuruPy dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* SUCCESS MESSAGE */}
          {message && (
            <div
              role="status"
              className="mt-6 rounded-xl border border-[#FFC000]/50 bg-[#FFC000]/10 p-3 text-sm leading-6 text-black"
            >
              {message}
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-300 bg-red-50 p-3 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          {/* RESEND BUTTON */}
          <button
            type="button"
            onClick={handleResend}
            disabled={!email || loading}
            className="mt-7 w-full rounded-xl bg-[#FFC000] px-5 py-4 font-semibold text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Requesting email..."
              : "Resend confirmation email"}
          </button>

          <p className="mt-4 text-xs leading-5 text-black/40">
            Didn't receive the email? Check your spam or junk folder.
            You can also request another confirmation email above.
          </p>

          {/* LOGIN LINK */}
          <div className="mt-7 border-t border-black/10 pt-6">
            <p className="text-sm text-black/50">
              Already confirmed your email?
            </p>

            <Link
              href="/login"
              className="mt-2 inline-block text-sm font-semibold text-black underline decoration-[#FFC000] decoration-2 underline-offset-4"
            >
              Continue to sign in
            </Link>
          </div>
        </div>

        {/* HOMEPAGE */}
        <Link
          href="/"
          className="mt-8 block text-center text-sm text-black/40 transition hover:text-black"
        >
          ← Back to homepage
        </Link>
      </div>
    </main>
  );
}
