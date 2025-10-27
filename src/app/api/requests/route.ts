import { supabaseServer } from "@/lib/supbaseServer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, error } = await supabaseServer.from("requests").insert(body);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
