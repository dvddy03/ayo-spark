import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import {
  DEMO_ATHLETE_ID,
  athleteById,
  getFlagEmoji,
  quickLinks,
} from "@/lib/mock-data";

export default function AthleteDashboardPage() {
  const athlete = athleteById[DEMO_ATHLETE_ID];

  return (
    <PageShell
      eyebrow="Dashboard athlete"
      title={`${athlete.nom} - profil de demo prioritaire pour le jury`}
      description="Le parcours athlete est deja jouable : journal emotionnel, acceptation de sparks, acces au guide local et lecture d'une capsule narrative. Pour la scene, Hassan Omar reste le meilleur fil conducteur."
    >
      <section className="grid gap-5 lg:grid-cols-[0.9fr,1.1fr]">
        <article className="glass-card rounded-[28px] p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Profil</p>
          <div className="mt-4 rounded-[28px] border border-white/8 bg-white/4 p-5">
            <p className="text-3xl font-semibold">{athlete.nom}</p>
            <p className="mt-2 text-sm text-white/64">
              {getFlagEmoji(athlete.codePays)} {athlete.pays} - {athlete.sport}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-green/20 bg-green/12 px-3 py-2 text-xs uppercase tracking-[0.18em] text-green">
                Equipe Refugees
              </span>
              <span className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/72">
                {athlete.langueNative.toUpperCase()}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/72">
                {athlete.positionActuelle}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/76">
              Emotion cle : {athlete.emotionPrincipale}. Ce profil est ideal pour demonstrer
              la puissance de Teranga Spark et de la Capsule Narrative.
            </p>
          </div>
        </article>

        <section className="grid gap-5 md:grid-cols-2">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="glass-card rounded-[28px] p-6 transition hover:-translate-y-1"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                Module
              </p>
              <p className="mt-3 text-2xl font-semibold">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>
            </Link>
          ))}
        </section>
      </section>
    </PageShell>
  );
}
