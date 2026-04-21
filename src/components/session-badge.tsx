"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoAuth } from "@/components/auth-provider";

export function SessionBadge() {
  const pathname = usePathname();
  const { isReady, user, signOut } = useDemoAuth();

  if (!isReady) {
    return (
      <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/45">
        Initialisation...
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/#auth-panel"
        className="rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-gold"
      >
        Connexion
      </Link>
    );
  }

  const label = user.email ?? "session anonyme";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/72">
        Session : {label}
      </div>
      {pathname !== "/athlete" ? (
        <Link
          href="/athlete"
          className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/68 transition hover:border-gold/30 hover:text-white"
        >
          Espace principal
        </Link>
      ) : null}
      <button
        onClick={signOut}
        className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/68 transition hover:border-red/30 hover:text-white"
      >
        Se deconnecter
      </button>
    </div>
  );
}
