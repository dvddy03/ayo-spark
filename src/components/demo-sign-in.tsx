"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoAuth } from "@/components/auth-provider";

export function DemoSignIn() {
  const router = useRouter();
  const {
    signInAsGuest,
    signInWithPassword,
    signUpWithPassword,
    resendConfirmationEmail,
    user,
  } = useDemoAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);
    setFeedback(null);
    setNeedsEmailConfirmation(false);

    try {
      const result =
        mode === "signin"
          ? await signInWithPassword(email, password)
          : await signUpWithPassword(email, password, fullName);

      if (result.error) {
        if (result.requiresEmailConfirmation) {
          setNeedsEmailConfirmation(true);
          setFeedback(
            "Votre compte existe bien, mais l'email n'a pas encore ete confirme. Ouvrez votre boite mail puis cliquez sur le lien de validation.",
          );
          return;
        }

        setFeedback(result.error);
        return;
      }

      if (mode === "signup" && result.requiresEmailConfirmation) {
        setNeedsEmailConfirmation(true);
        setFeedback(
          "Compte cree. Un email de confirmation vient d'etre envoye. Validez-le puis revenez vous connecter.",
        );
        return;
      }

      setFeedback("Connexion reussie. Redirection vers l'espace principal...");

      router.push("/athlete");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuest() {
    setIsLoading(true);
    setFeedback(null);
    setNeedsEmailConfirmation(false);

    try {
      const result = await signInAsGuest();
      if (result.error) {
        setFeedback(result.error);
        return;
      }
      router.push("/athlete");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendConfirmation() {
    if (!email) {
      setFeedback("Saisissez d'abord l'email utilise lors de l'inscription.");
      return;
    }

    setIsLoading(true);
    try {
      const error = await resendConfirmationEmail(email);
      setFeedback(
        error
          ? error
          : "Un nouvel email de confirmation vient d'etre envoye. Pensez aussi a verifier le dossier spam.",
      );
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
            Session active : {user.email ?? "session anonyme"}
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="rounded-[28px] border border-white/8 bg-[#08111b] p-5">
          <p className="text-sm text-white/62">Choisissez un mode d&apos;acces</p>
          <div className="mt-4 grid gap-3">
            {([
              ["signin", "Connexion", "Utilisez votre email et votre mot de passe pour entrer dans l'application."],
              ["signup", "Inscription", "Creez votre compte utilisateur pour acceder durablement a la plateforme."],
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
              Une fois connecte, vous accedez a la plateforme avec une vraie session Supabase.
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
              {needsEmailConfirmation ? (
                <button
                  onClick={handleResendConfirmation}
                  disabled={isLoading || !email}
                  className="rounded-full border border-cyan/20 bg-cyan/10 px-5 py-3 text-sm text-cyan transition hover:brightness-110 disabled:opacity-60"
                >
                  Renvoyer l&apos;email de confirmation
                </button>
              ) : null}
              <button
                onClick={handleGuest}
                disabled={isLoading}
                className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/72 transition hover:border-white/25 hover:text-white disabled:opacity-60"
              >
                Continuer sans compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
