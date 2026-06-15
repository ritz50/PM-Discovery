export const AUTH_COOKIE_NAME = "site-auth";

export function isSiteAuthEnabled(): boolean {
  return Boolean(process.env.SITE_ACCESS_PASSWORD?.trim());
}

export async function getExpectedAuthToken(): Promise<string | null> {
  const password = process.env.SITE_ACCESS_PASSWORD?.trim();
  const secret = process.env.AUTH_SECRET?.trim();
  if (!password || !secret) return null;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(password));
  return [...new Uint8Array(signature)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function isValidAuthCookie(cookie: string | undefined): Promise<boolean> {
  if (!isSiteAuthEnabled()) return true;
  const expected = await getExpectedAuthToken();
  if (!expected || !cookie) return false;
  return timingSafeEqualString(cookie, expected);
}
