import { PageShell } from "@/components/page-shell";
import { TranslatorDemo } from "@/components/translator-demo";

export default function TranslatePage() {
  return (
    <PageShell
      eyebrow="AYO GUIDE - Interpreteur"
      title="Une conversation bilingue qui reste utilisable meme en mode fallback"
      description="La traduction appelle Anthropic si la cle est presente, puis retombe automatiquement sur un comportement demo pour ne jamais bloquer l'utilisateur pendant le hackathon."
    >
      <TranslatorDemo />
    </PageShell>
  );
}
