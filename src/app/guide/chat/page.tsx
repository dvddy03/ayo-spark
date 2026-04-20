import { PageShell } from "@/components/page-shell";
import { GuideChat } from "@/components/guide-chat";

export default function GuideChatPage() {
  return (
    <PageShell
      eyebrow="AYO GUIDE - Chat"
      title="Un guide pratique sur Dakar, Diamniadio, Saly, le TER et les sorties utiles"
      description="Le chatbot repond avec Anthropic si disponible. Sinon il exploite les donnees JOJ integrees pour garder une experience stable et courte, adaptee a la demo."
    >
      <GuideChat />
    </PageShell>
  );
}
