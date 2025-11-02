import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { access_token, refresh_token } = await request.json();
  const cookieStore = cookies();

  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Set the session
  await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  return NextResponse.json({ success: true });
}