import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Fetch all users from auth.users
    const { data: authUsers, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    // Filter for pending admins (role = admin AND is_active = false)
    const pendingAdmins = authUsers.users
      .filter((user:any) => {
        const metadata = user.user_metadata;
        return metadata?.role === "admin" && metadata?.is_active === false;
      })
      .map((user:any) => ({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        phone: user.user_metadata?.phone || null,
        created_at: user.created_at,
      }));

    return NextResponse.json({ pendingAdmins });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
