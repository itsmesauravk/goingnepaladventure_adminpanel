// src/lib/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Optional: Add token verification logic here
  // You might want to call your backend to verify the token

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/home/:path*",
    "/trekkings/:path*",
    "/tours/:path*",
    "/wellness/:path*",
    "/blogs/:path*",
    "/activities/:path*",
    "/plan-trip/:path*",
    "/requests-mails/:path*",
    "/users-info/:path*",
  ],
}
