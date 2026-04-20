import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { JOJ_DATA, detectSuggestions, getMockGuideReply } from "@/lib/mock-data";
import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
  isMissingTableError,
} from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    message?: string;
    langue?: string;
    position?: string;
    historique?: { role: "user" | "assistant"; content: string }[];
  };

  const message = body.message?.trim() ?? "";
  const langue = body.langue ?? "fr";
  const position = body.position ?? "Diamniadio";
  const historique = body.historique ?? [];

  if (!message) {
    return NextResponse.json(
      { error: "Message manquant." },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    const payload = getMockGuideReply(message, langue, position);
    await saveConversation({
      message,
      reponse: payload.reponse,
      langue,
    });
    return NextResponse.json(payload);
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 350,
      system: `Tu es AYO GUIDE, assistant officiel des JOJ Dakar 2026.
Tu reponds en ${langue}.
Tu dois rester pratique, court, utile.
Position actuelle de l'utilisateur : ${position}
Integre un mot wolof avec traduction si possible.
Contexte JOJ : ${JSON.stringify(JOJ_DATA)}`,
      messages: [
        ...historique.slice(-6).map((entry) => ({
          role: entry.role,
          content: entry.content,
        })),
        { role: "user" as const, content: message },
      ],
    });

    const text = response.content.find((item) => item.type === "text");
    const payload = {
      reponse:
        text?.type === "text"
          ? text.text
          : getMockGuideReply(message, langue, position).reponse,
      suggestions: detectSuggestions(message),
    };
    await saveConversation({
      message,
      reponse: payload.reponse,
      langue,
    });
    return NextResponse.json(payload);
  } catch {
    const payload = getMockGuideReply(message, langue, position);
    await saveConversation({
      message,
      reponse: payload.reponse,
      langue,
    });
    return NextResponse.json(payload);
  }
}

async function saveConversation({
  message,
  reponse,
  langue,
}: {
  message: string;
  reponse: string;
  langue: string;
}) {
  if (!hasSupabaseAdminEnv()) return;

  try {
    const supabase = createSupabaseAdminClient();
    const category = detectSuggestions(message)[0] ?? "guide";
    const { error } = await supabase.from("conversations_guide").insert({
      message,
      reponse,
      langue,
      categorie: category,
    });

    if (error && !isMissingTableError(error)) {
      console.warn("Failed to save guide conversation:", error.message);
    }
  } catch {
    console.warn("Failed to save guide conversation.");
  }
}
