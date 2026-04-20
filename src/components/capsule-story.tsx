"use client";

import { useEffect, useState } from "react";
import {
  JOURNAL_STORAGE_KEY,
  athleteById,
  getCapsuleForAthlete,
} from "@/lib/mock-data";

type SavedJournal = {
  athleteId: string;
  transcription: string;
  extrait: string;
  themes: string[];
  createdAt: string;
};

export function CapsuleStory({ athleteId }: { athleteId: string }) {
  const athlete = athleteById[athleteId] ?? athleteById.a4;
  const [story, setStory] = useState(getCapsuleForAthlete(athlete.id));
  const [entriesCount, setEntriesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const entries = readEntries().filter((entry) => entry.athleteId === athlete.id);
      setEntriesCount(entries.length);
      if (entries.length > 0) {
        setStory(getCapsuleForAthlete(athlete.id, entries.map((entry) => entry.extrait)));
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [athlete.id]);

  async function regenerate() {
    setIsLoading(true);

    try {
      const entries = readEntries().filter((entry) => entry.athleteId === athlete.id);
      const response = await fetch("/api/capsule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athleteId: athlete.id,
          journalExcerpts: entries.map((entry) => entry.extrait),
        }),
      });
      const data = (await response.json()) as { narrative: string };
      setStory(data.narrative);
      setEntriesCount(entries.length);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
      <section className="glass-card rounded-[28px] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-purple">
          Capsule Narrative
        </p>
        <h2 className="mt-2 text-3xl font-semibold">{athlete.nom}</h2>
        <p className="mt-4 text-base leading-8 text-white/78">{story}</p>
      </section>

      <aside className="glass-card rounded-[28px] p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">Memoire vivante</p>
        <div className="mt-5 grid gap-4">
          <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
            <p className="text-sm text-white/58">Sport</p>
            <p className="mt-2 text-xl font-semibold">{athlete.sport}</p>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
            <p className="text-sm text-white/58">Journaux detectes</p>
            <p className="mt-2 text-xl font-semibold">{entriesCount}</p>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-white/4 p-5">
            <p className="text-sm text-white/58">Langue native</p>
            <p className="mt-2 text-xl font-semibold">{athlete.langueNative.toUpperCase()}</p>
          </div>
        </div>
        <button
          onClick={regenerate}
          className="mt-6 w-full rounded-full bg-purple px-5 py-3 text-sm font-semibold text-white"
        >
          {isLoading ? "Generation..." : "Regenerer la capsule"}
        </button>
      </aside>
    </div>
  );
}

function readEntries(): SavedJournal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedJournal[]) : [];
  } catch {
    return [];
  }
}
