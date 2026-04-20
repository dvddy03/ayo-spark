import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { CapsuleStory } from "@/components/capsule-story";
import { athletes } from "@/lib/mock-data";

export default async function CapsulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const athlete = athletes.find((entry) => entry.slug === id || entry.id === id);

  if (!athlete) {
    notFound();
  }

  return (
    <PageShell
      eyebrow="Capsule narrative"
      title={`La memoire olympique de ${athlete.nom}`}
      description="Cette page assemble une capsule pre-generee et peut aussi regenerer un texte a partir des journaux deja saisis dans le navigateur."
    >
      <CapsuleStory athleteId={athlete.id} />
    </PageShell>
  );
}
