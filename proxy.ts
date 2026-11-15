
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/proxy";

const AUTH_EXEMPT_PATHS = new Set([
  "/login",
  "/register",
  "/verify-email",
  "/welcome",
  "/dashboard",
]);

export async function proxy(request: NextRequest) {
  const pathname =
    request.nextUrl.pathname.replace(/\/+$/, "") || "/";

  // Public short links and deep links do not need authentication.
  const isPublicLink =
    /^\/[^/]+$/.test(pathname) &&
    !AUTH_EXEMPT_PATHS.has(pathname) &&
    !pathname.includes(".");

  if (isPublicLink) {
    return NextResponse.next();
  }

  // Keep existing Supabase authentication checks for other routes.
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
