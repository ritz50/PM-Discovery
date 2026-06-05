"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Doc = { id: string; title: string; body: string; href: string; type: string };

export function ClientReference({ documents }: { documents: Doc[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return documents.slice(0, 20);
    const q = query.toLowerCase();
    return documents
      .filter((d) => d.title.toLowerCase().includes(q) || d.body.toLowerCase().includes(q))
      .slice(0, 30);
  }, [documents, query]);

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Search modules, concepts, frameworks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input"
      />
      <ul className="space-y-2">
        {results.map((d) => (
          <li key={`${d.type}-${d.id}`}>
            <Link href={d.href} className="card card-interactive block p-4 no-underline">
              <span
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: "var(--blue-electric)" }}
              >
                {d.type}
              </span>
              <p className="mt-1 font-medium" style={{ color: "var(--fg)" }}>
                {d.title}
              </p>
              <p className="mt-1 text-sm line-clamp-2" style={{ color: "var(--muted)" }}>
                {d.body.slice(0, 120)}...
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
