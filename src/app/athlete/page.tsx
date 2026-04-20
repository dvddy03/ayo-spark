import { AthleteOverview } from "@/components/athlete-overview";
import { AuthGate } from "@/components/auth-gate";
import { PageShell } from "@/components/page-shell";

export default function AthleteDashboardPage() {
  return (
    <PageShell
      eyebrow="Dashboard athlete"
      title="Espace athlete - un point d'entree personnel avant le journal, les sparks et la capsule"
      description="Pour la presentation jury, cet espace devient un vrai tableau de bord utilisateur. L'athlete se connecte d'abord, puis retrouve son profil, ses modules et ses actions prioritaires."
    >
      <AuthGate>
        <AthleteOverview />
      </AuthGate>
    </PageShell>
  );
}
