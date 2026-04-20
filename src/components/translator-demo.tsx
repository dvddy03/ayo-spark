"use client";

import { useEffect, useState } from "react";
import { TRANSLATOR_HISTORY_STORAGE_KEY, languages } from "@/lib/mock-data";

type Exchange = {
  id: string;
  sourceLang: string;
  targetLang: string;
  original: string;
  translation: string;
};

export function TranslatorDemo() {
  const [sourceLang, setSourceLang] = useState("fr");
  const [targetLang, setTargetLang] = useState("wo");
  const [text, setText] = useState("Bonjour, comment aller au Village Olympique ?");
  const [history, setHistory] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(TRANSLATOR_HISTORY_STORAGE_KEY);
        setHistory(raw ? (JSON.parse(raw) as Exchange[]) : []);
      } catch {
        setHistory([]);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function handleTranslate() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          source_lang: sourceLang,
          target_lang: targetLang,
        }),
      });

      const data = (await response.json()) as { translation: string };
      const next = [
        {
          id: crypto.randomUUID(),
          sourceLang,
          targetLang,
          original: text,
          translation: data.translation,
        },
        ...history,
      ].slice(0, 6);

      setHistory(next);
      localStorage.setItem(TRANSLATOR_HISTORY_STORAGE_KEY, JSON.stringify(next));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
      <section className="glass-card rounded-[28px] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-orange">
              Interpreteur
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Conversation bilingue</h2>
          </div>
          {sourceLang === "wo" || targetLang === "wo" ? (
            <div className="rounded-full border border-orange/25 bg-orange/10 px-4 py-2 text-sm text-orange">
              Wolof - traduction speciale IA
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-white/65">Langue A</span>
            <select
              value={sourceLang}
              onChange={(event) => setSourceLang(event.target.value)}
              className="rounded-2xl border border-white/8 bg-[#091522] px-4 py-3"
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-white/65">Langue B</span>
            <select
              value={targetLang}
              onChange={(event) => setTargetLang(event.target.value)}
              className="rounded-2xl border border-white/8 bg-[#091522] px-4 py-3"
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <textarea
          rows={7}
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="mt-5 w-full rounded-[24px] border border-white/8 bg-[#08111b] p-4 text-sm leading-7 outline-none"
        />
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleTranslate}
            disabled={isLoading || !text.trim()}
            className="rounded-full bg-orange px-5 py-3 text-sm font-semibold text-[#091522] disabled:opacity-60"
          >
            {isLoading ? "Traduction..." : "Traduire"}
          </button>
          <button
            onClick={() => setText("Merci, ou puis-je trouver un taxi ?")}
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/72"
          >
            Exemple rapide
          </button>
        </div>
      </section>

      <aside className="glass-card rounded-[28px] p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">
          Derniers echanges
        </p>
        <div className="mt-5 grid gap-4">
          {history.length > 0 ? (
            history.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-white/8 bg-white/4 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                  {item.sourceLang.toUpperCase()} vers {item.targetLang.toUpperCase()}
                </p>
                <p className="mt-3 text-sm text-white/60">{item.original}</p>
                <p className="mt-3 text-lg font-medium text-white">{item.translation}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/12 bg-white/3 p-5 text-sm leading-7 text-white/65">
              Les deux derniers echanges apparaitront ici avec le texte original et sa traduction.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
