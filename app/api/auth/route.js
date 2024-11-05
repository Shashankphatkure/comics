import { NextResponse } from "next/server";

// This would normally be in a secure database
const VALID_CREDENTIALS = {
  email: "admin@example.com",
  password: "admin123",
};

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body;

  if (
    email === VALID_CREDENTIALS.email &&
    password === VALID_CREDENTIALS.password
  ) {
    // Create a response with the auth token
    const response = NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );

    // Set HTTP-only cookie for authentication
    response.cookies.set("auth_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  }

  return NextResponse.json(
    { success: false, message: "Invalid credentials" },
    { status: 401 }
  );
}
