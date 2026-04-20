import Link from "next/link";
import { APP_NAME } from "@/lib/mock-data";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/athlete", label: "Athlete" },
  { href: "/athlete/voice", label: "Voice" },
  { href: "/athlete/sparks", label: "Sparks" },
  { href: "/guide", label: "Guide" },
  { href: "/reporter", label: "Reporter" },
];

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="app-grid min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/8 bg-[#091522]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-gold">
              {APP_NAME}
            </p>
            <p className="text-sm text-white/70">
              JOJ Dakar 2026 demo web app
            </p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm text-white/70">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/8 px-4 py-2 transition hover:border-gold/40 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-5 py-8 md:px-8 md:py-10">
        <section className="hero-ring glass-card rounded-[28px] px-6 py-7 md:px-8 md:py-9">
          <p className="mb-3 text-xs uppercase tracking-[0.34em] text-gold">
            {eyebrow}
          </p>
          <div className="grid gap-4 lg:grid-cols-[1.5fr,0.9fr]">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-white/72 md:text-lg">
                {description}
              </p>
            </div>
            <div className="grid gap-3 rounded-3xl border border-white/8 bg-white/4 p-4">
              <div className="rounded-2xl border border-gold/20 bg-gold/10 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-gold">
                  Demo proof
                </p>
                <p className="mt-2 text-sm leading-7 text-white/80">
                  Le MVP reste fonctionnel meme si une API externe tombe, grace
                  aux donnees mock et aux fallbacks locaux.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-white/8 bg-card-strong p-3">
                  <p className="text-2xl font-semibold">4</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/55">
                    Modules
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-card-strong p-3">
                  <p className="text-2xl font-semibold">206</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/55">
                    Pays
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-card-strong p-3">
                  <p className="text-2xl font-semibold">2700</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/55">
                    Athletes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {children}
      </main>
    </div>
  );
}
