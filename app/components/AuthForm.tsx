
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const router = useRouter();
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRules = [
    {
      label: "At least 8 characters",
      valid: passwordValue.length >= 8,
    },
    {
      label: "One uppercase letter (A-Z)",
      valid: /[A-Z]/.test(passwordValue),
    },
    {
      label: "One lowercase letter (a-z)",
      valid: /[a-z]/.test(passwordValue),
    },
    {
      label: "One number (0-9)",
      valid: /[0-9]/.test(passwordValue),
    },
    {
      label: "One special character (!@#$%)",
      valid: /[^A-Za-z0-9]/.test(passwordValue),
    },
  ];

  const passwordIsValid = passwordRules.every((rule) => rule.valid);

  const passwordStrength = passwordRules.filter(
    (rule) => rule.valid
  ).length;

  function getFriendlyError(message: string) {
    const normalized = message.toLowerCase();

    if (
      normalized.includes("invalid login credentials") ||
      normalized.includes("invalid credentials")
    ) {
      return "The email address or password is incorrect. Please check your details and try again.";
    }

    if (
      normalized.includes("email not confirmed") ||
      normalized.includes("email_not_confirmed")
    ) {
      return "Your email address has not been verified yet. Please check your inbox for the confirmation email.";
    }

    if (normalized.includes("user already registered")) {
      return "An account with this email already exists. Please log in instead.";
    }

    if (normalized.includes("password should be")) {
      return "Your password does not meet the security requirements. Please choose a stronger password.";
    }

    if (
      normalized.includes("rate limit") ||
      normalized.includes("too many requests")
    ) {
      return "Too many attempts. Please wait a little before trying again.";
    }

    if (
      normalized.includes("network") ||
      normalized.includes("fetch")
    ) {
      return "We could not connect to our server. Please check your internet connection and try again.";
    }

    return message;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const formData = new FormData(event.currentTarget);

    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    const password = passwordValue;
    const confirmPassword = confirmPasswordValue;

    if (isRegister) {
      if (fullName.length < 2) {
        setError("Please enter your full name.");
        return;
      }

      if (!passwordIsValid) {
        setError("Please complete all the password requirements.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Your passwords do not match.");
        return;
      }
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const emailRedirectTo =
          `${window.location.origin}/auth/callback?next=/welcome`;

        const { error: signUpError } =
          await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
              emailRedirectTo,
            },
          });

        if (signUpError) {
          throw signUpError;
        }

        // Supabase email confirmation is enabled.
        // Send the user to the dedicated verification page.
        router.replace(
          `/verify-email?email=${encodeURIComponent(email)}`
        );

        return;
      }

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        throw signInError;
      }

      router.replace("/dashboard");
      router.refresh();
      return;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(getFriendlyError(errorMessage));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:px-6">
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

        {/* AUTHENTICATION CARD */}
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-xl shadow-black/5 sm:p-9">

          {/* HEADING */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFC000]/15">
              <span className="text-2xl text-black">
                {isRegister ? "✦" : "↗"}
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-[#111111]">
              {isRegister
                ? "Create your account"
                : "Welcome back"}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-black/50">
              {isRegister
                ? "Create your NuruPy account and start managing smarter links."
                : "Sign in to access your links, QR codes and analytics."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* FULL NAME */}
            {isRegister && (
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Full name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  required
                  minLength={2}
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-[#FFC000] focus:ring-2 focus:ring-[#FFC000]/20"
                />
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-black"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-[#FFC000] focus:ring-2 focus:ring-[#FFC000]/20"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-black"
              >
                {isRegister ? "Create password" : "Password"}
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    isRegister
                      ? "new-password"
                      : "current-password"
                  }
                  placeholder={
                    isRegister
                      ? "Create a strong password"
                      : "Enter your password"
                  }
                  minLength={isRegister ? 8 : undefined}
                  required
                  value={passwordValue}
                  onChange={(event) =>
                    setPasswordValue(event.target.value)
                  }
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 pr-20 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-[#FFC000] focus:ring-2 focus:ring-[#FFC000]/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-black/50 transition hover:text-black"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* LIVE PASSWORD REQUIREMENTS */}
              {isRegister && (
                <div className="mt-4 rounded-xl border border-black/10 bg-black/[0.02] p-4">

                  <p className="mb-3 text-sm font-semibold text-[#111111]">
                    Your password must contain:
                  </p>

                  <div className="space-y-2">
                    {passwordRules.map((rule) => (
                      <div
                        key={rule.label}
                        className="flex items-center gap-2"
                      >
                        <span
                          className={
                            rule.valid
                              ? "font-bold text-green-600"
                              : "text-black/30"
                          }
                        >
                          {rule.valid ? "✓" : "○"}
                        </span>

                        <span
                          className={
                            rule.valid
                              ? "text-sm text-green-700"
                              : "text-sm text-black/50"
                          }
                        >
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* PASSWORD STRENGTH */}
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-black/50">
                        Password strength
                      </span>

                      <span className="font-semibold text-black">
                        {passwordValue.length === 0
                          ? "Not started"
                          : passwordStrength === 5
                            ? "Strong"
                            : passwordStrength <= 2
                              ? "Weak"
                              : "Getting stronger"}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      {passwordRules.map((rule, index) => (
                        <div
                          key={index}
                          className={`h-1.5 flex-1 rounded-full transition ${
                            rule.valid
                              ? "bg-[#FFC000]"
                              : "bg-black/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            {isRegister && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter your password again"
                    minLength={8}
                    required
                    value={confirmPasswordValue}
                    onChange={(event) =>
                      setConfirmPasswordValue(event.target.value)
                    }
                    className="w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 pr-10 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-[#FFC000] focus:ring-2 focus:ring-[#FFC000]/20"
                  />

                  {confirmPasswordValue.length > 0 && (
                    <span
                      className={`absolute right-4 top-1/2 -translate-y-1/2 font-bold ${
                        passwordValue === confirmPasswordValue
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {passwordValue === confirmPasswordValue
                        ? "✓"
                        : "×"}
                    </span>
                  )}
                </div>

                {confirmPasswordValue.length > 0 && (
                  <p
                    className={`mt-2 text-xs ${
                      passwordValue === confirmPasswordValue
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {passwordValue === confirmPasswordValue
                      ? "Your passwords match."
                      : "Your passwords do not match yet."}
                  </p>
                )}
              </div>
            )}

            {/* FORGOT PASSWORD */}
            {!isRegister && (
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-black underline decoration-[#FFC000] decoration-2 underline-offset-4 transition hover:text-black/60"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm leading-relaxed text-red-700"
              >
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={
                loading ||
                (isRegister &&
                  (!passwordIsValid ||
                    passwordValue !== confirmPasswordValue))
              }
              className="w-full rounded-xl bg-[#FFC000] px-5 py-4 font-semibold text-black shadow-lg shadow-[#FFC000]/20 transition hover:-translate-y-0.5 hover:brightness-95 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? isRegister
                  ? "Creating your account..."
                  : "Signing you in..."
                : isRegister
                  ? "Create account"
                  : "Sign in"}
            </button>

            <p className="text-center text-xs leading-relaxed text-black/40">
              {isRegister
                ? "By creating an account, you agree to use NuruPy Links responsibly."
                : "Your account is protected by secure authentication."}
            </p>
          </form>

          {/* SWITCH AUTHENTICATION */}
          <div className="mt-8 border-t border-black/10 pt-6 text-center text-sm text-black/50">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-black underline decoration-[#FFC000] decoration-2 underline-offset-4"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New to NuruPy Links?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-black underline decoration-[#FFC000] decoration-2 underline-offset-4"
                >
                  Create an account
                </Link>
              </>
            )}
          </div>
        </div>

        {/* BACK TO HOMEPAGE */}
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
