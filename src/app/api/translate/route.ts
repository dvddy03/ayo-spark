import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { getMockTranslation } from "@/lib/mock-data";

const languageNames: Record<string, string> = {
  fr: "francais",
  en: "anglais",
  wo: "wolof",
  ja: "japonais",
  pt: "portugais",
  so: "somali",
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    text?: string;
    source_lang?: string;
    target_lang?: string;
  };

  const text = body.text?.trim() ?? "";
  const sourceLang = body.source_lang ?? "fr";
  const targetLang = body.target_lang ?? "en";

  if (!text) {
    return NextResponse.json({ error: "Texte manquant." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      translation: getMockTranslation(text, sourceLang, targetLang),
    });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 220,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: `Traduis ce texte de ${languageNames[sourceLang] ?? sourceLang} vers ${languageNames[targetLang] ?? targetLang}. Retourne uniquement la traduction. Texte : "${text}"`,
        },
      ],
    });

    const output = response.content.find((item) => item.type === "text");
    return NextResponse.json({
      translation:
        output?.type === "text"
          ? output.text
          : getMockTranslation(text, sourceLang, targetLang),
    });
  } catch {
    return NextResponse.json({
      translation: getMockTranslation(text, sourceLang, targetLang),
    });
  }
}
