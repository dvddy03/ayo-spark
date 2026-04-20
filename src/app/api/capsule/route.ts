import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { athleteById, getCapsuleForAthlete } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    athleteId?: string;
    journalExcerpts?: string[];
  };

  const athleteId = body.athleteId ?? "a4";
  const excerpts = body.journalExcerpts ?? [];
  const athlete = athleteById[athleteId] ?? athleteById.a4;

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      narrative: getCapsuleForAthlete(athlete.id, excerpts),
    });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 700,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: `Tu es l'archiviste officiel des JOJ Dakar 2026.
Ecris une capsule narrative de 220 a 280 mots, sobre et litteraire, en francais.
Athlete : ${athlete.nom} (${athlete.sport}, ${athlete.pays})
Extraits : ${excerpts.join(" | ") || "Aucun extrait supplementaire."}
Retourne uniquement le texte narratif.`,
        },
      ],
    });

    const text = response.content.find((item) => item.type === "text");
    return NextResponse.json({
      narrative:
        text?.type === "text"
          ? text.text
          : getCapsuleForAthlete(athlete.id, excerpts),
    });
  } catch {
    return NextResponse.json({
      narrative: getCapsuleForAthlete(athlete.id, excerpts),
    });
  }
}
