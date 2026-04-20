import { AuthGate } from "@/components/auth-gate";
import { PageShell } from "@/components/page-shell";
import { ReporterDashboard } from "@/components/reporter-dashboard";

export default function ReporterPage() {
  return (
    <PageShell
      eyebrow="Module 3 - REPORTER MODE"
      title="Un tableau de bord qui transforme un spark accepte en histoire forte"
      description="Le flux reporter est relie au statut des sparks. Une fois un Spark Teranga accepte cote athlete, le journaliste voit remonter une alerte prioritaire et un briefing d'interview."
    >
      <AuthGate>
        <ReporterDashboard />
      </AuthGate>
    </PageShell>
  );
}
