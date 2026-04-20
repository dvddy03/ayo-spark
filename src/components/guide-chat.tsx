"use client";

import { useEffect, useState } from "react";
import { GUIDE_HISTORY_STORAGE_KEY } from "@/lib/mock-data";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function GuideChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("Ou puis-je manger apres ma competition ?");
  const [langue, setLangue] = useState("fr");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Restaurants",
    "Transport",
    "Tourisme",
    "Urgence",
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(GUIDE_HISTORY_STORAGE_KEY);
        setMessages(raw ? (JSON.parse(raw) as ChatMessage[]) : []);
      } catch {
        setMessages([]);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function sendMessage(nextMessage?: string) {
    const content = nextMessage ?? message;
    if (!content.trim()) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
    ];
    setMessages(nextMessages);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          langue,
          position: "Diamniadio",
          historique: nextMessages,
        }),
      });

      const data = (await response.json()) as {
        reponse: string;
        suggestions: string[];
      };

      const finalMessages = [
        ...nextMessages,
        { role: "assistant" as const, content: data.reponse },
      ];
      setMessages(finalMessages);
      setSuggestions(data.suggestions);
      localStorage.setItem(GUIDE_HISTORY_STORAGE_KEY, JSON.stringify(finalMessages));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
      <section className="glass-card rounded-[28px] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-orange">
              AYO GUIDE
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Guide local conversationnel</h2>
          </div>
          <select
            value={langue}
            onChange={(event) => setLangue(event.target.value)}
            className="rounded-full border border-white/10 bg-[#091522] px-4 py-2 text-sm"
          >
            <option value="fr">Francais</option>
            <option value="en">English</option>
            <option value="wo">Wolof</option>
          </select>
        </div>

        <div className="mt-5 flex min-h-[420px] flex-col gap-4 rounded-[28px] border border-white/8 bg-[#08111b] p-4">
          {messages.length > 0 ? (
            messages.map((entry, index) => (
              <div
                key={`${entry.role}-${index}`}
                className={`max-w-[86%] rounded-[24px] px-4 py-3 text-sm leading-7 ${
                  entry.role === "assistant"
                    ? "bg-[#13263a] text-white"
                    : "ml-auto bg-gold text-[#091522]"
                }`}
              >
                {entry.content}
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/12 bg-white/3 p-5 text-sm leading-7 text-white/65">
              Posez une question sur un restaurant, le TER, un taxi, une sortie a Dakar ou une urgence medicale.
            </div>
          )}
          {isLoading ? (
            <div className="max-w-[86%] rounded-[24px] bg-[#13263a] px-4 py-3 text-sm text-white/72">
              AYO reflechit...
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex gap-3">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="flex-1 rounded-full border border-white/10 bg-white/3 px-5 py-3 text-sm outline-none"
            placeholder="Comment aller a Dakar Arena ?"
          />
          <button
            onClick={() => sendMessage()}
            className="rounded-full bg-orange px-5 py-3 text-sm font-semibold text-[#091522]"
          >
            Envoyer
          </button>
        </div>
      </section>

      <aside className="glass-card rounded-[28px] p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">Suggestions rapides</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => sendMessage(suggestion)}
              className="rounded-full border border-gold/22 bg-gold/10 px-4 py-3 text-sm text-gold transition hover:brightness-110"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-[24px] border border-white/8 bg-white/4 p-4 text-sm leading-7 text-white/72">
          Chaque reponse integre un mot wolof quand c&apos;est pertinent, puis propose une suite utile pour l&apos;utilisateur.
        </div>
      </aside>
    </div>
  );
}
