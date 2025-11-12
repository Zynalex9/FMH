import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/en/request",
  "/en/requests",
  "/en/volunteer/dashboard",
] as const;

const AUTH_ROUTES = [
  "/en/signin",
  "/en/admin-signup",
  "/en/user-signup",
  "/en/volunteer-signup",
] as const;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en", req.url));
  }
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (isAuthRoute) {
    if (session) {
      return NextResponse.redirect(new URL("/en", req.url));
    }
    return res; 
  }
  if (isProtected) {
    if (!session) {
      return NextResponse.redirect(new URL("/en/signin", req.url));
    }
    const role = session.user.user_metadata?.role;
    const isAdmin = role === "admin";
    const isVolunteer = role === "volunteer";
    const segments = pathname.split("/").filter(Boolean);
    if (pathname.startsWith("/en/volunteer/dashboard")) {
      if (!isVolunteer) {
        return NextResponse.redirect(new URL("/en/unauthorized", req.url));
      }
      return res;
    }

    if (segments.length === 2 && segments[1] === "request") {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/en/unauthorized", req.url));
      }
      return res;
    }
    if (segments.length === 3 && segments[1] === "requests") {
      if (isAdmin) return res;

      const requestId = segments[2];
      const { data: request } = await supabase
        .from("requests")
        .select("assigned_to")
        .eq("id", requestId)
        .single();

      if (!request || request.assigned_to !== session.user.id) {
        return NextResponse.redirect(new URL("/en/unauthorized", req.url));
      }
      return res;
    }
    return NextResponse.redirect(new URL("/en/unauthorized", req.url));
  }

  return res;
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
