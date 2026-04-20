import { NextResponse } from "next/server";
import { athletes } from "@/lib/mock-data";
import {
  createSupabaseAdminClient,
  hasSupabaseAdminEnv,
  isMissingTableError,
} from "@/lib/supabase";

type AthleteRow = {
  id: string;
  nom: string;
  pays: string;
  code_pays: string;
  sport: string;
  langue_native: string;
  type: "athlete" | "reporter" | "benevole";
  est_refugie: boolean | null;
  photo_url: string | null;
  position_actuelle: string | null;
};

export async function GET() {
  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json({ athletes, source: "mock" });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("athletes")
      .select(
        "id, nom, pays, code_pays, sport, langue_native, type, est_refugie, photo_url, position_actuelle",
      )
      .order("created_at", { ascending: true });

    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json({ athletes, source: "mock" });
      }

      return NextResponse.json({ athletes, source: "mock", warning: error.message });
    }

    const normalized = (data as AthleteRow[]).map((row) => ({
      id: row.id,
      slug: slugify(row.nom),
      nom: row.nom,
      pays: row.pays,
      codePays: row.code_pays,
      sport: row.sport,
      langueNative: row.langue_native,
      type: row.type,
      estRefugie: row.est_refugie ?? false,
      photoUrl: row.photo_url ?? undefined,
      positionActuelle: row.position_actuelle ?? "Diamniadio",
      emotionPrincipale: "Profil importe depuis Supabase",
    }));

    return NextResponse.json({
      athletes: normalized.length > 0 ? normalized : athletes,
      source: normalized.length > 0 ? "supabase" : "mock",
    });
  } catch {
    return NextResponse.json({ athletes, source: "mock" });
  }
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

