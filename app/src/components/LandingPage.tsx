import { LinkButton } from "./ui";

const modes = [
  { title: "Learn", description: "Browse topics by phase, read lessons, and study concepts with real examples." },
  { title: "Active recall", description: "Review flashcards for concepts you've studied." },
  { title: "Mock interview", description: "Practice PM answers with rubrics and self-rating." },
  { title: "Case studies", description: "Apply discovery frameworks to realistic scenarios." },
];

export function LandingPage() {
  return (
    <div className="space-y-12">
      <header className="max-w-2xl">
        <h1 className="page-title">PM Discovery Guide</h1>
        <p className="page-subtitle mt-3">
          Learn product discovery through concepts, case studies, practice questions, and skill-gap
          reflection.
        </p>
      </header>

      <section>
        <h2 className="section-title mb-4">What you can do</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {modes.map((mode) => (
            <li
              key={mode.title}
              className="card p-4"
            >
              <h3 className="font-medium" style={{ color: "var(--fg)" }}>
                {mode.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {mode.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card card-gradient p-6">
        <h2 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
          Private beta
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          Access is by invitation. If you saw this on LinkedIn and want to try it, message me for
          the access password.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <LinkButton href="/login">Have a password? Enter here</LinkButton>
        </div>
      </section>
    </div>
  );
}
