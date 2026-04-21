"use client";

import Link from "next/link";
import { useDemoAuth } from "@/components/auth-provider";

export function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isReady, session } = useDemoAuth();

  if (!isReady) {
    return (
      <div className="glass-card rounded-[28px] p-6 text-sm text-white/72">
        Preparation de votre session...
      </div>
    );
  }

  if (!session) {
    return (
      <GateMessage
        title="Connexion requise"
        description="Connectez-vous pour acceder a cet espace. Vous pouvez utiliser un compte email classique ou, si vous l'avez active dans Supabase, ouvrir une session anonyme."
      />
    );
  }

  return <>{children}</>;
}

function GateMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card rounded-[28px] p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.28em] text-gold">Acces controle</p>
      <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/74">
        {description}
      </p>
      <Link
        href="/#auth-panel"
        className="mt-6 inline-flex rounded-full bg-gold px-5 py-3 text-sm font-semibold text-[#091522]"
      >
        Se connecter
      </Link>
    </div>
  );
}
