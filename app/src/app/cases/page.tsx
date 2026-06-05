import Link from "next/link";
import { getCaseStudy, getCaseStudyIds } from "@/lib/content";
import { PageHeader } from "@/components/ui";

export default function CasesPage() {
  const ids = getCaseStudyIds();
  return (
    <div>
      <PageHeader
        title="Case Studies"
        subtitle="Apply discovery frameworks to realistic scenarios from helloPM and industry."
      />
      <ul className="space-y-3">
        {ids.map((id) => {
          const c = getCaseStudy(id);
          return c ? (
            <li key={id}>
              <Link href={`/cases/${id}`} className="card card-interactive block p-4 no-underline">
                <p className="font-medium" style={{ color: "var(--fg)" }}>
                  {c.title}
                </p>
              </Link>
            </li>
          ) : null;
        })}
      </ul>
    </div>
  );
}
