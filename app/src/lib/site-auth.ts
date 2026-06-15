import { createHmac, timingSafeEqual } from "node:crypto";

export const AUTH_COOKIE_NAME = "site-auth";

export function isSiteAuthEnabled(): boolean {
  return Boolean(process.env.SITE_ACCESS_PASSWORD?.trim());
}

export function getExpectedAuthToken(): string | null {
  const password = process.env.SITE_ACCESS_PASSWORD?.trim();
  const secret = process.env.AUTH_SECRET?.trim();
  if (!password || !secret) return null;
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function isValidAuthCookie(cookie: string | undefined): boolean {
  if (!isSiteAuthEnabled()) return true;
  const expected = getExpectedAuthToken();
  if (!expected || !cookie) return false;
  try {
    const a = Buffer.from(cookie, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function authCookieOptions() {
  return {
    name: AUTH_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };
}
