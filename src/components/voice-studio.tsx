"use client";

import { useMemo, useState } from "react";
import {
  DEMO_ATHLETE_ID,
  JOURNAL_STORAGE_KEY,
  athleteById,
  type VoiceAnalysis,
  voiceSamples,
} from "@/lib/mock-data";

type SavedJournal = {
  athleteId: string;
  transcription: string;
  extrait: string;
  themes: string[];
  createdAt: string;
};

export function VoiceStudio() {
  const [selectedSample, setSelectedSample] = useState(voiceSamples[0]);
  const [athleteId, setAthleteId] = useState(DEMO_ATHLETE_ID);
  const [journal, setJournal] = useState(voiceSamples[0].text);
  const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentAthlete = useMemo(
    () => athleteById[athleteId] ?? athleteById[DEMO_ATHLETE_ID],
    [athleteId],
  );

  async function handleAnalyze() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcription: journal,
          langue: currentAthlete.langueNative,
          athleteId,
        }),
      });

      const data = (await response.json()) as VoiceAnalysis;
      setAnalysis(data);

      const existing = readJournals();
      const nextEntry: SavedJournal = {
        athleteId,
        transcription: journal,
        extrait: data.extrait_fort,
        themes: data.themes,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(
        JOURNAL_STORAGE_KEY,
        JSON.stringify([nextEntry, ...existing].slice(0, 8)),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
      <section className="glass-card rounded-[28px] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-red">
              AYO VOICE
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Journal intime en mode demo texte
            </h2>
          </div>
          <div className="rounded-full border border-red/25 bg-red/10 px-4 py-2 text-sm text-white/80">
            Audio complet a brancher avec OpenAI plus tard
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-white/65">Profil athlete</span>
            <select
              value={athleteId}
              onChange={(event) => setAthleteId(event.target.value)}
              className="rounded-2xl border border-white/8 bg-[#091522] px-4 py-3 outline-none"
            >
              {Object.values(athleteById).map((athlete) => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.nom} - {athlete.sport}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-white/65">Extrait precharge</span>
            <select
              value={selectedSample.title}
              onChange={(event) => {
                const sample =
                  voiceSamples.find((item) => item.title === event.target.value) ??
                  voiceSamples[0];
                setSelectedSample(sample);
                setAthleteId(sample.athleteId);
                setJournal(sample.text);
              }}
              className="rounded-2xl border border-white/8 bg-[#091522] px-4 py-3 outline-none"
            >
              {voiceSamples.map((sample) => (
                <option key={sample.title} value={sample.title}>
                  {sample.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 rounded-[24px] border border-white/8 bg-[#08111b] p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="pulse-dot h-3 w-3 rounded-full bg-red" />
            <p className="text-sm text-white/72">
              Ecrivez ou collez un journal pour simuler la transcription.
            </p>
          </div>
          <textarea
            value={journal}
            onChange={(event) => setJournal(event.target.value)}
            rows={8}
            className="w-full rounded-[22px] border border-white/8 bg-white/3 p-4 text-sm leading-7 outline-none"
            placeholder="Aujourd'hui j'ai perdu..."
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || journal.trim().length < 12}
              className="rounded-full bg-red px-5 py-3 text-sm font-semibold text-[#091522] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isLoading ? "Analyse en cours..." : "Analyser mon journal"}
            </button>
            <button
              onClick={() => {
                setAnalysis(null);
                setJournal(selectedSample.text);
              }}
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/75 transition hover:border-white/25 hover:text-white"
            >
              Recharger le sample
            </button>
          </div>
        </div>
      </section>

      <aside className="glass-card rounded-[28px] p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">
          Carte emotionnelle
        </p>
        <h3 className="mt-2 text-2xl font-semibold">
          {analysis ? "Resultat du journal" : "En attente d'analyse"}
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/70">
          {analysis
            ? `Journal associe a ${currentAthlete.nom}, ${currentAthlete.sport}.`
            : "Lancez une analyse pour construire la carte emotionnelle et generer un extrait fort."}
        </p>

        {analysis ? (
          <div className="float-in mt-6 grid gap-4">
            <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                Extrait fort
              </p>
              <p className="mt-3 text-lg leading-8 text-white/92">
                &quot;{analysis.extrait_fort}&quot;
              </p>
            </div>

            <div className="grid gap-3">
              {analysis.emotions.map((emotion) => (
                <div
                  key={emotion.nom}
                  className="rounded-3xl border border-white/8 bg-white/4 p-4"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span>{emotion.nom}</span>
                    <span>{emotion.score}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/8">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${emotion.score}%`,
                        backgroundColor: emotion.couleur,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                Themes
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.themes.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-full border border-gold/25 bg-gold/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-gold"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-white/12 bg-white/3 p-6 text-sm leading-7 text-white/65">
            Ici apparaitront les emotions detectees, les themes recurrents, la
            citation cle et l&apos;intensite globale du journal.
          </div>
        )}
      </aside>
    </div>
  );
}

function readJournals(): SavedJournal[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedJournal[]) : [];
  } catch {
    return [];
  }
}
