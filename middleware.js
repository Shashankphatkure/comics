import { NextResponse } from "next/server";

export async function middleware(req) {
  const authToken = req.cookies.get("auth_token");

  // If no auth token and trying to access dashboard, redirect to login
  if (!authToken?.value && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // If auth token exists, verify it
  if (authToken?.value) {
    try {
      const response = await fetch(`${req.nextUrl.origin}/api/auth/verify`, {
        headers: {
          Cookie: `auth_token=${authToken.value}`,
        },
      });

      if (!response.ok) {
        // If token is invalid and trying to access dashboard, redirect to login
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return NextResponse.redirect(new URL("/auth", req.url));
        }
      } else if (req.nextUrl.pathname.startsWith("/auth")) {
        // If token is valid and trying to access auth page, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (error) {
      console.error("Token verification error:", error);
      // On error, redirect to login if trying to access dashboard
      if (req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/auth", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
