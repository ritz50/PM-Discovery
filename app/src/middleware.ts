import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE_NAME,
  isSiteAuthEnabled,
  isValidAuthCookie,
} from "@/lib/site-auth-edge";

export async function middleware(request: NextRequest) {
  if (!isSiteAuthEnabled()) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (await isValidAuthCookie(cookie)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/home",
    "/topics/:path*",
    "/recall",
    "/interview",
    "/cases/:path*",
    "/progress",
    "/learn/:path*",
    "/quiz/:path*",
    "/reference",
    "/frameworks/:path*",
    "/gaps",
  ],
};
