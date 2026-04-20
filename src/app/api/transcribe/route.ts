import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    transcription: "Je me bats pour tous ceux qui ne peuvent pas etre ici.",
    langue_detectee: "fr",
    source: process.env.OPENAI_API_KEY ? "placeholder" : "mock",
  });
}
