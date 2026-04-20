import { NextRequest, NextResponse } from "next/server";
import {
  DEMO_ATHLETE_ID,
  getMockAnalysis,
  type VoiceAnalysis,
} from "@/lib/mock-data";
import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
  isMissingTableError,
} from "@/lib/supabase";

type AudioEntryRow = {
  id: string;
  athlete_id: string;
  transcription: string | null;
  extrait_fort: string | null;
  themes: string[] | null;
  intensite: number | null;
  langue_detectee: string | null;
  created_at: string;
};

export async function GET(request: NextRequest) {
  const athleteId =
    request.nextUrl.searchParams.get("athleteId") ?? DEMO_ATHLETE_ID;

  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json({ entries: [], source: "mock" });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("audio_entries")
      .select(
        "id, athlete_id, transcription, extrait_fort, themes, intensite, langue_detectee, created_at",
      )
      .eq("athlete_id", athleteId)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json({ entries: [], source: "mock" });
      }

      return NextResponse.json({ entries: [], source: "mock", warning: error.message });
    }

    return NextResponse.json({
      entries: (data as AudioEntryRow[]).map((row) => ({
        id: row.id,
        athleteId: row.athlete_id,
        transcription: row.transcription ?? "",
        extrait: row.extrait_fort ?? "",
        themes: row.themes ?? [],
        intensite: row.intensite ?? 0,
        langueDetectee: row.langue_detectee ?? "fr",
        createdAt: row.created_at,
      })),
      source: "supabase",
    });
  } catch {
    return NextResponse.json({ entries: [], source: "mock" });
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    athleteId?: string;
    transcription?: string;
    langueDetectee?: string;
    analysis?: VoiceAnalysis;
    jourJOJ?: number;
  };

  const athleteId = body.athleteId ?? DEMO_ATHLETE_ID;
  const transcription = body.transcription?.trim() ?? "";
  const langueDetectee = body.langueDetectee ?? "fr";
  const analysis = body.analysis ?? getMockAnalysis(transcription);
  const jourJOJ = body.jourJOJ ?? 1;

  if (!transcription) {
    return NextResponse.json(
      { error: "Transcription manquante." },
      { status: 400 },
    );
  }

  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json({ saved: false, source: "mock" });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("audio_entries")
      .insert({
        athlete_id: athleteId,
        transcription,
        langue_detectee: langueDetectee,
        emotions: analysis.emotions,
        themes: analysis.themes,
        extrait_fort: analysis.extrait_fort,
        intensite: analysis.intensite,
        connexions_potentielles: analysis.connexions_potentielles,
        jour_joj: jourJOJ,
      })
      .select("id, athlete_id, transcription, extrait_fort, themes, intensite, langue_detectee, created_at")
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json({ saved: false, source: "mock" });
      }

      return NextResponse.json(
        { saved: false, source: "supabase", warning: error.message },
        { status: 500 },
      );
    }

    const row = data as AudioEntryRow;

    return NextResponse.json({
      saved: true,
      source: "supabase",
      entry: {
        id: row.id,
        athleteId: row.athlete_id,
        transcription: row.transcription ?? "",
        extrait: row.extrait_fort ?? "",
        themes: row.themes ?? [],
        intensite: row.intensite ?? 0,
        langueDetectee: row.langue_detectee ?? "fr",
        createdAt: row.created_at,
      },
    });
  } catch {
    return NextResponse.json({ saved: false, source: "mock" });
  }
}

