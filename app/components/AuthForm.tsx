"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const isRegister = mode === "register";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (isRegister) {
      if (!fullName.trim()) {
        setError("Please enter your full name.");
        return;
      }

      if (!passwordValid) {
        setError(
          "Password must contain at least 8 characters, including uppercase, lowercase and a number."
        );
        return;
      }

      if (password !== confirmPassword) {
        setError("Your passwords do not match.");
        return;
      }
    }

    if (!email.trim()) {
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
        // Use the production domain in production.
        // Use localhost only when testing locally.
        const siteUrl =
          process.env.NODE_ENV === "production"
            ? "https://nurupy.online"
            : window.location.origin;

        const emailRedirectTo = `${siteUrl}/auth/callback`;

        const { data, error: signUpError } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                full_name: fullName.trim(),
              },
              emailRedirectTo,
            },
          });

        if (signUpError) {
          throw signUpError;
        }

        // If email confirmation is enabled, Supabase sends a verification email.
        if (!data.session) {
          router.replace(
            `/verify-email?email=${encodeURIComponent(email.trim())}`
          );
          return;
        }

        // If confirmation is disabled, continue directly to the dashboard.
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      // LOGIN
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        throw signInError;
      }

      router.replace("/dashboard");
      router.refresh();
      return;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10 text-[#111111]">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-tight text-[#111111]"
          >
            NuruPy<span className="text-[#FFC000]">.</span>
          </Link>

          <p className="mt-2 text-sm text-gray-500">
            Smart links. Better connections.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#111111]">
              {isRegister ? "Create your account" : "Welcome back"}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {isRegister
                ? "Create your NuruPy account to get started."
                : "Sign in to continue to your NuruPy dashboard."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Success message */}
          {message && (
            <div
              role="status"
              className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            {isRegister && (
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FFC000] focus:ring-2 focus:ring-[#FFC000]/20"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#FFC000] focus:ring-2 focus:ring-[#FFC000]/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-[#FFC000] focus:ring-2 focus:ring-[#FFC000]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-[#111111]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {isRegister && (
                <p className="mt-2 text-xs text-gray-500">
                  Use at least 8 characters, with uppercase, lowercase and a number.
                </p>
              )}
            </div>

            {/* Confirm Password */}
            {isRegister && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm your password"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-[#FFC000] focus:ring-2 focus:ring-[#FFC000]/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-[#111111]"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me / Forgot Password */}
            {!isRegister && (
              <div className="flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 accent-[#FFC000]"
                  />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-[#111111] hover:text-[#B88900]"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#FFC000] px-4 py-3.5 text-sm font-bold text-[#111111] transition hover:bg-[#E6AD00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : isRegister
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-7 text-center text-sm text-gray-600">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#111111] underline decoration-[#FFC000] decoration-2 underline-offset-4"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#111111] underline decoration-[#FFC000] decoration-2 underline-offset-4"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          By continuing, you agree to use NuruPy responsibly.
        </p>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-500 hover:text-[#111111]"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}