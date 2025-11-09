import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  await supabase.auth.signOut();

  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: process.env.SUPABASE_PROJECT_NAME!,
    value: "",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
