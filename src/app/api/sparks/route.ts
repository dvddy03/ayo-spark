import { NextRequest, NextResponse } from "next/server";
import { sparks, type Spark } from "@/lib/mock-data";
import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
  isMissingTableError,
} from "@/lib/supabase";

type SparkRow = {
  id: string;
  athlete1_id: string;
  athlete2_id: string;
  type: Spark["type"];
  score: number;
  lien_commun: string;
  lieu_suggere: string | null;
  heure_suggeree: string | null;
  statut: Spark["statut"];
};

export async function GET() {
  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json({ sparks, source: "mock" });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("sparks")
      .select(
        "id, athlete1_id, athlete2_id, type, score, lien_commun, lieu_suggere, heure_suggeree, statut",
      )
      .order("score", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json({ sparks, source: "mock" });
      }

      return NextResponse.json({ sparks, source: "mock", warning: error.message });
    }

    const normalized = (data as SparkRow[]).map(normalizeSpark);
    return NextResponse.json({
      sparks: normalized.length > 0 ? normalized : sparks,
      source: normalized.length > 0 ? "supabase" : "mock",
    });
  } catch {
    return NextResponse.json({ sparks, source: "mock" });
  }
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as {
    id?: string;
    statut?: Spark["statut"];
  };

  const id = body.id ?? "";
  const statut = body.statut ?? "pending";

  if (!id) {
    return NextResponse.json({ error: "Spark manquant." }, { status: 400 });
  }

  if (!hasSupabaseAdminEnv()) {
    const spark = sparks.find((item) => item.id === id);
    return NextResponse.json({
      spark: spark ? { ...spark, statut } : null,
      source: "mock",
    });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("sparks")
      .update({ statut })
      .eq("id", id)
      .select(
        "id, athlete1_id, athlete2_id, type, score, lien_commun, lieu_suggere, heure_suggeree, statut",
      )
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        const spark = sparks.find((item) => item.id === id);
        return NextResponse.json({
          spark: spark ? { ...spark, statut } : null,
          source: "mock",
        });
      }

      return NextResponse.json(
        { error: error.message, source: "supabase" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      spark: normalizeSpark(data as SparkRow),
      source: "supabase",
    });
  } catch {
    const spark = sparks.find((item) => item.id === id);
    return NextResponse.json({
      spark: spark ? { ...spark, statut } : null,
      source: "mock",
    });
  }
}

function normalizeSpark(row: SparkRow): Spark {
  return {
    id: row.id,
    athlete1Id: row.athlete1_id,
    athlete2Id: row.athlete2_id,
    type: row.type,
    score: row.score,
    lienCommun: row.lien_commun,
    lieuSuggere: row.lieu_suggere ?? "Corniche de Dakar",
    heureSuggeree: row.heure_suggeree ?? "18:30",
    statut: row.statut,
  };
}

