import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Use service role key to update auth.users metadata
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: "Missing userId or action" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Update user metadata to set is_active = true
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { is_active: true },
      });

      if (error) {
        console.error("Error approving admin:", error);
        return NextResponse.json(
          { error: "Failed to approve admin" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: "Admin approved" });
    }

    if (action === "reject") {
      // Delete the user entirely
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (error) {
        console.error("Error rejecting admin:", error);
        return NextResponse.json(
          { error: "Failed to reject admin" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: "Admin rejected and deleted" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
