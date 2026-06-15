import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  authCookieOptions,
  getExpectedAuthToken,
  isSiteAuthEnabled,
} from "@/lib/site-auth";

function passwordsMatch(submitted: string, expected: string): boolean {
  const a = Buffer.from(submitted, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!isSiteAuthEnabled()) {
    return NextResponse.json({ ok: true });
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const password = body.password?.trim();
  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const sitePassword = process.env.SITE_ACCESS_PASSWORD?.trim();
  if (!sitePassword) {
    return NextResponse.json({ error: "Site auth is not configured" }, { status: 500 });
  }

  if (!passwordsMatch(password, sitePassword)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = getExpectedAuthToken();
  if (!token) {
    return NextResponse.json({ error: "AUTH_SECRET is not configured" }, { status: 500 });
  }

  const opts = authCookieOptions();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(opts.name, token, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    maxAge: opts.maxAge,
    path: opts.path,
  });
  return response;
}
