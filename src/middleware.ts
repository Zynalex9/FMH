import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/en/request", "/en/requests"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("x-debug", "middleware-ran");

  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  console.log("🧭 Middleware hit:", pathname, "Protected:", isProtected);
  console.log("👤 Session user:", session?.user?.id);
  // --- PUBLIC ROUTES ---
  if (!isProtected) {
    console.log("🌐 Public route → allowing through");
    return res;
  }

  // --- NO SESSION → LOGIN ---
  if (!session) {
    console.log("🚫 No session found → redirecting to /en/signin");
    return NextResponse.redirect(new URL("/en/signin", req.url));
  }

  // --- USER DATA FROM JWT ---
  const metadata = session.user.user_metadata;
  console.log("🧾 User metadata:", metadata);

  const role = metadata?.role;
  const isAdmin = role === "admin";

  console.log("🔐 Role from metadata:", role);
  console.log("👤 User active:", metadata?.is_active);

  // --- ROUTE PARSING ---
  const segments = pathname.split("/").filter(Boolean);
  const isListPage = segments.length === 2 && segments[1] === "request";
  const isDetailPage = segments.length === 3 && segments[1] === "requests";

  console.log("📂 Segments:", segments);
  console.log("🧩 isListPage:", isListPage, "isDetailPage:", isDetailPage);

  // --- LIST PAGE: ADMIN ONLY ---
  if (isListPage) {
    if (!isAdmin) {
      console.log("🚫 User not admin → redirecting to /unauthorized");
      return NextResponse.redirect(new URL("/en/unauthorized", req.url));
    }
    console.log("✅ Admin access granted → list page");
    return res;
  }

  // --- DETAIL PAGE: ADMIN OR ASSIGNED DRIVER ---
  if (isDetailPage) {
    if (isAdmin) {
      console.log("✅ Admin access granted → detail page");
      return res;
    }

    const requestId = segments[2];
    console.log("🔍 Checking request ID:", requestId);

    const { data: request, error } = await supabase
      .from("requests")
      .select("assigned_to")
      .eq("id", requestId)
      .single();

    if (error) {
      console.log("⚠️ Error fetching request:", error);
      return NextResponse.redirect(new URL("/en/unauthorized", req.url));
    }

    console.log("📝 Request fetched:", request);

    if (request?.assigned_to === session.user.id) {
      console.log("✅ Authorized driver → access granted");
      return res;
    }

    console.log("🚫 Driver not assigned → redirecting to /unauthorized");
    return NextResponse.redirect(new URL("/en/unauthorized", req.url));
  }

  // --- FALLBACK ---
  console.log("⚠️ No matching route → redirecting to /unauthorized");
  return NextResponse.redirect(new URL("/en/unauthorized", req.url));
}

export const config = {
  matcher: ["/en/request/:path*", "/en/requests/:path*"],
};
