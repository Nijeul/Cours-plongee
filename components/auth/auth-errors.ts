/** Traduction en français des messages d'erreur Supabase Auth les plus courants. */
export function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (m.includes("email not confirmed")) {
    return "Votre adresse email n'est pas encore confirmée. Vérifiez votre boîte de réception.";
  }
  if (m.includes("user already registered")) {
    return "Un compte existe déjà avec cette adresse email.";
  }
  if (m.includes("password should be at least")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }
  if (m.includes("email rate limit") || m.includes("rate limit")) {
    return "Trop de tentatives. Patientez quelques minutes avant de réessayer.";
  }
  if (m.includes("invalid email") || m.includes("unable to validate email")) {
    return "Adresse email invalide.";
  }
  if (m.includes("new password should be different")) {
    return "Le nouveau mot de passe doit être différent de l'ancien.";
  }
  if (m.includes("auth session missing")) {
    return "Session expirée ou absente. Ouvrez à nouveau le lien reçu par email.";
  }
  if (m.includes("fetch") || m.includes("network")) {
    return "Connexion au serveur impossible. Vérifiez votre connexion internet.";
  }
  return `Une erreur est survenue : ${message}`;
}
