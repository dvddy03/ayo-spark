import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { VoiceStudio } from "@/components/voice-studio";

export default function VoicePage() {
  return (
    <PageShell
      eyebrow="Module 1 - AYO VOICE"
      title="Capture emotionnelle et extrait fort en moins d'une minute"
      description="La version actuelle utilise une saisie texte pour rester fiable sans bloquer le deploiement. Les analyses emotionnelles et la sauvegarde locale sont deja utilisables."
    >
      <VoiceStudio />
      <div className="flex justify-end">
        <Link
          href="/capsule/hassan-omar"
          className="rounded-full bg-purple px-5 py-3 text-sm font-semibold text-white"
        >
          Voir la capsule narrative
        </Link>
      </div>
    </PageShell>
  );
}
