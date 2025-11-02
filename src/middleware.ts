import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes (require login)
const PROTECTED_PREFIXES = [
  "/en/request",
  "/en/requests",
  "/en/volunteer/dashboard",
];

// Public routes that should be blocked for logged-in users
const AUTH_ROUTES = [
  "/en/signin",
  "/en/admin-signup",
  "/en/user-signup",
  "/en/volunteer-signup",
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );
  const isAuthRoute = AUTH_ROUTES.some((p) =>
    pathname.startsWith(p)
  );

  console.log("🧭 Middleware hit:", pathname);
  console.log("👤 Session user:", session?.user?.id);

  // --- LOGGED-IN USER accessing signin/signup → redirect to home ---
  if (session && isAuthRoute) {
    console.log("🚫 Logged-in user accessing auth page → redirecting to /en");
    return NextResponse.redirect(new URL("/en", req.url));
  }

  // --- PUBLIC ROUTE (not protected) → allow ---
  if (!isProtected) return res;

  // --- NO SESSION → LOGIN ---
  if (!session) {
    console.log("🚫 No session → redirecting to /en/signin");
    return NextResponse.redirect(new URL("/en/signin", req.url));
  }

  // --- ROLE LOGIC ---
  const metadata = session.user.user_metadata;
  const role = metadata?.role;
  const isAdmin = role === "admin";
  const isVolunteer = role === "volunteer";

  console.log("🔐 Role:", role);

  // --- VOLUNTEER DASHBOARD ---
  if (pathname.startsWith("/en/volunteer/dashboard")) {
    if (!isVolunteer) {
      console.log("🚫 Not volunteer → /unauthorized");
      return NextResponse.redirect(new URL("/en/unauthorized", req.url));
    }
    console.log("✅ Volunteer access granted → dashboard");
    return res;
  }

  // --- REQUEST LIST PAGE (admin only) ---
  const segments = pathname.split("/").filter(Boolean);
  const isListPage = segments.length === 2 && segments[1] === "request";
  const isDetailPage = segments.length === 3 && segments[1] === "requests";

  if (isListPage) {
    if (!isAdmin)
      return NextResponse.redirect(new URL("/en/unauthorized", req.url));
    return res;
  }

  // --- REQUEST DETAIL PAGE (admin or assigned volunteer) ---
  if (isDetailPage) {
    if (isAdmin) return res;

    const requestId = segments[2];
    const { data: request, error } = await supabase
      .from("requests")
      .select("assigned_to")
      .eq("id", requestId)
      .single();

    if (error || request?.assigned_to !== session.user.id) {
      return NextResponse.redirect(new URL("/en/unauthorized", req.url));
    }
    return res;
  }
  return NextResponse.redirect(new URL("/en/unauthorized", req.url));
}

export const config = {
  matcher: [
    "/en/request/:path*",
    "/en/requests/:path*",
    "/en/volunteer/dashboard",
    "/en/signin",
    "/en/admin-signup",
    "/en/user-signup",
    "/en/volunteer-signup",
  ],
};
