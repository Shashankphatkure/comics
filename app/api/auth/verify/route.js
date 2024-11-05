import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token");

  if (!authToken) {
    return NextResponse.json(
      { success: false, message: "No auth token" },
      { status: 401 }
    );
  }

  try {
    const { data: user, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", authToken.value)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
