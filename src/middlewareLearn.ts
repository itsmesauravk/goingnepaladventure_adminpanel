import axios from "axios"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const pathname = new URL(request.url).pathname

  // Paths where authentication should not redirect
  const publicPaths = ["/login", "/forgot-password"]

  // If the user is already authenticated, allow access to login or forgot-password pages
  if (token && publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/home", request.url)) // Redirect to home or dashboard
  }

  // If no token, redirect to login (unless it's a public path)
  if (!token && !publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

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
    "/login", // Include login in matcher
    "/forgot-password", // Include forgot-password in matcher
  ],
}
