import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["request", "requests", "volunteer/dashboard"] as const;
const AUTH_ROUTES = ["signin", "admin-signup", "user-signup", "volunteer-signup"] as const;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Extract locale and path
  const segments = pathname.split("/").filter(Boolean); // ["en", "volunteer-signup"]
  const locale = segments[0]; // en, fr, etc.
  const pathWithoutLocale = segments.slice(1).join("/"); // volunteer-signup, request/123 etc.

  // Redirect / -> /en
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en", req.url));
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathWithoutLocale.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathWithoutLocale === p);

  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // --------------------
  // Auth Routes
  // --------------------
  if (isAuthRoute) {
    if (session) {
      // Prevent donors from accessing volunteer signup
      if (pathWithoutLocale === "volunteer-signup" && session.user.user_metadata?.role === "donor") {
        return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
      }
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
    return res;
  }

  // --------------------
  // Protected Routes
  // --------------------
  if (isProtected) {
    if (!session) {
      return NextResponse.redirect(new URL(`/${locale}/signin`, req.url));
    }

    const role = session.user.user_metadata?.role;
    const isAdmin = role === "admin";
    const isVolunteer = role === "volunteer";

    // Volunteer dashboard
    if (pathWithoutLocale.startsWith("volunteer/dashboard")) {
      if (!isVolunteer) {
        return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
      }
      return res;
    }

    // Single request page for admin
    if (pathWithoutLocale === "request") {
      if (!isAdmin) {
        return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
      }
      return res;
    }

    // Requests list page
    if (pathWithoutLocale.startsWith("requests/")) {
      if (isAdmin) return res;

      const requestId = pathWithoutLocale.split("/")[1];
      const { data: request } = await supabase
        .from("requests")
        .select("assigned_to")
        .eq("id", requestId)
        .single();

      if (!request || request.assigned_to !== session.user.id) {
        return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
      }
      return res;
    }

    return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/:locale/request/:path*",
    "/:locale/requests/:path*",
    "/:locale/volunteer/dashboard",
    "/:locale/signin",
    "/:locale/admin-signup",
    "/:locale/user-signup",
    "/:locale/volunteer-signup",
  ],
};
