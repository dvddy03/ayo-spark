import Link from "next/link";
import { PageShell } from "@/components/page-shell";

const modules = [
  {
    href: "/guide/translate",
    title: "Interpreteur temps reel",
    accent: "text-orange",
    description:
      "Traduire un message entre deux langues, avec support demo du wolof et historique local.",
  },
  {
    href: "/guide/chat",
    title: "Guide local JOJ",
    accent: "text-gold",
    description:
      "Poser une question sur les transports, restaurants, urgences et sorties autour de Dakar 2026.",
  },
];

export default function GuideHubPage() {
  return (
    <PageShell
      eyebrow="Module 4 - AYO GUIDE"
      title="Deux experiences dans une seule entree : interpreteur et guide local"
      description="AYO GUIDE sert autant a se comprendre qu'a s'orienter. Le hub ci-dessous vous envoie soit vers la traduction, soit vers le chatbot de terrain."
    >
      <section className="grid gap-5 md:grid-cols-2">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="glass-card rounded-[28px] p-6 transition hover:-translate-y-1"
          >
            <p className={`text-xs uppercase tracking-[0.28em] ${module.accent}`}>
              AYO GUIDE
            </p>
            <h2 className="mt-3 text-2xl font-semibold">{module.title}</h2>
            <p className="mt-4 text-sm leading-7 text-white/72">{module.description}</p>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
