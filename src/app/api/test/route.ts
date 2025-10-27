import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supbaseServer";

export async function GET() {
  const { data, error } = await supabaseServer.from("users").select("*").limit(1);

  if (error) {
    return NextResponse.json({ success: false, error: error.message });
  }

  return NextResponse.json({ success: true, message: "Supabase connected!", data });
}
