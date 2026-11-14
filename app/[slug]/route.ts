
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

type ResolvedLink = {
  type?: string;
  slug?: string;
  destination_url?: string | null;
  android_url?: string | null;
  ios_url?: string | null;
  fallback_url?: string | null;
};

type RouteContext = {
  params: Promise<{ slug: string }>;
};

function redirectTo(destination: string) {
  try {
    const url = new URL(destination);

    if (["javascript:", "data:", "file:"].includes(url.protocol)) {
      return new NextResponse("Invalid destination.", { status: 400 });
    }

    const response = NextResponse.redirect(url, 302);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return new NextResponse("Invalid destination URL.", { status: 400 });
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { slug } = await context.params;

  if (!slug || !slug.trim()) {
    return new NextResponse("Link not found.", { status: 404 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new NextResponse("Server configuration error.", {
      status: 500,
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data, error } = await supabase.rpc(
    "resolve_public_link",
    { p_slug: slug.trim() }
  );

  if (error) {
    console.error("Public link resolution error:", error);

    return new NextResponse("Unable to resolve link.", {
      status: 500,
    });
  }

  if (!data) {
    return new NextResponse("Link not found.", { status: 404 });
  }

  const link = data as ResolvedLink & { type?: string };

  if (link.type === "conflict") {
    return new NextResponse("This link has a configuration conflict.", {
      status: 409,
    });
  }

  // Regular short link
  if (link.type === "short") {
    if (!link.destination_url) {
      return new NextResponse("Destination not configured.", {
        status: 404,
      });
    }

    return redirectTo(link.destination_url);
  }

  // Deep link
  if (link.type === "deep") {
    const userAgent = request.headers.get("user-agent") || "";

    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);

    let destination = link.fallback_url;

    if (isAndroid && link.android_url) {
      destination = link.android_url;
    } else if (isIOS && link.ios_url) {
      destination = link.ios_url;
    }

    if (!destination) {
      return new NextResponse("No destination configured.", {
        status: 404,
      });
    }

    return redirectTo(destination);
  }

  return new NextResponse("Link not found.", { status: 404 });
}
