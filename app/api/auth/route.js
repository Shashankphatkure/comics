import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body;

  try {
    // Query the admin_users table
    const { data: user, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .eq("password", password) // Note: In production, use hashed passwords!
      .single();

    if (error || !user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create a response with the auth token
    const response = NextResponse.json(
      { success: true, message: "Login successful", user },
      { status: 200 }
    );

    // Set HTTP-only cookie for authentication
    response.cookies.set("auth_token", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
