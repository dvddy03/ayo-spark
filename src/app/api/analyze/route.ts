import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { getMockAnalysis } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    transcription?: string;
    langue?: string;
  };

  const transcription = body.transcription?.trim() ?? "";
  const langue = body.langue ?? "fr";

  if (!transcription) {
    return NextResponse.json(
      { error: "Transcription manquante." },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(getMockAnalysis(transcription));
  }

  try {
    const prompt = `Tu es un analyste emotionnel specialise en psychologie du sport olympique.
Retourne uniquement un JSON valide avec la forme :
{
  "emotions": [{"nom": string, "score": number, "couleur": "#hex"}],
  "themes": [string],
  "extrait_fort": string,
  "intensite": number,
  "connexions_potentielles": [string]
}
Maximum 4 emotions et 4 themes.
Langue detectee : ${langue}
Texte : "${transcription}"`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content.find((item) => item.type === "text");
    const parsed = text?.type === "text" ? safeJsonParse(text.text) : null;
    return NextResponse.json(parsed ?? getMockAnalysis(transcription));
  } catch {
    return NextResponse.json(getMockAnalysis(transcription));
  }
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}
