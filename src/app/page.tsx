import Link from "next/link";
import { DemoSignIn } from "@/components/demo-sign-in";
import { PageShell } from "@/components/page-shell";
import { athletes, getFlagEmoji, quickLinks } from "@/lib/mock-data";

const accentClass: Record<string, string> = {
  gold: "text-gold border-gold/18 bg-gold/10",
  green: "text-green border-green/18 bg-green/10",
  cyan: "text-cyan border-cyan/18 bg-cyan/10",
  orange: "text-orange border-orange/18 bg-orange/10",
  purple: "text-purple border-purple/18 bg-purple/10",
  red: "text-red border-red/18 bg-red/10",
};

export default function HomePage() {
  return (
    <PageShell
      eyebrow="Hackathon JOJ Innovation Challenge"
      title="AYO SPARK transforme une simple web app de demo en experience olympique, humaine et credible des la premiere minute."
      description="Pour le jury, l'enjeu n'est pas seulement de voir des ecrans. Il faut sentir un vrai produit. Cette nouvelle entree ajoute une authentification de demonstration, des profils incarnes et une narration plus claire autour des 4 modules."
    >
      <DemoSignIn />

      <section className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="glass-card rounded-[28px] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Proposition</p>
          <h2 className="mt-2 text-3xl font-semibold">
            2 700 athletes. 206 pays. 13 jours. Personne ne se parle vraiment.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/74">
            AYO SPARK rend visibles les emotions, provoque les bonnes rencontres, aide les
            reporters a trouver les histoires fortes et accompagne les athletes dans Dakar,
            Diamniadio et Saly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/athlete"
              className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-[#091522]"
            >
              Voir le parcours athlete
            </Link>
            <Link
              href="/reporter"
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/75"
            >
              Voir le parcours reporter
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-[28px] p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan">Profils demo</p>
          <div className="mt-4 grid gap-3">
            {athletes.map((athlete) => (
              <div
                key={athlete.id}
                className="rounded-[24px] border border-white/8 bg-white/4 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">{athlete.nom}</p>
                    <p className="mt-1 text-sm text-white/60">
                      {getFlagEmoji(athlete.codePays)} {athlete.pays} - {athlete.sport}
                    </p>
                  </div>
                  {athlete.estRefugie ? (
                    <span className="rounded-full bg-green/12 px-3 py-2 text-xs uppercase tracking-[0.18em] text-green">
                      Refugees
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  {athlete.emotionPrincipale}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="glass-card rounded-[28px] p-6 transition hover:-translate-y-1"
          >
            <span
              className={`inline-flex rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] ${accentClass[link.accent] ?? accentClass.gold}`}
            >
              {link.title}
            </span>
            <p className="mt-4 text-xl font-semibold">{link.title}</p>
            <p className="mt-3 text-sm leading-7 text-white/72">{link.description}</p>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
