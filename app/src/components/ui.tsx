import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-8">
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle mt-2">{subtitle}</p>}
    </header>
  );
}

export function Card({
  children,
  className = "",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div className={`card p-4 ${interactive ? "card-interactive" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Card className="card-gradient">
      <p className="stat-label">{label}</p>
      <p className="stat-value mt-1">{value}</p>
    </Card>
  );
}

export function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="section-title">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "rating";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const variantClass =
    variant === "primary" ? "btn btn-primary" : variant === "ghost" ? "btn btn-ghost" : "btn-rating";
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${variantClass} ${className}`}>
      {children}
    </button>
  );
}

export function LinkButton({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`btn btn-primary no-underline ${className}`}>
      {children}
    </Link>
  );
}

export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`text-sm font-medium text-[#93c5fd] hover:text-[#bfdbfe] no-underline ${className}`}>
      {children}
    </Link>
  );
}
