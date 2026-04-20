"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SPARK_STATUS_STORAGE_KEY,
  athleteById,
  detectSuggestions,
  sparks,
} from "@/lib/mock-data";

type StatusMap = Record<string, string>;

export function ReporterDashboard() {
  const [statuses, setStatuses] = useState<StatusMap>({});

  useEffect(() => {
    const sync = () => setStatuses(readStatuses());
    const timeoutId = window.setTimeout(sync, 0);
    window.addEventListener("storage", sync);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const cards = useMemo(
    () =>
      sparks.map((spark) => ({
        ...spark,
        statut: (statuses[spark.id] ?? spark.statut) as
          | "pending"
          | "accepted"
          | "declined"
          | "completed",
      })),
    [statuses],
  );

  const hotStory = cards.find(
    (spark) => spark.type === "teranga" && spark.score >= 90 && spark.statut === "accepted",
  );

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <section className="glass-card rounded-[28px] p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan">Sparks du jour</p>
        <h2 className="mt-2 text-2xl font-semibold">Flux temps reel</h2>
        <div className="mt-5 grid gap-4">
          {cards.map((spark) => {
            const athlete1 = athleteById[spark.athlete1Id];
            const athlete2 = athleteById[spark.athlete2Id];
            return (
              <div key={spark.id} className="rounded-3xl border border-white/8 bg-white/4 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      {athlete1.nom} + {athlete2.nom}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/55">
                      {spark.type} - {spark.score}%
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                      spark.statut === "accepted"
                        ? "bg-green/12 text-green"
                        : spark.statut === "declined"
                          ? "bg-red/10 text-red"
                          : "bg-white/8 text-white/65"
                    }`}
                  >
                    {spark.statut}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="glass-card rounded-[28px] p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-red">Alerte story forte</p>
        <h2 className="mt-2 text-2xl font-semibold">Detection automatique</h2>
        {hotStory ? (
          <div className="mt-5 rounded-[28px] border border-red/25 bg-red/10 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-red">Histoire detectee</p>
            <h3 className="mt-3 text-xl font-semibold">
              {athleteById[hotStory.athlete1Id].nom} et {athleteById[hotStory.athlete2Id].nom}
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/80">
              Un Spark Teranga a ete accepte. Le lien commun est deja tres fort et merite un
              suivi journaliste.
            </p>
            <button className="mt-5 rounded-full bg-red px-4 py-3 text-sm font-semibold text-[#091522]">
              Demander acces
            </button>
          </div>
        ) : (
          <div className="mt-5 rounded-[28px] border border-dashed border-white/12 bg-white/3 p-5 text-sm leading-7 text-white/68">
            Acceptez un Spark Teranga cote athlete pour faire remonter une alerte story forte ici.
          </div>
        )}
      </section>

      <section className="glass-card rounded-[28px] p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">Briefing interview</p>
        <h2 className="mt-2 text-2xl font-semibold">Questions suggerees</h2>
        <div className="mt-5 rounded-[28px] border border-white/8 bg-white/4 p-5">
          <p className="text-sm leading-7 text-white/78">
            Ne demandez pas seulement comment l&apos;athlete se sent. Entrez par une emotion, une
            famille, un pays, un manque ou un geste precis.
          </p>
          <div className="mt-4 grid gap-3">
            {[
              "Quand tu parles de ta famille, qu'est-ce qui revient en premier ?",
              "Quel moment t'a fait sentir que tu etais vraiment a Dakar 2026 ?",
              "Qu'est-ce qu'un autre athlete pourrait comprendre de ton histoire ?",
            ].map((question) => (
              <div key={question} className="rounded-2xl border border-white/8 bg-[#091522] p-4 text-sm">
                {question}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {detectSuggestions("visiter transport restaurant").map((tag) => (
              <span key={tag} className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-cyan">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function readStatuses(): StatusMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(SPARK_STATUS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StatusMap) : {};
  } catch {
    return {};
  }
}
