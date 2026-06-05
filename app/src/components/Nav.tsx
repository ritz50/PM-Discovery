"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const practiceLinks = [
  { href: "/topics", label: "Learn" },
  { href: "/recall", label: "Recall" },
  { href: "/interview", label: "Interview" },
  { href: "/cases", label: "Cases" },
];

const secondaryLinks = [
  { href: "/progress", label: "Progress" },
  { href: "/reference", label: "Reference" },
];

function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const active =
    pathname === href ||
    (href !== "/" && pathname.startsWith(href)) ||
    (href === "/topics" && pathname.startsWith("/learn"));

  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-1.5 text-sm no-underline transition-colors"
      style={{
        color: active ? "var(--fg)" : "var(--muted)",
        background: active ? "var(--accent-soft)" : "transparent",
        border: active ? "1px solid rgba(27, 77, 254, 0.35)" : "1px solid transparent",
      }}
    >
      {label}
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();
  const homeActive = pathname === "/";

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        borderColor: "var(--border)",
        background: "rgba(11, 6, 24, 0.85)",
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3 md:gap-5 md:px-6">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: "var(--gradient-brand)" }}
          >
            PM
          </span>
          <span className="font-semibold tracking-tight" style={{ color: "var(--fg)" }}>
            Discovery
          </span>
        </Link>

        <div
          className="hidden h-5 w-px sm:block"
          style={{ background: "var(--border)" }}
          aria-hidden
        />

        <div className="flex flex-wrap gap-1">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-sm no-underline transition-colors"
            style={{
              color: homeActive ? "var(--fg)" : "var(--muted)",
              background: homeActive ? "var(--accent-soft)" : "transparent",
              border: homeActive ? "1px solid rgba(27, 77, 254, 0.35)" : "1px solid transparent",
            }}
          >
            Home
          </Link>
          {practiceLinks.map((l) => (
            <NavLink key={l.href} {...l} pathname={pathname} />
          ))}
        </div>

        <div
          className="hidden h-5 w-px md:block"
          style={{ background: "var(--border)" }}
          aria-hidden
        />

        <div className="flex flex-wrap gap-1">
          {secondaryLinks.map((l) => (
            <NavLink key={l.href} {...l} pathname={pathname} />
          ))}
        </div>
      </div>
    </nav>
  );
}
