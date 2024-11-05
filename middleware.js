import { NextResponse } from "next/server";

export async function middleware(req) {
  const authToken = req.cookies.get("auth_token");

  console.log("Middleware - Current path:", req.nextUrl.pathname);
  console.log("Middleware - Auth token exists:", !!authToken);

  // If no auth token and trying to access dashboard, redirect to login
  if (!authToken?.value && req.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("Middleware - No auth token, redirecting to auth");
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // If auth token exists and trying to access auth page, redirect to dashboard
  if (authToken?.value && req.nextUrl.pathname.startsWith("/auth")) {
    console.log("Middleware - Has auth token, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
