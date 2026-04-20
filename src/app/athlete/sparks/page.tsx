import { PageShell } from "@/components/page-shell";
import { SparksBoard } from "@/components/sparks-board";

export default function SparksPage() {
  return (
    <PageShell
      eyebrow="Module 2 - TERANGA SPARK"
      title="Des connexions humaines prioritaires, deja prêtes pour la scene"
      description="Les cartes de spark sont prechargees avec des scores forts. L'utilisateur peut accepter un spark, ce qui met a jour l'etat local et alimente ensuite le dashboard reporter."
    >
      <SparksBoard />
    </PageShell>
  );
}
