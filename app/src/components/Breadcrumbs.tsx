import Link from "next/link";

export type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <span style={{ color: "var(--muted)" }} aria-hidden>
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link href={item.href} className="no-underline hover:underline" style={{ color: "var(--muted)" }}>
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: isLast ? "var(--fg)" : "var(--muted)" }}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-1 text-sm no-underline hover:underline"
      style={{ color: "var(--muted)" }}
    >
      ← {label}
    </Link>
  );
}
