"use client";

import { useEffect, useState } from "react";
import {
  SPARK_STATUS_STORAGE_KEY,
  type Athlete,
  athleteById,
  getFlagEmoji,
  getSparkTypeLabel,
  sparks,
  type Spark,
} from "@/lib/mock-data";

type StatusMap = Record<string, "pending" | "accepted" | "declined" | "completed">;

export function SparksBoard() {
  const [items, setItems] = useState<Spark[]>(sparks);
  const [athletesMap, setAthletesMap] = useState<Record<string, Athlete>>(athleteById);
  const [statuses, setStatuses] = useState<StatusMap>({});

  useEffect(() => {
    const sync = async () => {
      setStatuses(readStatuses());
      const [nextSparks, nextAthletes] = await Promise.all([
        loadSparks(),
        loadAthletes(),
      ]);
      setItems(nextSparks);
      setAthletesMap(buildAthletesMap(nextAthletes));
    };

    const timeoutId = window.setTimeout(() => {
      void sync();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function updateStatus(id: string, statut: StatusMap[string]) {
    const next = { ...statuses, [id]: statut };
    setStatuses(next);
    localStorage.setItem(SPARK_STATUS_STORAGE_KEY, JSON.stringify(next));

    try {
      const response = await fetch("/api/sparks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, statut }),
      });

      const payload = (await response.json()) as {
        spark?: Spark | null;
      };

      if (payload.spark) {
        setItems((current) =>
          current.map((spark) => (spark.id === payload.spark?.id ? payload.spark : spark)),
        );
      }
    } catch {
      // Local fallback is already applied above.
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {items.map((spark) => {
        const athlete1 = resolveAthlete(athletesMap, spark.athlete1Id);
        const athlete2 = resolveAthlete(athletesMap, spark.athlete2Id);
        const currentStatus = statuses[spark.id] ?? spark.statut;
        return (
          <article
            key={spark.id}
            className="glass-card rounded-[28px] p-6 transition hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={`text-xs uppercase tracking-[0.28em] ${
                    spark.type === "teranga"
                      ? "text-green"
                      : spark.type === "culturel"
                        ? "text-cyan"
                        : "text-orange"
                  }`}
                >
                  {getSparkTypeLabel(spark.type)}
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  {athlete1.nom} + {athlete2.nom}
                </h3>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-right">
                <p className="text-2xl font-semibold">{spark.score}%</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">
                  Score
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-sm text-white/74">
              <span className="rounded-full border border-white/8 px-3 py-2">
                {getFlagEmoji(athlete1.codePays)} {athlete1.sport}
              </span>
              <span className="rounded-full border border-white/8 px-3 py-2">
                {getFlagEmoji(athlete2.codePays)} {athlete2.sport}
              </span>
              {(athlete1.estRefugie || athlete2.estRefugie) && (
                <span className="rounded-full border border-green/25 bg-green/12 px-3 py-2 text-green">
                  Equipe Refugees prioritaire
                </span>
              )}
            </div>

            <p className="mt-5 text-sm leading-7 text-white/74">
              {spark.lienCommun}
            </p>

            <div className="mt-5 h-3 rounded-full bg-white/8">
              <div
                className={`h-3 rounded-full ${
                  spark.type === "teranga"
                    ? "bg-green"
                    : spark.type === "culturel"
                      ? "bg-cyan"
                      : "bg-orange"
                }`}
                style={{ width: `${spark.score}%` }}
              />
            </div>

            {currentStatus === "accepted" ? (
              <div className="mt-5 rounded-3xl border border-green/25 bg-green/12 p-4">
                <p className="text-xs uppercase tracking-[0.26em] text-green">
                  Connexion etablie
                </p>
                <p className="mt-3 text-sm leading-7 text-white/80">
                  Rendez-vous suggere : {spark.lieuSuggere} a {spark.heureSuggeree}.
                </p>
              </div>
            ) : currentStatus === "declined" ? (
              <div className="mt-5 rounded-3xl border border-red/25 bg-red/10 p-4 text-sm text-white/78">
                Spark decline. Vous pouvez revenir plus tard.
              </div>
            ) : (
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => updateStatus(spark.id, "accepted")}
                  className="flex-1 rounded-full bg-gold px-4 py-3 text-sm font-semibold text-[#091522] transition hover:brightness-110"
                >
                  Accepter ce Spark
                </button>
                <button
                  onClick={() => updateStatus(spark.id, "declined")}
                  className="rounded-full border border-white/10 px-4 py-3 text-sm text-white/74 transition hover:border-white/30 hover:text-white"
                >
                  Refuser
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

async function loadSparks() {
  try {
    const response = await fetch("/api/sparks", { cache: "no-store" });
    const payload = (await response.json()) as { sparks?: Spark[] };
    return payload.sparks ?? sparks;
  } catch {
    return sparks;
  }
}

async function loadAthletes() {
  try {
    const response = await fetch("/api/athletes", { cache: "no-store" });
    const payload = (await response.json()) as { athletes?: Athlete[] };
    return payload.athletes ?? [];
  } catch {
    return [];
  }
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

function buildAthletesMap(athletes?: Athlete[]) {
  if (!athletes || athletes.length === 0) {
    return athleteById;
  }

  return Object.fromEntries(athletes.map((athlete) => [athlete.id, athlete]));
}

function resolveAthlete(
  athletesMap: Record<string, Athlete>,
  athleteId: string,
): Athlete {
  return (
    athletesMap[athleteId] ?? {
      id: athleteId,
      slug: athleteId,
      nom: "Athlete inconnu",
      pays: "Inconnu",
      codePays: "RF",
      sport: "Sport inconnu",
      langueNative: "fr",
      type: "athlete",
      positionActuelle: "Diamniadio",
      emotionPrincipale: "Profil indisponible",
    }
  );
}
