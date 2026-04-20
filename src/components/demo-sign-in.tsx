"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoAuth } from "@/components/auth-provider";

export function DemoSignIn() {
  const router = useRouter();
  const { signInAsGuest, signInWithPassword, signUpWithPassword, user } =
    useDemoAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);
    setFeedback(null);

    try {
      const error =
        mode === "signin"
          ? await signInWithPassword(email, password)
          : await signUpWithPassword(email, password, fullName);

      if (error) {
        setFeedback(error);
        return;
      }

      setFeedback(
        mode === "signup"
          ? "Compte cree. Si votre projet exige une confirmation email, verifiez votre boite mail avant de revenir."
          : "Connexion reussie. Redirection vers l'espace principal...",
      );

      if (mode === "signin") {
        router.push("/athlete");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuest() {
    setIsLoading(true);
    setFeedback(null);

    try {
      const error = await signInAsGuest();
      if (error) {
        setFeedback(error);
        return;
      }
      router.push("/athlete");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="auth-panel" className="glass-card rounded-[32px] p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gold">
            Authentification
          </p>
          <h2 className="mt-2 text-3xl font-semibold">
            Entrez dans AYO SPARK avec une vraie session utilisateur
          </h2>
        </div>
        {user ? (
          <div className="rounded-full border border-green/20 bg-green/12 px-4 py-2 text-sm text-green">
            Session active : {user.email ?? "invite"}
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="rounded-[28px] border border-white/8 bg-[#08111b] p-5">
          <p className="text-sm text-white/62">Choisissez un mode d&apos;acces</p>
          <div className="mt-4 grid gap-3">
            {([
              ["signin", "Connexion", "Utilisez votre email et votre mot de passe pour entrer dans l'app."],
              ["signup", "Inscription", "Creez un compte reel Supabase pour utiliser durablement l'application."],
            ] as const).map(([item, label, description]) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                className={`rounded-[24px] border px-4 py-4 text-left transition ${
                  mode === item
                    ? "border-gold/30 bg-gold/10"
                    : "border-white/8 bg-white/4 hover:border-white/18"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">
                  Mode
                </p>
                <p className="mt-2 text-xl font-semibold">{label}</p>
                <p className="mt-2 text-sm leading-7 text-white/72">
                  {description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/8 bg-white/4 p-5">
          <p className="text-sm text-white/62">Vos identifiants</p>
          <div className="mt-4 grid gap-4">
            {mode === "signup" ? (
              <label className="grid gap-2">
                <span className="text-sm text-white/68">Nom complet</span>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-[#091522] px-4 py-3 outline-none"
                  placeholder="Hassan Omar"
                />
              </label>
            ) : null}
            <label className="grid gap-2">
              <span className="text-sm text-white/68">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-2xl border border-white/10 bg-[#091522] px-4 py-3 outline-none"
                placeholder="vous@exemple.com"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-white/68">Mot de passe</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-white/10 bg-[#091522] px-4 py-3 outline-none"
                placeholder="Au moins 6 caracteres"
              />
            </label>
          </div>

          <div className="mt-5 rounded-[24px] border border-white/8 bg-[#08111b] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">
              Acces reel
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {mode === "signin" ? "Connexion utilisateur" : "Creation de compte"}
            </p>
            <p className="mt-3 text-sm leading-7 text-white/72">
              Une fois connecte, vous accedez a la vraie application avec session Supabase.
            </p>
            {feedback ? (
              <div className="mt-4 rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-white/76">
                {feedback}
              </div>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handleSubmit}
                disabled={isLoading || !email || !password}
                className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-[#091522] disabled:opacity-60"
              >
                {isLoading
                  ? "Traitement..."
                  : mode === "signin"
                    ? "Se connecter"
                    : "Creer mon compte"}
              </button>
              <button
                onClick={handleGuest}
                disabled={isLoading}
                className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/72 transition hover:border-white/25 hover:text-white disabled:opacity-60"
              >
                Continuer comme invite
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
